const Grain = require('../models/Grain');
const { asyncHandler } = require('../middleware/error');
const { getFileUrl } = require('../middleware/upload');

// @desc    Create a new grain listing
// @route   POST /api/grains
// @access  Private (Farmers only)
exports.createGrain = asyncHandler(async (req, res, next) => {
  console.log('🌾 Creating grain with data:', JSON.stringify(req.body, null, 2));
  console.log('🌾 User ID:', req.user.id);
  console.log('🌾 User object:', JSON.stringify(req.user, null, 2));
  console.log('🌾 Files received:', req.files ? req.files.length : 'No files');

  // Parse JSON strings for nested objects when using multipart/form-data
  const grainData = { ...req.body };
  
  // Handle location fields sent individually
  if (req.body['location.address'] || req.body['location.city'] || req.body['location.state'] || req.body['location.pincode']) {
    console.log('🌾 Building location from individual fields');
    grainData.location = {
      address: req.body['location.address'] || '',
      city: req.body['location.city'] || '',
      state: req.body['location.state'] || '',
      pincode: req.body['location.pincode'] || ''
    };
    
    // Remove the individual location fields from grainData
    delete grainData['location.address'];
    delete grainData['location.city'];
    delete grainData['location.state'];
    delete grainData['location.pincode'];
    
    console.log('🌾 Reconstructed location:', grainData.location);
  } else if (typeof grainData.location === 'string') {
    // Fallback: try to parse as JSON string
    try {
      console.log('🌾 Parsing location JSON string:', grainData.location);
      grainData.location = JSON.parse(grainData.location);
      console.log('🌾 Parsed location:', grainData.location);
    } catch (error) {
      console.error('🌾 Error parsing location JSON:', error);
      grainData.location = { address: '', city: '', state: '', pincode: '' };
    }
  } else if (!grainData.location || typeof grainData.location !== 'object') {
    console.log('🌾 No location data found, creating empty location');
    grainData.location = { address: '', city: '', state: '', pincode: '' };
  }

  // Handle other JSON fields
  if (typeof grainData.certifications === 'string') {
    try {
      grainData.certifications = JSON.parse(grainData.certifications);
    } catch (error) {
      console.error('🌾 Error parsing certifications JSON:', error);
      grainData.certifications = [];
    }
  }

  console.log('🌾 Final processed location:', grainData.location);

  // Add farmer to grain data
  grainData.farmer = req.user.id;

  // Auto-approve grains for now (can be changed later for moderation)
  grainData.status = 'approved';

  // Handle image uploads
  if (req.files && req.files.length > 0) {
    grainData.images = req.files.map(file => ({
      url: getFileUrl(req, file.path),
      alt: `${grainData.grainType} ${grainData.variety} image`
    }));
  }

  try {
    const grain = await Grain.create(grainData);
    await grain.populate('farmer', 'name phone address.city address.state');

    console.log('🌾 Grain created successfully:', grain._id);
    
    res.status(201).json({
      success: true,
      message: 'Grain listing created successfully',
      data: {
        grain
      }
    });
  } catch (error) {
    console.error('🌾 Grain creation error:', error);
    console.error('🌾 Error name:', error.name);
    console.error('🌾 Error message:', error.message);
    if (error.name === 'ValidationError') {
      console.error('🌾 Validation errors:', Object.keys(error.errors));
      Object.keys(error.errors).forEach(field => {
        console.error(`🌾 ${field}: ${error.errors[field].message}`);
      });
    }
    throw error;
  }
});

// @desc    Get all grains with filters
// @route   GET /api/grains
// @access  Public
exports.getGrains = asyncHandler(async (req, res, next) => {
  const {
    grainType,
    state,
    city,
    minPrice,
    maxPrice,
    minQuantity,
    qualityGrade,
    isOrganic,
    page = 1,
    limit = 12,
    sort = '-createdAt'
  } = req.query;

  // Build filter object
  const filters = {
    grainType,
    state,
    city,
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    minQuantity: minQuantity ? parseFloat(minQuantity) : undefined,
    qualityGrade,
    isOrganic: isOrganic === 'true' ? true : isOrganic === 'false' ? false : undefined
  };

  // Remove undefined values
  Object.keys(filters).forEach(key => {
    if (filters[key] === undefined) delete filters[key];
  });

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Get grains using the static method
  const query = Grain.findByFilters(filters);
  
  // Add pagination and sorting
  const grains = await query
    .sort(sort)
    .skip(skip)
    .limit(limitNum);

  // Get total count for pagination
  const total = await Grain.countDocuments(
    Grain.findByFilters(filters).getQuery()
  );

  // Calculate pagination info
  const totalPages = Math.ceil(total / limitNum);
  const hasNextPage = pageNum < totalPages;
  const hasPrevPage = pageNum > 1;

  res.status(200).json({
    success: true,
    count: grains.length,
    pagination: {
      current: pageNum,
      total: totalPages,
      hasNext: hasNextPage,
      hasPrev: hasPrevPage,
      limit: limitNum,
      totalItems: total
    },
    data: {
      grains
    }
  });
});

// @desc    Get single grain
// @route   GET /api/grains/:id
// @access  Public
exports.getGrain = asyncHandler(async (req, res, next) => {
  const grain = await Grain.findById(req.params.id)
    .populate('farmer', 'name phone address profileImage')
    .populate('likes', 'name');

  if (!grain) {
    return res.status(404).json({
      success: false,
      message: 'Grain not found'
    });
  }

  // Increment views count
  grain.views += 1;
  await grain.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: {
      grain
    }
  });
});

// @desc    Update grain
// @route   PUT /api/grains/:id
// @access  Private (Farmer who owns the grain)
exports.updateGrain = asyncHandler(async (req, res, next) => {
  let grain = await Grain.findById(req.params.id);

  if (!grain) {
    return res.status(404).json({
      success: false,
      message: 'Grain not found'
    });
  }

  // Make sure user is the owner of the grain
  if (grain.farmer.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this grain'
    });
  }

  // Preserve current status unless explicitly changed
  // Only reset to pending if admin specifically sets it or if it's a new grain
  // For normal farmer edits, keep the current status
  if (!req.body.status) {
    // Don't automatically change status on edit
    delete req.body.status;
  }

  grain = await Grain.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('farmer', 'name phone address.city address.state');

  res.status(200).json({
    success: true,
    message: 'Grain updated successfully',
    data: {
      grain
    }
  });
});

// @desc    Delete grain
// @route   DELETE /api/grains/:id
// @access  Private (Farmer who owns the grain)
exports.deleteGrain = asyncHandler(async (req, res, next) => {
  const grain = await Grain.findById(req.params.id);

  if (!grain) {
    return res.status(404).json({
      success: false,
      message: 'Grain not found'
    });
  }

  // Make sure user is the owner of the grain
  if (grain.farmer.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this grain'
    });
  }

  await grain.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Grain deleted successfully'
  });
});

// @desc    Get farmer's grains
// @route   GET /api/grains/my/listings
// @access  Private (Farmers only)
exports.getMyGrains = asyncHandler(async (req, res, next) => {
  const {
    status,
    page = 1,
    limit = 10,
    sort = '-createdAt'
  } = req.query;

  const query = { farmer: req.user.id };
  
  if (status) {
    query.status = status;
  }

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const grains = await Grain.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limitNum)
    .populate('farmer', 'name phone address.city address.state');

  const total = await Grain.countDocuments(query);
  const totalPages = Math.ceil(total / limitNum);

  res.status(200).json({
    success: true,
    count: grains.length,
    pagination: {
      current: pageNum,
      total: totalPages,
      hasNext: pageNum < totalPages,
      hasPrev: pageNum > 1,
      limit: limitNum,
      totalItems: total
    },
    data: {
      grains
    }
  });
});

// @desc    Upload grain images
// @route   POST /api/grains/:id/images
// @access  Private (Farmer who owns the grain)
exports.uploadGrainImages = asyncHandler(async (req, res, next) => {
  const grain = await Grain.findById(req.params.id);

  if (!grain) {
    return res.status(404).json({
      success: false,
      message: 'Grain not found'
    });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No images uploaded'
    });
  }

  const newImages = req.files.map(file => ({
    url: getFileUrl(req, file.path),
    alt: `${grain.grainType} ${grain.variety} image`
  }));

  grain.images.push(...newImages);
  await grain.save();

  res.status(200).json({
    success: true,
    message: 'Images uploaded successfully',
    data: {
      images: newImages,
      totalImages: grain.images.length
    }
  });
});

// @desc    Like/Unlike grain
// @route   POST /api/grains/:id/like
// @access  Private (Buyers only)
exports.likeGrain = asyncHandler(async (req, res, next) => {
  const grain = await Grain.findById(req.params.id);

  if (!grain) {
    return res.status(404).json({
      success: false,
      message: 'Grain not found'
    });
  }

  const isLiked = grain.likes.includes(req.user.id);

  if (isLiked) {
    // Unlike
    grain.likes = grain.likes.filter(like => like.toString() !== req.user.id);
  } else {
    // Like
    grain.likes.push(req.user.id);
  }

  await grain.save();

  res.status(200).json({
    success: true,
    message: isLiked ? 'Grain unliked' : 'Grain liked',
    data: {
      isLiked: !isLiked,
      totalLikes: grain.likes.length
    }
  });
});

// @desc    Search grains
// @route   GET /api/grains/search
// @access  Public
exports.searchGrains = asyncHandler(async (req, res, next) => {
  const {
    q, // search query
    grainType,
    state,
    city,
    minPrice,
    maxPrice,
    qualityGrade,
    isOrganic,
    page = 1,
    limit = 12,
    sort = '-createdAt'
  } = req.query;

  const query = {
    status: 'approved',
    expiresAt: { $gt: new Date() }
  };

  // Text search
  if (q) {
    query.$or = [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { variety: { $regex: q, $options: 'i' } },
      { 'location.city': { $regex: q, $options: 'i' } },
      { 'location.state': { $regex: q, $options: 'i' } }
    ];
  }

  // Apply filters
  if (grainType) query.grainType = grainType;
  if (state) query['location.state'] = new RegExp(state, 'i');
  if (city) query['location.city'] = new RegExp(city, 'i');
  if (qualityGrade) query.qualityGrade = qualityGrade;
  if (isOrganic !== undefined) query.isOrganic = isOrganic === 'true';

  // Price range
  if (minPrice || maxPrice) {
    query.pricePerQuintal = {};
    if (minPrice) query.pricePerQuintal.$gte = parseFloat(minPrice);
    if (maxPrice) query.pricePerQuintal.$lte = parseFloat(maxPrice);
  }

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const grains = await Grain.find(query)
    .populate('farmer', 'name phone address.city address.state')
    .sort(sort)
    .skip(skip)
    .limit(limitNum);

  const total = await Grain.countDocuments(query);
  const totalPages = Math.ceil(total / limitNum);

  res.status(200).json({
    success: true,
    count: grains.length,
    pagination: {
      current: pageNum,
      total: totalPages,
      hasNext: pageNum < totalPages,
      hasPrev: pageNum > 1,
      limit: limitNum,
      totalItems: total
    },
    data: {
      grains,
      searchQuery: q
    }
  });
});

// @desc    Update grain status
// @route   PUT /api/grains/:id/status
// @access  Private (Farmer who owns the grain)
exports.updateGrainStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  // Validate status
  const validStatuses = ['pending', 'approved', 'rejected', 'sold', 'expired'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Valid statuses are: pending, approved, rejected, sold, expired'
    });
  }

  let grain = await Grain.findById(req.params.id);

  if (!grain) {
    return res.status(404).json({
      success: false,
      message: 'Grain not found'
    });
  }

  // Make sure user is the owner of the grain
  if (grain.farmer.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this grain status'
    });
  }

  grain.status = status;
  await grain.save();

  res.status(200).json({
    success: true,
    message: 'Grain status updated successfully',
    data: {
      grain
    }
  });
});

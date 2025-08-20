const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Grain = require('../models/Grain');
const Order = require('../models/Order');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kisaan');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Grain.deleteMany({});
    await Order.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@kisaan.com',
      password: 'admin123', // Plain password - will be hashed by pre-save hook
      phone: '9876543210',
      role: 'admin',
      address: {
        street: 'Admin Street',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001'
      },
      isVerified: true,
      isActive: true
    });
    console.log('Created admin user');

    // Create sample farmers
    const farmers = [
      {
        name: 'Ramesh Kumar',
        email: 'ramesh@example.com',
        password: 'password123', // Plain password - will be hashed by pre-save hook
        phone: '9876543211',
        role: 'farmer',
        address: {
          street: 'Village Khera',
          city: 'Kurukshetra',
          state: 'Haryana',
          pincode: '136119'
        },
        isVerified: true,
        isActive: true
      },
      {
        name: 'Suresh Singh',
        email: 'suresh@example.com',
        password: 'password123', // Plain password - will be hashed by pre-save hook
        phone: '9876543212',
        role: 'farmer',
        address: {
          street: 'Village Kaithal',
          city: 'Kaithal',
          state: 'Haryana',
          pincode: '136027'
        },
        isVerified: true,
        isActive: true
      },
      {
        name: 'Mukesh Sharma',
        email: 'mukesh@example.com',
        password: 'password123', // Plain password - will be hashed by pre-save hook
        phone: '9876543213',
        role: 'farmer',
        address: {
          street: 'Village Karnal',
          city: 'Karnal',
          state: 'Haryana',
          pincode: '132001'
        },
        isVerified: true,
        isActive: true
      }
    ];

    const createdFarmers = await User.create(farmers);
    console.log('Created farmers');

    // Create sample buyers
    const buyers = [
      {
        name: 'Rajesh Gupta',
        email: 'rajesh@example.com',
        password: 'password123', // Plain password - will be hashed by pre-save hook
        phone: '9876543214',
        role: 'buyer',
        address: {
          street: 'Sector 14',
          city: 'Gurgaon',
          state: 'Haryana',
          pincode: '122001'
        },
        isVerified: true,
        isActive: true
      },
      {
        name: 'Priya Sharma',
        email: 'priya@example.com',
        password: 'password123', // Plain password - will be hashed by pre-save hook
        phone: '9876543215',
        role: 'buyer',
        address: {
          street: 'Model Town',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110009'
        },
        isVerified: true,
        isActive: true
      }
    ];

    const createdBuyers = await User.create(buyers);
    console.log('Created buyers');

    // Create sample grains with realistic pricing and images
    const grains = [
      {
        farmer: createdFarmers[0]._id,
        title: 'Premium Basmati Rice - Pusa 1121',
        grainType: 'rice',
        variety: 'Pusa 1121',
        quantity: 50,
        availableQuantity: 50,
        pricePerQuintal: 6500, // ₹6,500 per quintal - Premium Basmati
        description: 'Premium quality Basmati rice with extra-long grains and excellent aroma. Grown organically without harmful pesticides. Perfect for biryanis and special occasions. Aged for 2 years for better taste and texture.',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1586201375761-83865001e8c3?w=500&h=400&fit=crop',
            alt: 'Premium Basmati Rice Pusa 1121'
          },
          {
            url: 'https://images.unsplash.com/photo-1516684669134-de6f7c473a2a?w=500&h=400&fit=crop',
            alt: 'Basmati Rice grains close-up'
          }
        ],
        location: {
          address: 'Village Khera, Kurukshetra',
          city: 'Kurukshetra',
          state: 'Haryana',
          pincode: '136119'
        },
        qualityGrade: 'A',
        harvestDate: new Date('2024-11-15'),
        status: 'approved',
        isOrganic: true,
        minimumOrderQuantity: 2,
        tags: ['basmati', 'premium', 'organic', 'aged'],
        approvedBy: admin._id,
        approvedAt: new Date()
      },
      {
        farmer: createdFarmers[0]._id,
        title: 'Golden Wheat - HD 2967',
        grainType: 'wheat',
        variety: 'HD 2967',
        quantity: 100,
        availableQuantity: 100,
        pricePerQuintal: 2850, // ₹2,850 per quintal - Premium wheat
        description: 'High-quality golden wheat suitable for making chapatis, bread, and pasta. Rich in protein (12.5%) and fiber. Grown using sustainable farming practices with proper soil management.',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&h=400&fit=crop',
            alt: 'Golden Wheat HD 2967'
          },
          {
            url: 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=500&h=400&fit=crop',
            alt: 'Wheat grains in hand'
          }
        ],
        location: {
          address: 'Village Khera, Kurukshetra',
          city: 'Kurukshetra',
          state: 'Haryana',
          pincode: '136119'
        },
        qualityGrade: 'A',
        harvestDate: new Date('2024-10-20'),
        status: 'approved',
        isOrganic: false,
        minimumOrderQuantity: 5,
        tags: ['wheat', 'protein-rich', 'sustainable', 'high-gluten'],
        approvedBy: admin._id,
        approvedAt: new Date()
      },
      {
        farmer: createdFarmers[1]._id,
        title: 'Yellow Corn - High Yield Variety',
        grainType: 'corn',
        variety: 'Hybrid 4640',
        quantity: 75,
        availableQuantity: 75,
        pricePerQuintal: 2100, // ₹2,100 per quintal - Quality corn
        description: 'Fresh yellow corn with high nutritional value and 14% moisture content. Suitable for animal feed, poultry feed, and food processing. Excellent storage quality with natural pest resistance.',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=500&h=400&fit=crop',
            alt: 'Yellow Corn kernels'
          },
          {
            url: 'https://images.unsplash.com/photo-1593606778737-87e87739e749?w=500&h=400&fit=crop',
            alt: 'Corn cobs in field'
          }
        ],
        location: {
          address: 'Village Kaithal',
          city: 'Kaithal',
          state: 'Haryana',
          pincode: '136027'
        },
        qualityGrade: 'A',
        harvestDate: new Date('2024-12-01'),
        status: 'approved',
        isOrganic: false,
        minimumOrderQuantity: 10,
        tags: ['corn', 'animal-feed', 'high-yield', 'fresh'],
        approvedBy: admin._id,
        approvedAt: new Date()
      },
      {
        farmer: createdFarmers[1]._id,
        title: 'Organic Pearl Millet (Bajra)',
        grainType: 'millet',
        variety: 'HHB 67',
        quantity: 30,
        availableQuantity: 30,
        pricePerQuintal: 4200, // ₹4,200 per quintal - Organic millet premium
        description: 'Certified organic pearl millet grown without chemical fertilizers or pesticides. Rich in iron (8mg/100g), protein (11.6%), and fiber. Perfect for healthy diet, diabetes management, and traditional recipes.',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1594736797933-d0fde8fb5a0b?w=500&h=400&fit=crop',
            alt: 'Organic Pearl Millet Bajra'
          },
          {
            url: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=500&h=400&fit=crop',
            alt: 'Millet grains in bowl'
          }
        ],
        location: {
          address: 'Village Kaithal',
          city: 'Kaithal',
          state: 'Haryana',
          pincode: '136027'
        },
        qualityGrade: 'A',
        harvestDate: new Date('2024-11-25'),
        status: 'approved',
        isOrganic: true,
        minimumOrderQuantity: 1,
        tags: ['millet', 'organic', 'healthy', 'iron-rich', 'gluten-free'],
        approvedBy: admin._id,
        approvedAt: new Date()
      },
      {
        farmer: createdFarmers[2]._id,
        title: 'Six Row Barley - Premium Quality',
        grainType: 'barley',
        variety: 'BH 393',
        quantity: 40,
        availableQuantity: 40,
        pricePerQuintal: 3200, // ₹3,200 per quintal - Premium barley
        description: 'Premium six-row barley suitable for malting, brewing, and animal feed. High protein content (12-14%) and excellent brewing qualities. Properly dried and cleaned for industrial use.',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=500&h=400&fit=crop',
            alt: 'Six Row Barley BH 393'
          },
          {
            url: 'https://images.unsplash.com/photo-1574782414976-8ba0d3e81609?w=500&h=400&fit=crop',
            alt: 'Barley grains close up'
          }
        ],
        location: {
          address: 'Village Karnal',
          city: 'Karnal',
          state: 'Haryana',
          pincode: '132001'
        },
        qualityGrade: 'A',
        harvestDate: new Date('2024-11-10'),
        status: 'approved',
        isOrganic: false,
        minimumOrderQuantity: 5,
        tags: ['barley', 'malting', 'brewing', 'high-protein'],
        approvedBy: admin._id,
        approvedAt: new Date()
      },
      {
        farmer: createdFarmers[2]._id,
        title: 'White Sorghum (Jowar) - Organic',
        grainType: 'sorghum',
        variety: 'CSV 15',
        quantity: 25,
        availableQuantity: 25,
        pricePerQuintal: 3800, // ₹3,800 per quintal - Organic sorghum
        description: 'Certified organic white sorghum rich in antioxidants and completely gluten-free. Perfect for health-conscious consumers, diabetes patients, and traditional recipes. High in protein (10.4%) and fiber.',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1580554530778-ca36943938bb?w=500&h=400&fit=crop',
            alt: 'White Sorghum Jowar CSV 15'
          },
          {
            url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&h=400&fit=crop',
            alt: 'Sorghum grains in burlap'
          }
        ],
        location: {
          address: 'Village Karnal',
          city: 'Karnal',
          state: 'Haryana',
          pincode: '132001'
        },
        qualityGrade: 'A',
        harvestDate: new Date('2024-12-05'),
        status: 'approved',
        isOrganic: true,
        minimumOrderQuantity: 2,
        tags: ['sorghum', 'organic', 'gluten-free', 'antioxidants', 'diabetes-friendly'],
        approvedBy: admin._id,
        approvedAt: new Date()
      },
      {
        farmer: createdFarmers[0]._id,
        title: 'Black Gram (Urad Dal) - Premium',
        grainType: 'other',
        variety: 'Pant U 19',
        quantity: 20,
        availableQuantity: 20,
        pricePerQuintal: 8500, // ₹8,500 per quintal - Premium black gram
        description: 'Premium quality black gram (urad dal) with high protein content (24%). Perfect for making dal, dosa, idli, and vada. Cleaned and sorted for direct consumption. Rich in potassium and iron.',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1586788224438-1d6d32f58c5b?w=500&h=400&fit=crop',
            alt: 'Black Gram Urad Dal'
          },
          {
            url: 'https://images.unsplash.com/photo-1615484477778-ca3db2ebb3da?w=500&h=400&fit=crop',
            alt: 'Black gram in traditional bowl'
          }
        ],
        location: {
          address: 'Village Khera, Kurukshetra',
          city: 'Kurukshetra',
          state: 'Haryana',
          pincode: '136119'
        },
        qualityGrade: 'A',
        harvestDate: new Date('2024-11-30'),
        status: 'approved',
        isOrganic: false,
        minimumOrderQuantity: 1,
        tags: ['black-gram', 'urad-dal', 'high-protein', 'premium'],
        approvedBy: admin._id,
        approvedAt: new Date()
      },
      {
        farmer: createdFarmers[1]._id,
        title: 'Organic Quinoa - Super Grain',
        grainType: 'quinoa',
        variety: 'White Quinoa',
        quantity: 15,
        availableQuantity: 15,
        pricePerQuintal: 25000, // ₹25,000 per quintal - Premium superfood
        description: 'Certified organic quinoa - the complete protein superfood. Contains all 9 essential amino acids. Gluten-free, high in fiber, iron, and magnesium. Perfect for health-conscious consumers and fitness enthusiasts.',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1568047449277-206c4bb6ddc4?w=500&h=400&fit=crop',
            alt: 'Organic White Quinoa'
          },
          {
            url: 'https://images.unsplash.com/photo-1575735879521-20ec3996a6be?w=500&h=400&fit=crop',
            alt: 'Quinoa grains in wooden spoon'
          }
        ],
        location: {
          address: 'Village Kaithal',
          city: 'Kaithal',
          state: 'Haryana',
          pincode: '136027'
        },
        qualityGrade: 'A',
        harvestDate: new Date('2024-12-10'),
        status: 'approved',
        isOrganic: true,
        minimumOrderQuantity: 0.5,
        tags: ['quinoa', 'organic', 'superfood', 'complete-protein', 'gluten-free'],
        approvedBy: admin._id,
        approvedAt: new Date()
      },
      {
        farmer: createdFarmers[2]._id,
        title: 'Steel Cut Oats - Premium Quality',
        grainType: 'oats',
        variety: 'Kent',
        quantity: 35,
        availableQuantity: 35,
        pricePerQuintal: 5500, // ₹5,500 per quintal - Premium oats
        description: 'Premium steel-cut oats with high beta-glucan content for heart health. Excellent for breakfast cereals, health foods, and bakery products. Low glycemic index and high in soluble fiber.',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=400&fit=crop',
            alt: 'Steel Cut Oats Kent variety'
          },
          {
            url: 'https://images.unsplash.com/photo-1517686748-1ea1bbae7bbb?w=500&h=400&fit=crop',
            alt: 'Oats in wooden bowl'
          }
        ],
        location: {
          address: 'Village Karnal',
          city: 'Karnal',
          state: 'Haryana',
          pincode: '132001'
        },
        qualityGrade: 'A',
        harvestDate: new Date('2024-11-20'),
        status: 'approved',
        isOrganic: false,
        minimumOrderQuantity: 2,
        tags: ['oats', 'heart-healthy', 'beta-glucan', 'low-gi', 'fiber-rich'],
        approvedBy: admin._id,
        approvedAt: new Date()
      }
    ];

    const createdGrains = await Grain.create(grains);
    console.log('Created grains');

    // Create sample orders with updated pricing
    const orders = [
      {
        buyer: createdBuyers[0]._id,
        grain: createdGrains[0]._id,
        farmer: createdFarmers[0]._id,
        quantity: 5,
        pricePerQuintal: 6500,
        totalAmount: 32500, // 5 * 6500
        status: 'delivered',
        paymentMethod: 'bank_transfer',
        paymentStatus: 'paid',
        deliveryAddress: {
          name: 'Rajesh Gupta',
          phone: '9876543214',
          street: 'Sector 14',
          city: 'Gurgaon',
          state: 'Haryana',
          pincode: '122001'
        },
        deliveryType: 'farmer_delivery',
        estimatedDeliveryDate: new Date('2024-12-20'),
        actualDeliveryDate: new Date('2024-12-18'),
        timeline: [
          {
            status: 'pending',
            timestamp: new Date('2024-12-10'),
            description: 'Order placed'
          },
          {
            status: 'confirmed',
            timestamp: new Date('2024-12-10'),
            description: 'Order confirmed by farmer'
          },
          {
            status: 'paid',
            timestamp: new Date('2024-12-11'),
            description: 'Payment received'
          },
          {
            status: 'shipped',
            timestamp: new Date('2024-12-15'),
            description: 'Order shipped'
          },
          {
            status: 'delivered',
            timestamp: new Date('2024-12-18'),
            description: 'Order delivered successfully'
          }
        ],
        rating: {
          buyerRating: {
            stars: 5,
            review: 'Excellent quality rice, very satisfied!',
            date: new Date('2024-12-19')
          }
        }
      },
      {
        buyer: createdBuyers[1]._id,
        grain: createdGrains[1]._id,
        farmer: createdFarmers[0]._id,
        quantity: 10,
        pricePerQuintal: 2850,
        totalAmount: 28500, // 10 * 2850
        status: 'confirmed',
        paymentMethod: 'cash_on_delivery',
        paymentStatus: 'pending',
        deliveryAddress: {
          name: 'Priya Sharma',
          phone: '9876543215',
          street: 'Model Town',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110009'
        },
        deliveryType: 'farmer_delivery',
        estimatedDeliveryDate: new Date('2024-12-25'),
        timeline: [
          {
            status: 'pending',
            timestamp: new Date('2024-12-15'),
            description: 'Order placed'
          },
          {
            status: 'confirmed',
            timestamp: new Date('2024-12-16'),
            description: 'Order confirmed by farmer'
          }
        ]
      }
    ];

    await Order.create(orders);
    console.log('Created orders');

    // Update grain quantities after orders
    await Grain.findByIdAndUpdate(createdGrains[0]._id, { 
      $inc: { availableQuantity: -5 } 
    });
    await Grain.findByIdAndUpdate(createdGrains[1]._id, { 
      $inc: { availableQuantity: -10 } 
    });

    console.log('✅ Database seeded successfully!');
    console.log('\n📧 Test User Credentials:');
    console.log('Admin: admin@kisaan.com / admin123');
    console.log('Farmer 1: ramesh@example.com / password123');
    console.log('Farmer 2: suresh@example.com / password123');
    console.log('Farmer 3: mukesh@example.com / password123');
    console.log('Buyer 1: rajesh@example.com / password123');
    console.log('Buyer 2: priya@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  require('dotenv').config();
  seedDatabase();
}

module.exports = seedDatabase;

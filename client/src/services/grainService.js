import api from './api';

export const getAllGrains = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.keys(filters).forEach(key => {
    if (filters[key]) {
      params.append(key, filters[key]);
    }
  });
  const response = await api.get(`/grains?${params}`);
  return response.data;
};

export const getGrainById = async (id) => {
  const response = await api.get(`/grains/${id}`);
  return response.data;
};

export const createGrain = async (grainData, images = []) => {
  const formData = new FormData();
  
  console.log('🌐 Original grain data:', grainData);
  
  // Append grain data, handling location specially
  Object.keys(grainData).forEach(key => {
    if (grainData[key] !== null && grainData[key] !== undefined) {
      if (key === 'location' && typeof grainData[key] === 'object') {
        // Send location fields individually instead of as JSON
        console.log('🌐 Appending location fields individually:', grainData[key]);
        if (grainData[key].address) formData.append('location.address', grainData[key].address);
        if (grainData[key].city) formData.append('location.city', grainData[key].city);
        if (grainData[key].state) formData.append('location.state', grainData[key].state);
        if (grainData[key].pincode) formData.append('location.pincode', grainData[key].pincode);
      } else if (typeof grainData[key] === 'object') {
        console.log(`🌐 Appending ${key} as JSON:`, JSON.stringify(grainData[key]));
        formData.append(key, JSON.stringify(grainData[key]));
      } else {
        console.log(`🌐 Appending ${key}:`, grainData[key]);
        formData.append(key, grainData[key]);
      }
    }
  });
  
  // Append images with correct field name
  images.forEach(image => {
    formData.append('grainImages', image);
  });
  
  console.log('🌐 FormData entries:');
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }
  
  const response = await api.post('/grains', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateGrain = async (id, grainData) => {
  const response = await api.put(`/grains/${id}`, grainData);
  return response.data;
};

export const deleteGrain = async (id) => {
  const response = await api.delete(`/grains/${id}`);
  return response.data;
};

export const getMyGrains = async () => {
  const response = await api.get('/grains/my/listings');
  return response.data;
};

export const searchGrains = async (searchQuery) => {
  const response = await api.get(`/grains/search?q=${encodeURIComponent(searchQuery)}`);
  return response.data;
};

export const getGrainsByCategory = async (category) => {
  const response = await api.get(`/grains/category/${category}`);
  return response.data;
};

export const getFeaturedGrains = async () => {
  const response = await api.get('/grains/featured');
  return response.data;
};

export const getRecentGrains = async (limit = 10) => {
  const response = await api.get(`/grains/recent?limit=${limit}`);
  return response.data;
};

export const uploadGrainImages = async (grainId, images) => {
  const formData = new FormData();
  images.forEach(image => {
    formData.append('grainImages', image);
  });
  const response = await api.post(`/grains/${grainId}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteGrainImage = async (grainId, imageId) => {
  const response = await api.delete(`/grains/${grainId}/images/${imageId}`);
  return response.data;
};

export const updateGrainStatus = async (grainId, status) => {
  const response = await api.put(`/grains/${grainId}/status`, { status });
  return response.data;
};

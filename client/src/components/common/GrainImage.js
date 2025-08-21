import React, { useState } from 'react';

const GrainImage = ({ grain, className = "h-96" }) => {
  const [imageError, setImageError] = useState(false);

  const hasValidImage = grain?.images && 
                       Array.isArray(grain.images) && 
                       grain.images.length > 0 && 
                       grain.images[0]?.url;

  if (!hasValidImage) {
    return (
      <div className={`flex items-center justify-center ${className} bg-gradient-to-br from-green-100 to-yellow-100 dark:from-green-900 dark:to-yellow-900 rounded-lg`}>
        <span className="text-4xl">🌾</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className} bg-gradient-to-br from-green-100 to-yellow-100 dark:from-green-900 dark:to-yellow-900 rounded-lg overflow-hidden`}>      
      {!imageError && (
        <img 
          src={grain.images[0].url}
          alt={grain.images[0].alt || grain.title || 'Grain image'}
          className="w-full h-full object-cover"
          crossOrigin="anonymous"
          onError={(e) => {
            console.error('❌ Image failed to load:', grain.images[0].url, e);
            setImageError(true);
          }}
        />
      )}
      
      {/* Fallback when image fails */}
      {imageError && (
        <div className="flex items-center justify-center h-full">
          <span className="text-4xl">🌾</span>
        </div>
      )}
    </div>
  );
};

export default GrainImage;

#!/usr/bin/env node

/**
 * Grain Database Seeder
 * This script populates the database with realistic grain data including:
 * - Proper market prices for different grains
 * - High-quality grain images from Unsplash
 * - Detailed nutritional and quality information
 * - Organic and non-organic varieties
 * - Various grain types with realistic pricing
 */

require('dotenv').config();
const seedDatabase = require('./server/utils/seedDatabase');

console.log('🌾 Starting Kisaan Database Seeder...\n');
console.log('This will populate the database with:');
console.log('✅ 9 different grain varieties with realistic pricing');
console.log('✅ High-quality grain images');
console.log('✅ Nutritional information and quality grades');
console.log('✅ Sample farmers, buyers, and orders');
console.log('✅ Organic and conventional farming options\n');

console.log('💰 Grain Pricing Summary:');
console.log('- Premium Basmati Rice: ₹6,500/quintal');
console.log('- Golden Wheat: ₹2,850/quintal');
console.log('- Yellow Corn: ₹2,100/quintal');
console.log('- Organic Pearl Millet: ₹4,200/quintal');
console.log('- Premium Barley: ₹3,200/quintal');
console.log('- Organic Sorghum: ₹3,800/quintal');
console.log('- Black Gram (Urad Dal): ₹8,500/quintal');
console.log('- Organic Quinoa: ₹25,000/quintal');
console.log('- Steel Cut Oats: ₹5,500/quintal\n');

console.log('📸 All grains include high-quality images from Unsplash\n');
console.log('⚠️  This will clear existing data. Continue? (Ctrl+C to cancel)\n');

// Wait 3 seconds before starting
setTimeout(() => {
  seedDatabase();
}, 3000);

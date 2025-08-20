#!/usr/bin/env node

/**
 * Grain Data Verification Script
 * This script connects to the database and displays the populated grain data
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Grain = require('../models/Grain');
const User = require('../models/User');

const verifyGrainData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kisaan');
    console.log('Connected to MongoDB\n');

    // Fetch all grains
    const grains = await Grain.find().populate('farmer', 'name');
    
    console.log('🌾 GRAIN DATABASE VERIFICATION\n');
    console.log(`Total Grains: ${grains.length}\n`);
    
    grains.forEach((grain, index) => {
      console.log(`${index + 1}. ${grain.title}`);
      console.log(`   Type: ${grain.grainType}`);
      console.log(`   Variety: ${grain.variety}`);
      console.log(`   Price: ₹${grain.pricePerQuintal.toLocaleString()}/quintal`);
      console.log(`   Quantity: ${grain.quantity} quintals`);
      console.log(`   Quality: Grade ${grain.qualityGrade}`);
      console.log(`   Organic: ${grain.isOrganic ? '✅ Yes' : '❌ No'}`);
      console.log(`   Status: ${grain.status}`);
      console.log(`   Farmer: ${grain.farmer?.name || 'Unknown'}`);
      console.log(`   Images: ${grain.images?.length || 0} photos`);
      console.log(`   Total Value: ₹${(grain.quantity * grain.pricePerQuintal).toLocaleString()}`);
      console.log('   ---');
    });

    // Calculate statistics
    const totalValue = grains.reduce((sum, grain) => sum + (grain.quantity * grain.pricePerQuintal), 0);
    const totalQuantity = grains.reduce((sum, grain) => sum + grain.quantity, 0);
    const organicGrains = grains.filter(grain => grain.isOrganic).length;
    const avgPrice = grains.reduce((sum, grain) => sum + grain.pricePerQuintal, 0) / grains.length;

    console.log('\n📊 STATISTICS');
    console.log(`Total Inventory Value: ₹${totalValue.toLocaleString()}`);
    console.log(`Total Quantity: ${totalQuantity} quintals`);
    console.log(`Organic Grains: ${organicGrains}/${grains.length} (${Math.round(organicGrains/grains.length*100)}%)`);
    console.log(`Average Price: ₹${Math.round(avgPrice).toLocaleString()}/quintal`);
    
    // Price range
    const prices = grains.map(g => g.pricePerQuintal).sort((a, b) => a - b);
    console.log(`Price Range: ₹${prices[0].toLocaleString()} - ₹${prices[prices.length-1].toLocaleString()}`);

    // Grain types
    const grainTypes = [...new Set(grains.map(g => g.grainType))];
    console.log(`Grain Types: ${grainTypes.join(', ')}`);

    await mongoose.connection.close();
    console.log('\n✅ Verification complete!');
    
  } catch (error) {
    console.error('❌ Error verifying grain data:', error);
    process.exit(1);
  }
};

verifyGrainData();

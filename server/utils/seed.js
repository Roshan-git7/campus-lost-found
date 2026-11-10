const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Item = require('../models/Item');
const Claim = require('../models/Claim');
const Notification = require('../models/Notification');

const seedData = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('❌ MONGO_URI is not set. Please specify MONGO_URI in server/.env');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log(` Connected to MongoDB for seeding: ${mongoose.connection.host}`);

    // Clear existing sample records
    console.log('🧹 Clearing previous database records...');
    await Promise.all([
      User.deleteMany({}),
      Item.deleteMany({}),
      Claim.deleteMany({}),
      Notification.deleteMany({}),
    ]);

    console.log('👤 Creating demo accounts...');
    // Demo Users
    const passwordHash = await bcrypt.hash('Admin123!', 10);
    const studentPasswordHash = await bcrypt.hash('Student123!', 10);

    const admin = await User.create({
      name: 'Campus Security Administration',
      email: 'admin@campus.edu',
      password: passwordHash,
      role: 'admin',
      uid: 'ADMIN-001',
      isActive: true,
    });

    const student1 = await User.create({
      name: 'Aarav Sharma',
      email: 'student@campus.edu',
      password: studentPasswordHash,
      role: 'student',
      uid: '22BCS10101',
      isActive: true,
    });

    const student2 = await User.create({
      name: 'Priya Patel',
      email: 'priya.patel@campus.edu',
      password: studentPasswordHash,
      role: 'student',
      uid: '22ECE2044',
      isActive: true,
    });

    const student3 = await User.create({
      name: 'Rohan Verma',
      email: 'rohan.verma@campus.edu',
      password: studentPasswordHash,
      role: 'student',
      uid: '23MECH3012',
      isActive: true,
    });

    console.log('📦 Creating sample lost and found items...');
    // Demo Items
    const items = await Item.create([
      {
        title: 'Dell XPS 13 65W USB-C Charger',
        description: 'Black braided cable with minor scuff mark on the wall adapter block. Left behind after evening study session.',
        category: 'Electronics',
        type: 'Lost',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        location: 'Central Library 2nd Floor Reading Hall Desk #42',
        imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
        status: 'Open',
        reportedBy: student1._id,
      },
      {
        title: 'Black USB-C Laptop Charger 65W',
        description: 'Found plugged into power socket in the library. Has a small yellow electrical tape near connector.',
        category: 'Electronics',
        type: 'Found',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        location: 'Central Library 2nd Floor Reading Room',
        imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
        status: 'Open',
        reportedBy: student2._id,
      },
      {
        title: 'Brown Leather Fossil Wallet',
        description: 'Contains university smart card, metro card, and library card. Does not contain significant cash.',
        category: 'Wallets',
        type: 'Lost',
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        location: 'Student Activity Center Canteen Counter',
        imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
        status: 'Claim Pending',
        reportedBy: student2._id,
      },
      {
        title: 'Brown Leather Bi-fold Wallet',
        description: 'Handed over by cafeteria staff. Kept in campus security safe pending claimant identity check.',
        category: 'Wallets',
        type: 'Found',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        location: 'Student Activity Center Food Court',
        imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
        status: 'Claim Pending',
        reportedBy: student3._id,
      },
      {
        title: 'Sony WH-1000XM4 Noise Cancelling Headphones',
        description: 'Silver wireless over-ear headphones inside dark grey protective carry case.',
        category: 'Electronics',
        type: 'Lost',
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        location: 'Mechanical Engineering Block Seminar Hall B',
        imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
        status: 'Open',
        reportedBy: student3._id,
      },
      {
        title: 'Stainless Steel Water Bottle (Milton 1L)',
        description: 'Navy blue matte finish with university robotics club sticker.',
        category: 'Accessories',
        type: 'Found',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        location: 'Sports Complex Badminton Court 2',
        imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
        status: 'Returned',
        reportedBy: student1._id,
        claimedBy: student2._id,
      },
      {
        title: 'University Identity Card (UID: 22BCS10101)',
        description: 'Plastic RFID smart card found near main entrance security turnstile.',
        category: 'Documents / ID Cards',
        type: 'Found',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        location: 'Campus Main Gate 1 Security Checkpost',
        imageUrl: '',
        status: 'Open',
        reportedBy: admin._id,
      },
    ]);

    console.log('📝 Creating sample claims...');
    // Create Claim for the wallet
    const sampleClaim = await Claim.create({
      itemId: items[3]._id, // The found wallet
      claimantId: student2._id,
      proofOfOwnership: 'My university smart card is inside with name Priya Patel and UID 22ECE2044. There is also a blue Hyderabad Metro smart card.',
      additionalDescription: 'Lost it around 1:30 PM after lunch while paying at juice stall.',
      status: 'Pending',
    });

    console.log('🔔 Creating sample notifications...');
    await Notification.create([
      {
        recipient: admin._id,
        title: 'New Ownership Claim Submitted',
        message: `Priya Patel submitted ownership evidence for "Brown Leather Bi-fold Wallet".`,
        type: 'claim_submitted',
        relatedItem: items[3]._id,
        isRead: false,
      },
      {
        recipient: student1._id,
        title: 'Potential Smart Match Detected! ✨',
        message: 'A recently found item ("Black USB-C Laptop Charger 65W") has an 86% match with your lost charger report.',
        type: 'match_found',
        relatedItem: items[0]._id,
        isRead: false,
      },
      {
        recipient: student2._id,
        title: 'Claim Submitted Successfully',
        message: 'Your claim for "Brown Leather Bi-fold Wallet" was received. Awaiting admin review.',
        type: 'claim_submitted',
        relatedItem: items[3]._id,
        isRead: true,
      },
      {
        recipient: student2._id,
        title: 'Item Handover Complete! 📦',
        message: 'Your Milton 1L water bottle was safely collected from Campus Security desk.',
        type: 'item_returned',
        relatedItem: items[5]._id,
        isRead: true,
      },
    ]);

    console.log('✅ Database seeded successfully with realistic demo data!');
    console.log('------------------------------------------------------------');
    console.log('Demo Credentials for Faculty / Evaluator Demo:');
    console.log('1. Admin:   admin@campus.edu   / Password: Admin123!');
    console.log('2. Student: student@campus.edu / Password: Student123!');
    console.log('3. Student: priya.patel@campus.edu / Password: Student123!');
    console.log('------------------------------------------------------------');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed with error:', err.message);
    process.exit(1);
  }
};

seedData();


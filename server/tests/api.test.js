const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../app');
const User = require('../models/User');
const Item = require('../models/Item');
const Claim = require('../models/Claim');

let mongoServer;
let studentToken;
let adminToken;
let studentUser;
let adminUser;
let createdItemId;
let createdClaimId;

describe('Campus Lost & Found Portal API Test Suite', () => {
  before(async () => {
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'test_jwt_secret_key_12345';

    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  after(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  // 1. Authentication Tests
  describe('Authentication Endpoints', () => {
    test('POST /api/auth/register - Register a student successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test Student',
          email: 'test.student@university.edu',
          password: 'Password123!',
          confirmPassword: 'Password123!',
          uid: '22TEST01',
          role: 'student',
        });

      assert.equal(res.status, 201);
      assert.equal(res.body.success, true);
      assert.ok(res.body.data.token);
      assert.equal(res.body.data.user.role, 'student');

      studentToken = res.body.data.token;
      studentUser = res.body.data.user;
    });

    test('POST /api/auth/register - Fail on mismatched passwords', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Mismatched Student',
          email: 'mismatch@university.edu',
          password: 'Password123!',
          confirmPassword: 'WrongPassword!',
        });

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
    });

    test('POST /api/auth/login - Login successfully with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test.student@university.edu',
          password: 'Password123!',
        });

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(res.body.data.token);
    });

    test('POST /api/auth/login - Fail on incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test.student@university.edu',
          password: 'WrongPassword!',
        });

      assert.equal(res.status, 401);
      assert.equal(res.body.success, false);
    });

    test('GET /api/auth/me - Access protected current user profile', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${studentToken}`);

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.email, 'test.student@university.edu');
    });

    test('GET /api/auth/me - Reject request without token', async () => {
      const res = await request(app).get('/api/auth/me');
      assert.equal(res.status, 401);
    });
  });

  // Setup Admin Account for subsequent tests
  describe('Admin Authorization Setup', () => {
    test('Create an admin user directly for test validation', async () => {
      adminUser = await User.create({
        name: 'Test Administrator',
        email: 'test.admin@university.edu',
        password: 'AdminPassword123!',
        role: 'admin',
        isActive: true,
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test.admin@university.edu',
          password: 'AdminPassword123!',
        });

      assert.equal(res.status, 200);
      adminToken = res.body.data.token;
      assert.ok(adminToken);
    });

    test('GET /api/admin/dashboard - Prevent student from accessing admin route', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${studentToken}`);

      assert.equal(res.status, 403);
    });

    test('GET /api/admin/dashboard - Allow admin user access', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
    });
  });

  // 2. Items Management Tests
  describe('Item Management Endpoints', () => {
    test('POST /api/items - Report a Lost Item', async () => {
      const res = await request(app)
        .post('/api/items')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'MacBook Pro 14 Inch Space Grey',
          description: 'Left on desk near window in Library 2nd Floor.',
          category: 'Electronics',
          type: 'Lost',
          date: '2026-11-08',
          location: 'Central Library 2nd Floor',
        });

      assert.equal(res.status, 201);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.title, 'MacBook Pro 14 Inch Space Grey');
      createdItemId = res.body.data._id;
    });

    test('POST /api/items - Report a Found Item', async () => {
      const res = await request(app)
        .post('/api/items')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Silver Apple Laptop 14 Inch',
          description: 'Found inside reading hall. Screen has anime sticker.',
          category: 'Electronics',
          type: 'Found',
          date: '2026-11-09',
          location: 'Central Library 2nd Floor Reading Room',
        });

      assert.equal(res.status, 201);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.type, 'Found');
    });

    test('GET /api/items - List items with category and type filtering', async () => {
      const res = await request(app)
        .get('/api/items')
        .query({ category: 'Electronics', type: 'Lost' });

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(res.body.data.length >= 1);
    });

    test('GET /api/items/matches/:id - Smart Match Engine scores potential matches', async () => {
      const res = await request(app).get(`/api/items/matches/${createdItemId}`);

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(Array.isArray(res.body.data.matches));
      // Should find the silver Apple laptop found in library
      if (res.body.data.matches.length > 0) {
        const topMatch = res.body.data.matches[0];
        assert.ok(topMatch.score > 30); // Category match alone is 30 points
        assert.ok(topMatch.breakdown.categoryScore === 30);
      }
    });

    test('PUT /api/items/:id - Update item report', async () => {
      const res = await request(app)
        .put(`/api/items/${createdItemId}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'MacBook Pro 14 Inch Space Grey (M2 Pro)',
          location: 'Central Library Desk #12',
        });

      assert.equal(res.status, 200);
      assert.equal(res.body.data.title, 'MacBook Pro 14 Inch Space Grey (M2 Pro)');
    });

    test('GET /api/items/my-reports - Retrieve current user reports', async () => {
      const res = await request(app)
        .get('/api/items/my-reports')
        .set('Authorization', `Bearer ${studentToken}`);

      assert.equal(res.status, 200);
      assert.ok(res.body.data.length >= 1);
    });
  });

  // 3. Claims Management Tests
  describe('Ownership Claims Workflow', () => {
    let foundItemId;

    before(async () => {
      // Create a found item that student can claim
      const item = await Item.create({
        title: 'Leather Wallet with Student Card',
        description: 'Black leather wallet with credit card and campus pass.',
        category: 'Wallets',
        type: 'Found',
        date: new Date(),
        location: 'Food Court Table 7',
        reportedBy: adminUser._id,
      });
      foundItemId = item._id;
    });

    test('POST /api/claims - Submit an ownership claim with evidence', async () => {
      const res = await request(app)
        .post('/api/claims')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          itemId: foundItemId,
          proofOfOwnership: 'My UID 22TEST01 is written on the emergency contact card inside.',
          additionalDescription: 'Lost it during lunchtime around 12:45 PM.',
        });

      assert.equal(res.status, 201);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.status, 'Pending');
      createdClaimId = res.body.data._id;

      // Verify item status updated to 'Claim Pending'
      const updatedItem = await Item.findById(foundItemId);
      assert.equal(updatedItem.status, 'Claim Pending');
    });

    test('POST /api/claims - Prevent duplicate active claims by same user', async () => {
      const res = await request(app)
        .post('/api/claims')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          itemId: foundItemId,
          proofOfOwnership: 'Duplicate claim attempt.',
        });

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
    });

    test('GET /api/claims/my-claims - View user claims', async () => {
      const res = await request(app)
        .get('/api/claims/my-claims')
        .set('Authorization', `Bearer ${studentToken}`);

      assert.equal(res.status, 200);
      assert.ok(res.body.data.length >= 1);
    });

    test('PUT /api/admin/claims/:id/review - Admin approves ownership claim', async () => {
      const res = await request(app)
        .put(`/api/admin/claims/${createdClaimId}/review`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'Approved',
          adminNotes: 'Student card verified against identity records.',
        });

      assert.equal(res.status, 200);
      assert.equal(res.body.data.status, 'Approved');

      // Verify item updated to 'Claimed'
      const item = await Item.findById(foundItemId);
      assert.equal(item.status, 'Claimed');
    });

    test('PUT /api/admin/items/:id/status - Mark item as Returned', async () => {
      const res = await request(app)
        .put(`/api/admin/items/${foundItemId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'Returned',
        });

      assert.equal(res.status, 200);
      assert.equal(res.body.data.status, 'Returned');
    });
  });

  // 4. Notifications Endpoints
  describe('Notification System', () => {
    test('GET /api/notifications - User receives notifications for claim updates', async () => {
      const res = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${studentToken}`);

      assert.equal(res.status, 200);
      assert.ok(res.body.data.notifications.length >= 1);
    });

    test('PUT /api/notifications/read-all - Mark all notifications read', async () => {
      const res = await request(app)
        .put('/api/notifications/read-all')
        .set('Authorization', `Bearer ${studentToken}`);

      assert.equal(res.status, 200);
    });
  });

  // 5. Admin User Management
  describe('Admin User Management', () => {
    test('GET /api/admin/users - List users with search', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ search: 'student' });

      assert.equal(res.status, 200);
      assert.ok(res.body.data.length >= 1);
    });

    test('PUT /api/admin/users/:id/toggle-status - Toggle account status', async () => {
      const res = await request(app)
        .put(`/api/admin/users/${studentUser._id}/toggle-status`)
        .set('Authorization', `Bearer ${adminToken}`);

      assert.equal(res.status, 200);
      assert.equal(res.body.data.isActive, false);

      // Reactivate for test purity
      await request(app)
        .put(`/api/admin/users/${studentUser._id}/toggle-status`)
        .set('Authorization', `Bearer ${adminToken}`);
    });
  });
});

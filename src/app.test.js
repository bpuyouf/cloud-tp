const express = require('express');
const { Pool } = require('pg');

// Simple test to verify the app can start without errors
describe('API Basic Tests', () => {
  test('should load environment variables', () => {
    expect(process.env.DB_HOST).toBeDefined();
    expect(process.env.DB_PORT).toBeDefined();
    expect(process.env.DB_NAME).toBeDefined();
  });

  test('should create express app', () => {
    const app = express();
    expect(app).toBeDefined();
    expect(typeof app.listen).toBe('function');
  });

  test('should create database pool', () => {
    const pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    });
    expect(pool).toBeDefined();
  });
});
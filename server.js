const express = require('express');
const path = require('path');
require('dotenv').config();
const connectDB = require('./backend/config/database');
const initializeDatabase = require('./backend/init-db');
const app = express();

// Connect to database
connectDB();
initializeDatabase();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/quiz', require('./backend/routes/quiz'));
app.use('/api/animals', require('./backend/routes/animals'));
app.use('/api/users', require('./backend/routes/users'));

// Middleware to log all requests
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, 'frontend')));

// Disable directory listing
app.use((req, res, next) => {
    if (req.url.endsWith('/')) {
        return res.redirect('/index.html');
    }
    next();
});

// Category Management route
app.get('/category-management', (req, res) => {
    console.log('Category management requested');
    const filePath = path.join(__dirname, 'frontend/pages/admin/category-management.html');
    console.log('File path:', filePath);
    res.sendFile(filePath);
});

// Quality Control route
app.get('/quality-control', (req, res) => {
    console.log('Quality control requested');
    const filePath = path.join(__dirname, 'frontend/pages/admin/quality-control.html');
    console.log('File path:', filePath);
    res.sendFile(filePath);
});

// Contributor Recognition route
app.get('/contributor-recognition', (req, res) => {
    console.log('Contributor recognition requested');
    const filePath = path.join(__dirname, 'frontend/pages/admin/contributor-recognition.html');
    console.log('File path:', filePath);
    res.sendFile(filePath);
});

// Main site route - force index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log('='.repeat(60));
    console.log('📋 Available APIs:');
    console.log(`📁 Category Management: http://localhost:${PORT}/category-management`);
    console.log(`🔍 Quality Control: http://localhost:${PORT}/quality-control`);
    console.log(`🏆 Contributor Recognition: http://localhost:${PORT}/contributor-recognition`);
    console.log(`🏠 Main Site: http://localhost:${PORT}`);
    console.log('='.repeat(60));
    console.log('📊 Request Logs:');
    console.log('='.repeat(60));
});
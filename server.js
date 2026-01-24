const express = require('express');
const path = require('path');
const app = express();

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

// Main site route - force index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📁 Category Management: http://localhost:${PORT}/category-management`);
    console.log(`🔍 Quality Control: http://localhost:${PORT}/quality-control`);
});
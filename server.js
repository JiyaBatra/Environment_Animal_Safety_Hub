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
    res.sendFile(path.join(__dirname, 'frontend/pages/admin/category-management.html'));
});

// Main site route - force index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📁 Category Management: http://localhost:${PORT}/category-management`);
});
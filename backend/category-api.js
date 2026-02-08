const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// In-memory database (replace with actual database)
let categories = [
    { id: 1, name: 'Web Development', parent: null, description: 'Web-based projects', createdAt: new Date() },
    { id: 2, name: 'Mobile Apps', parent: null, description: 'Mobile applications', createdAt: new Date() },
    { id: 3, name: 'Frontend', parent: 1, description: 'Frontend development', createdAt: new Date() },
    { id: 4, name: 'Backend', parent: 1, description: 'Backend development', createdAt: new Date() }
];

let projects = [
    { id: 1, name: 'EcoLife Website', categoryId: 1, techStack: ['HTML', 'CSS', 'JavaScript'], createdAt: new Date() },
    { id: 2, name: 'Animal Tracker App', categoryId: 2, techStack: ['React Native', 'Firebase'], createdAt: new Date() }
];

// Category validation rules
const validationRules = {
    name: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z0-9\s\-_]+$/
    },
    description: {
        maxLength: 200
    }
};

// Validation functions
function validateCategory(category) {
    const errors = [];
    
    if (!category.name || category.name.trim().length === 0) {
        errors.push('Category name is required');
    } else if (category.name.length < validationRules.name.minLength) {
        errors.push(`Category name must be at least ${validationRules.name.minLength} characters`);
    } else if (category.name.length > validationRules.name.maxLength) {
        errors.push(`Category name must not exceed ${validationRules.name.maxLength} characters`);
    } else if (!validationRules.name.pattern.test(category.name)) {
        errors.push('Category name contains invalid characters');
    }
    
    if (category.description && category.description.length > validationRules.description.maxLength) {
        errors.push(`Description must not exceed ${validationRules.description.maxLength} characters`);
    }
    
    if (category.parent && !categories.find(c => c.id === category.parent)) {
        errors.push('Invalid parent category');
    }
    
    return errors;
}

function findDuplicateCategories() {
    const nameMap = new Map();
    const duplicates = [];
    
    categories.forEach(category => {
        const normalizedName = category.name.toLowerCase().trim();
        if (nameMap.has(normalizedName)) {
            nameMap.get(normalizedName).push(category);
        } else {
            nameMap.set(normalizedName, [category]);
        }
    });
    
    nameMap.forEach((categoryList, name) => {
        if (categoryList.length > 1) {
            duplicates.push({
                name,
                categories: categoryList,
                count: categoryList.length
            });
        }
    });
    
    return duplicates;
}

// Auto-categorization logic
function autoCategorizeProject(project) {
    const techCategoryMap = {
        'React': 'Frontend',
        'Vue.js': 'Frontend',
        'Angular': 'Frontend',
        'HTML': 'Frontend',
        'CSS': 'Frontend',
        'JavaScript': 'Frontend',
        'Node.js': 'Backend',
        'Express': 'Backend',
        'Python': 'Backend',
        'React Native': 'Mobile Apps',
        'Flutter': 'Mobile Apps'
    };
    
    for (const tech of project.techStack) {
        const suggestedCategoryName = techCategoryMap[tech];
        if (suggestedCategoryName) {
            const category = categories.find(c => 
                c.name.toLowerCase() === suggestedCategoryName.toLowerCase()
            );
            if (category) {
                return category.id;
            }
        }
    }
    
    return null;
}

// API Routes
app.get('/api/categories', (req, res) => {
    res.json({
        success: true,
        data: categories,
        total: categories.length
    });
});

app.post('/api/categories', (req, res) => {
    const categoryData = req.body;
    
    const errors = validateCategory(categoryData);
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            errors
        });
    }
    
    const duplicate = categories.find(c => 
        c.name.toLowerCase() === categoryData.name.toLowerCase()
    );
    if (duplicate) {
        return res.status(409).json({
            success: false,
            error: 'Category with this name already exists'
        });
    }
    
    const newCategory = {
        id: Date.now(),
        name: categoryData.name.trim(),
        parent: categoryData.parent || null,
        description: categoryData.description || '',
        createdAt: new Date()
    };
    
    categories.push(newCategory);
    
    res.status(201).json({
        success: true,
        data: newCategory
    });
});

app.get('/api/categories/validate', (req, res) => {
    const validationResults = {
        valid: [],
        invalid: [],
        duplicates: findDuplicateCategories()
    };
    
    categories.forEach(category => {
        const errors = validateCategory(category);
        if (errors.length === 0) {
            validationResults.valid.push(category);
        } else {
            validationResults.invalid.push({
                category,
                errors
            });
        }
    });
    
    res.json({
        success: true,
        data: validationResults
    });
});

app.post('/api/categories/merge-duplicates', (req, res) => {
    const duplicates = findDuplicateCategories();
    let mergedCount = 0;
    
    duplicates.forEach(duplicate => {
        const [mainCategory, ...duplicateCategories] = duplicate.categories;
        
        duplicateCategories.forEach(dupCat => {
            projects.forEach(project => {
                if (project.categoryId === dupCat.id) {
                    project.categoryId = mainCategory.id;
                }
            });
        });
        
        duplicateCategories.forEach(dupCat => {
            const index = categories.findIndex(c => c.id === dupCat.id);
            if (index !== -1) {
                categories.splice(index, 1);
                mergedCount++;
            }
        });
    });
    
    res.json({
        success: true,
        message: `Merged ${mergedCount} duplicate categories`,
        mergedCount
    });
});

app.post('/api/projects/bulk-assign-category', (req, res) => {
    const { projectIds, categoryId } = req.body;
    
    if (!Array.isArray(projectIds) || !categoryId) {
        return res.status(400).json({
            success: false,
            error: 'Invalid request data'
        });
    }
    
    let updatedCount = 0;
    projectIds.forEach(projectId => {
        const project = projects.find(p => p.id === projectId);
        if (project) {
            project.categoryId = categoryId;
            updatedCount++;
        }
    });
    
    res.json({
        success: true,
        message: `Updated ${updatedCount} projects`,
        updatedCount
    });
});

app.post('/api/projects/auto-categorize', (req, res) => {
    let categorizedCount = 0;
    
    projects.forEach(project => {
        if (!project.categoryId) {
            const suggestedCategoryId = autoCategorizeProject(project);
            if (suggestedCategoryId) {
                project.categoryId = suggestedCategoryId;
                categorizedCount++;
            }
        }
    });
    
    res.json({
        success: true,
        message: `Auto-categorized ${categorizedCount} projects`,
        categorizedCount
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log(`🚀 Category Management API running on port ${PORT}`);
    console.log('='.repeat(60));
});

module.exports = app;
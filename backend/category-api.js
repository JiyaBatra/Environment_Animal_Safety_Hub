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

// Local Food System Explorer API
let foodLocations = [
  {
    id: 1,
    name: "Union Square Greenmarket",
    type: "farmers-market",
    region: "north",
    lat: 40.7359,
    lng: -73.9911,
    info: "Open Mon, Wed, Fri, Sat."
  },
  {
    id: 2,
    name: "Brooklyn Grange",
    type: "community-garden",
    region: "east",
    lat: 40.7532,
    lng: -73.9436,
    info: "Urban rooftop farm."
  },
  {
    id: 3,
    name: "Park Slope Food Coop",
    type: "food-coop",
    region: "south",
    lat: 40.6732,
    lng: -73.9786,
    info: "Member-owned grocery."
  }
];

app.get('/api/food-locations', (req, res) => {
  res.json({ success: true, data: foodLocations });
});

app.post('/api/food-locations', (req, res) => {
  const loc = req.body;
  loc.id = foodLocations.length + 1;
  foodLocations.push(loc);
  res.status(201).json({ success: true, data: loc });
});

app.put('/api/food-locations/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = foodLocations.findIndex(l => l.id === id);
  if (idx === -1) return res.status(404).send('Not found');
  foodLocations[idx] = { ...foodLocations[idx], ...req.body };
  res.json({ success: true, data: foodLocations[idx] });
});

app.delete('/api/food-locations/:id', (req, res) => {
  const id = parseInt(req.params.id);
  foodLocations = foodLocations.filter(l => l.id !== id);
  res.status(204).send();
});

// Water Conservation Action Tracker API
let waterInitiatives = [
  {
    id: 1,
    name: "City Park Water-Saving Retrofit",
    type: "water-saving",
    region: "north",
    lat: 34.0736,
    lng: -118.4004,
    info: "Low-flow irrigation installed."
  },
  {
    id: 2,
    name: "Rainwater Harvesting at Community Center",
    type: "rainwater-harvesting",
    region: "east",
    lat: 34.0622,
    lng: -118.2437,
    info: "Rain barrels and cisterns in use."
  },
  {
    id: 3,
    name: "Drought-Resilient Garden Project",
    type: "drought-landscaping",
    region: "south",
    lat: 34.0407,
    lng: -118.2468,
    info: "Native plants and xeriscaping."
  }
];

app.get('/api/water-initiatives', (req, res) => {
  res.json({ success: true, data: waterInitiatives });
});

app.post('/api/water-initiatives', (req, res) => {
  const init = req.body;
  init.id = waterInitiatives.length + 1;
  waterInitiatives.push(init);
  res.status(201).json({ success: true, data: init });
});

app.put('/api/water-initiatives/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = waterInitiatives.findIndex(i => i.id === id);
  if (idx === -1) return res.status(404).send('Not found');
  waterInitiatives[idx] = { ...waterInitiatives[idx], ...req.body };
  res.json({ success: true, data: waterInitiatives[idx] });
});

app.delete('/api/water-initiatives/:id', (req, res) => {
  const id = parseInt(req.params.id);
  waterInitiatives = waterInitiatives.filter(i => i.id !== id);
  res.status(204).send();
});

// Urban Pollinator Pathways Mapper API
let pollinatorHabitats = [
  {
    id: 1,
    name: "Lincoln Park Pollinator Garden",
    type: "garden",
    region: "north",
    lat: 41.9214,
    lng: -87.6513,
    info: "Native flowers, bee hotels, butterfly host plants."
  },
  {
    id: 2,
    name: "City Hall Green Roof",
    type: "green-roof",
    region: "west",
    lat: 41.8837,
    lng: -87.6376,
    info: "Green roof with wildflowers and pollinator habitat."
  },
  {
    id: 3,
    name: "Wildflower Corridor on Riverwalk",
    type: "wildflower-corridor",
    region: "east",
    lat: 41.8880,
    lng: -87.6207,
    info: "Continuous wildflower strip for bees and butterflies."
  }
];

app.get('/api/pollinator-habitats', (req, res) => {
  res.json({ success: true, data: pollinatorHabitats });
});

app.post('/api/pollinator-habitats', (req, res) => {
  const hab = req.body;
  hab.id = pollinatorHabitats.length + 1;
  pollinatorHabitats.push(hab);
  res.status(201).json({ success: true, data: hab });
});

app.put('/api/pollinator-habitats/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = pollinatorHabitats.findIndex(h => h.id === id);
  if (idx === -1) return res.status(404).send('Not found');
  pollinatorHabitats[idx] = { ...pollinatorHabitats[idx], ...req.body };
  res.json({ success: true, data: pollinatorHabitats[idx] });
});

app.delete('/api/pollinator-habitats/:id', (req, res) => {
  const id = parseInt(req.params.id);
  pollinatorHabitats = pollinatorHabitats.filter(h => h.id !== id);
  res.status(204).send();
});

// Community Compost Network API
let compostSites = [
  {
    id: 1,
    name: "Mission Compost Drop-Off",
    type: "drop-off",
    region: "south",
    lat: 37.7599,
    lng: -122.4148,
    info: "Open daily, accepts food scraps."
  },
  {
    id: 2,
    name: "Golden Gate Municipal Facility",
    type: "municipal",
    region: "north",
    lat: 37.7715,
    lng: -122.4687,
    info: "Large-scale composting, accepts yard waste."
  },
  {
    id: 3,
    name: "Bayview Community Compost Initiative",
    type: "community",
    region: "east",
    lat: 37.7294,
    lng: -122.3826,
    info: "Neighborhood-run, educational workshops."
  }
];

app.get('/api/compost-sites', (req, res) => {
  res.json({ success: true, data: compostSites });
});

app.post('/api/compost-sites', (req, res) => {
  const site = req.body;
  site.id = compostSites.length + 1;
  compostSites.push(site);
  res.status(201).json({ success: true, data: site });
});

app.put('/api/compost-sites/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = compostSites.findIndex(s => s.id === id);
  if (idx === -1) return res.status(404).send('Not found');
  compostSites[idx] = { ...compostSites[idx], ...req.body };
  res.json({ success: true, data: compostSites[idx] });
});

app.delete('/api/compost-sites/:id', (req, res) => {
  const id = parseInt(req.params.id);
  compostSites = compostSites.filter(s => s.id !== id);
  res.status(204).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log(`🚀 Category Management API running on port ${PORT}`);
    console.log('='.repeat(60));
});

module.exports = app;
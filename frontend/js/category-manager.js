// Enhanced Category Management System
class CategoryManager {
    constructor() {
        this.categories = [];
        this.projects = [];
        this.validationRules = {
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
        this.techStackMapping = {
            'React': 'Frontend',
            'Vue.js': 'Frontend', 
            'Angular': 'Frontend',
            'HTML': 'Frontend',
            'CSS': 'Frontend',
            'JavaScript': 'Frontend',
            'TypeScript': 'Frontend',
            'Node.js': 'Backend',
            'Express': 'Backend',
            'Python': 'Backend',
            'Django': 'Backend',
            'Flask': 'Backend',
            'PHP': 'Backend',
            'Java': 'Backend',
            'Spring': 'Backend',
            'React Native': 'Mobile Apps',
            'Flutter': 'Mobile Apps',
            'Swift': 'Mobile Apps',
            'Kotlin': 'Mobile Apps',
            'Ionic': 'Mobile Apps',
            'MongoDB': 'Database',
            'MySQL': 'Database',
            'PostgreSQL': 'Database',
            'Redis': 'Database',
            'Docker': 'DevOps',
            'Kubernetes': 'DevOps',
            'AWS': 'Cloud',
            'Azure': 'Cloud',
            'GCP': 'Cloud'
        };
    }

    // Category CRUD Operations
    addCategory(categoryData) {
        try {
            // Validate category data
            const validation = this.validateCategory(categoryData);
            if (!validation.isValid) {
                throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
            }

            // Check for duplicates
            if (this.isDuplicateCategory(categoryData.name)) {
                throw new Error('Category with this name already exists');
            }

            // Check for circular references
            if (categoryData.parent && this.wouldCreateCircularReference(null, categoryData.parent)) {
                throw new Error('Cannot create circular reference in category hierarchy');
            }

            const newCategory = {
                id: this.generateId(),
                name: categoryData.name.trim(),
                parent: categoryData.parent || null,
                description: categoryData.description || '',
                createdAt: new Date(),
                updatedAt: new Date(),
                projectCount: 0
            };

            this.categories.push(newCategory);
            this.logActivity(`Added category: ${newCategory.name}`);
            
            return {
                success: true,
                data: newCategory
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    updateCategory(categoryId, updateData) {
        try {
            const category = this.categories.find(c => c.id === categoryId);
            if (!category) {
                throw new Error('Category not found');
            }

            // Validate updated data
            const validation = this.validateCategory({ ...category, ...updateData });
            if (!validation.isValid) {
                throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
            }

            // Check for circular references if parent is being changed
            if (updateData.parent !== undefined && 
                this.wouldCreateCircularReference(categoryId, updateData.parent)) {
                throw new Error('Cannot create circular reference in category hierarchy');
            }

            // Update category
            Object.assign(category, {
                ...updateData,
                updatedAt: new Date()
            });

            this.logActivity(`Updated category: ${category.name}`);
            
            return {
                success: true,
                data: category
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    deleteCategory(categoryId) {
        try {
            const categoryIndex = this.categories.findIndex(c => c.id === categoryId);
            if (categoryIndex === -1) {
                throw new Error('Category not found');
            }

            const category = this.categories[categoryIndex];

            // Check if category has children
            const hasChildren = this.categories.some(c => c.parent === categoryId);
            if (hasChildren) {
                throw new Error('Cannot delete category with subcategories. Move or delete subcategories first.');
            }

            // Check if category has projects
            const hasProjects = this.projects.some(p => p.categoryId === categoryId);
            if (hasProjects) {
                throw new Error('Cannot delete category with assigned projects. Reassign projects first.');
            }

            this.categories.splice(categoryIndex, 1);
            this.logActivity(`Deleted category: ${category.name}`);
            
            return {
                success: true,
                message: 'Category deleted successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Validation Methods
    validateCategory(categoryData) {
        const errors = [];

        // Name validation
        if (!categoryData.name || categoryData.name.trim().length === 0) {
            errors.push('Category name is required');
        } else {
            const name = categoryData.name.trim();
            if (name.length < this.validationRules.name.minLength) {
                errors.push(`Category name must be at least ${this.validationRules.name.minLength} characters`);
            }
            if (name.length > this.validationRules.name.maxLength) {
                errors.push(`Category name must not exceed ${this.validationRules.name.maxLength} characters`);
            }
            if (!this.validationRules.name.pattern.test(name)) {
                errors.push('Category name contains invalid characters. Use only letters, numbers, spaces, hyphens, and underscores.');
            }
        }

        // Description validation
        if (categoryData.description && 
            categoryData.description.length > this.validationRules.description.maxLength) {
            errors.push(`Description must not exceed ${this.validationRules.description.maxLength} characters`);
        }

        // Parent validation
        if (categoryData.parent && !this.categories.find(c => c.id === categoryData.parent)) {
            errors.push('Invalid parent category');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    validateAllCategories() {
        const results = {
            valid: [],
            invalid: [],
            duplicates: this.findDuplicateCategories(),
            orphaned: [],
            circularReferences: []
        };

        this.categories.forEach(category => {
            const validation = this.validateCategory(category);
            
            if (validation.isValid) {
                results.valid.push(category);
            } else {
                results.invalid.push({
                    category,
                    errors: validation.errors
                });
            }

            // Check for orphaned categories (parent doesn't exist)
            if (category.parent && !this.categories.find(c => c.id === category.parent)) {
                results.orphaned.push(category);
            }
        });

        return results;
    }

    // Duplicate Detection and Management
    findDuplicateCategories() {
        const nameMap = new Map();
        const duplicates = [];

        this.categories.forEach(category => {
            const normalizedName = this.normalizeString(category.name);
            if (nameMap.has(normalizedName)) {
                nameMap.get(normalizedName).push(category);
            } else {
                nameMap.set(normalizedName, [category]);
            }
        });

        nameMap.forEach((categoryList, name) => {
            if (categoryList.length > 1) {
                duplicates.push({
                    normalizedName: name,
                    categories: categoryList,
                    count: categoryList.length
                });
            }
        });

        return duplicates;
    }

    mergeDuplicateCategories() {
        const duplicates = this.findDuplicateCategories();
        let mergedCount = 0;
        const mergeLog = [];

        duplicates.forEach(duplicate => {
            if (duplicate.categories.length > 1) {
                // Keep the oldest category as the main one
                const sortedCategories = duplicate.categories.sort((a, b) => 
                    new Date(a.createdAt) - new Date(b.createdAt)
                );
                
                const mainCategory = sortedCategories[0];
                const duplicateCategories = sortedCategories.slice(1);

                // Move projects from duplicate categories to main category
                duplicateCategories.forEach(dupCat => {
                    const movedProjects = this.projects.filter(p => p.categoryId === dupCat.id);
                    movedProjects.forEach(project => {
                        project.categoryId = mainCategory.id;
                    });

                    // Update child categories to point to main category
                    this.categories.forEach(cat => {
                        if (cat.parent === dupCat.id) {
                            cat.parent = mainCategory.id;
                        }
                    });

                    mergeLog.push({
                        merged: dupCat.name,
                        into: mainCategory.name,
                        projectsMoved: movedProjects.length
                    });
                });

                // Remove duplicate categories
                this.categories = this.categories.filter(cat => 
                    !duplicateCategories.some(dupCat => dupCat.id === cat.id)
                );

                mergedCount += duplicateCategories.length;
            }
        });

        this.logActivity(`Merged ${mergedCount} duplicate categories`);
        
        return {
            success: true,
            mergedCount,
            details: mergeLog
        };
    }

    // Hierarchy Management
    getCategoryHierarchy() {
        const buildHierarchy = (parentId = null, depth = 0) => {
            return this.categories
                .filter(cat => cat.parent === parentId)
                .map(cat => ({
                    ...cat,
                    depth,
                    children: buildHierarchy(cat.id, depth + 1),
                    projectCount: this.projects.filter(p => p.categoryId === cat.id).length,
                    totalProjectCount: this.getTotalProjectCount(cat.id)
                }));
        };

        return buildHierarchy();
    }

    getTotalProjectCount(categoryId) {
        let count = this.projects.filter(p => p.categoryId === categoryId).length;
        
        // Add projects from child categories
        const children = this.categories.filter(c => c.parent === categoryId);
        children.forEach(child => {
            count += this.getTotalProjectCount(child.id);
        });

        return count;
    }

    moveCategory(categoryId, newParentId) {
        try {
            const category = this.categories.find(c => c.id === categoryId);
            if (!category) {
                throw new Error('Category not found');
            }

            if (newParentId && !this.categories.find(c => c.id === newParentId)) {
                throw new Error('New parent category not found');
            }

            if (this.wouldCreateCircularReference(categoryId, newParentId)) {
                throw new Error('Cannot create circular reference in category hierarchy');
            }

            const oldParent = category.parent;
            category.parent = newParentId;
            category.updatedAt = new Date();

            this.logActivity(`Moved category ${category.name} from ${oldParent || 'root'} to ${newParentId || 'root'}`);
            
            return {
                success: true,
                data: category
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Auto-categorization
    autoCategorizeProjects() {
        let categorizedCount = 0;
        const results = [];

        this.projects.forEach(project => {
            if (!project.categoryId && project.techStack && project.techStack.length > 0) {
                const suggestedCategoryId = this.suggestCategoryForProject(project);
                if (suggestedCategoryId) {
                    project.categoryId = suggestedCategoryId;
                    const category = this.categories.find(c => c.id === suggestedCategoryId);
                    categorizedCount++;
                    results.push({
                        projectId: project.id,
                        projectName: project.name,
                        assignedCategory: category.name,
                        reason: 'Tech stack analysis'
                    });
                }
            }
        });

        this.logActivity(`Auto-categorized ${categorizedCount} projects`);
        
        return {
            success: true,
            categorizedCount,
            results
        };
    }

    suggestCategoryForProject(project) {
        // Score each category based on tech stack match
        const categoryScores = new Map();

        project.techStack.forEach(tech => {
            const suggestedCategoryName = this.techStackMapping[tech];
            if (suggestedCategoryName) {
                const category = this.categories.find(c => 
                    c.name.toLowerCase().includes(suggestedCategoryName.toLowerCase())
                );
                if (category) {
                    const currentScore = categoryScores.get(category.id) || 0;
                    categoryScores.set(category.id, currentScore + 1);
                }
            }
        });

        // Return category with highest score
        if (categoryScores.size > 0) {
            const bestMatch = [...categoryScores.entries()]
                .sort((a, b) => b[1] - a[1])[0];
            return bestMatch[0];
        }

        return null;
    }

    generateCategorySuggestions() {
        const allTechStacks = [...new Set(this.projects.flatMap(p => p.techStack || []))];
        const existingCategoryNames = this.categories.map(c => c.name.toLowerCase());
        
        const suggestions = [];

        allTechStacks.forEach(tech => {
            const suggestedCategoryName = this.techStackMapping[tech];
            if (suggestedCategoryName && 
                !existingCategoryNames.some(name => name.includes(suggestedCategoryName.toLowerCase()))) {
                
                const projectsUsingTech = this.projects.filter(p => 
                    p.techStack && p.techStack.includes(tech)
                ).length;

                suggestions.push({
                    name: suggestedCategoryName,
                    basedOnTech: tech,
                    potentialProjects: projectsUsingTech,
                    description: `Category for ${tech}-based projects`
                });
            }
        });

        // Remove duplicates
        const uniqueSuggestions = suggestions.filter((suggestion, index, self) => 
            index === self.findIndex(s => s.name === suggestion.name)
        );

        return uniqueSuggestions;
    }

    // Bulk Operations
    bulkAssignCategory(projectIds, categoryId) {
        try {
            const category = this.categories.find(c => c.id === categoryId);
            if (!category) {
                throw new Error('Category not found');
            }

            let updatedCount = 0;
            const results = [];

            projectIds.forEach(projectId => {
                const project = this.projects.find(p => p.id === projectId);
                if (project) {
                    const oldCategory = project.categoryId;
                    project.categoryId = categoryId;
                    updatedCount++;
                    results.push({
                        projectId,
                        projectName: project.name,
                        oldCategory,
                        newCategory: categoryId
                    });
                }
            });

            this.logActivity(`Bulk assigned ${updatedCount} projects to category: ${category.name}`);
            
            return {
                success: true,
                updatedCount,
                results
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    bulkUpdateCategories(updates) {
        const results = [];
        let successCount = 0;
        let errorCount = 0;

        updates.forEach(update => {
            const result = this.updateCategory(update.categoryId, update.data);
            results.push({
                categoryId: update.categoryId,
                ...result
            });
            
            if (result.success) {
                successCount++;
            } else {
                errorCount++;
            }
        });

        return {
            success: errorCount === 0,
            successCount,
            errorCount,
            results
        };
    }

    // Utility Methods
    isDuplicateCategory(name, excludeId = null) {
        const normalizedName = this.normalizeString(name);
        return this.categories.some(cat => 
            cat.id !== excludeId && this.normalizeString(cat.name) === normalizedName
        );
    }

    wouldCreateCircularReference(categoryId, parentId) {
        if (!parentId) return false;
        
        let currentParent = parentId;
        const visited = new Set();

        while (currentParent) {
            if (visited.has(currentParent) || currentParent === categoryId) {
                return true;
            }
            visited.add(currentParent);
            const parent = this.categories.find(c => c.id === currentParent);
            currentParent = parent ? parent.parent : null;
        }

        return false;
    }

    normalizeString(str) {
        return str.toLowerCase().trim().replace(/\s+/g, ' ');
    }

    generateId() {
        return Date.now() + Math.random();
    }

    logActivity(message) {
        console.log(`[${new Date().toISOString()}] ${message}`);
    }

    // Statistics and Analytics
    getCategoryStatistics() {
        const stats = {
            totalCategories: this.categories.length,
            rootCategories: this.categories.filter(c => !c.parent).length,
            maxDepth: this.calculateMaxDepth(),
            totalProjects: this.projects.length,
            categorizedProjects: this.projects.filter(p => p.categoryId).length,
            uncategorizedProjects: this.projects.filter(p => !p.categoryId).length,
            duplicateCategories: this.findDuplicateCategories().length,
            averageProjectsPerCategory: this.categories.length > 0 ? 
                this.projects.filter(p => p.categoryId).length / this.categories.length : 0
        };

        return stats;
    }

    calculateMaxDepth() {
        let maxDepth = 0;

        const getDepth = (categoryId, currentDepth = 0) => {
            const children = this.categories.filter(c => c.parent === categoryId);
            if (children.length === 0) {
                return currentDepth;
            }
            return Math.max(...children.map(child => getDepth(child.id, currentDepth + 1)));
        };

        this.categories.filter(c => !c.parent).forEach(rootCategory => {
            maxDepth = Math.max(maxDepth, getDepth(rootCategory.id));
        });

        return maxDepth;
    }

    exportCategories() {
        return {
            categories: this.categories,
            hierarchy: this.getCategoryHierarchy(),
            statistics: this.getCategoryStatistics(),
            exportedAt: new Date().toISOString()
        };
    }

    importCategories(data) {
        try {
            if (data.categories && Array.isArray(data.categories)) {
                this.categories = data.categories;
                this.logActivity(`Imported ${data.categories.length} categories`);
                return {
                    success: true,
                    message: `Successfully imported ${data.categories.length} categories`
                };
            } else {
                throw new Error('Invalid import data format');
            }
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CategoryManager;
}

// Global instance for browser usage
if (typeof window !== 'undefined') {
    window.CategoryManager = CategoryManager;
}
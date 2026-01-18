/**
 * Community Blog Management System
 *
 * Handles blog post display, filtering, searching, creation, and modal interactions
 * for the community blog section. Includes sample blog data and interactive features.
 *
 * @author Environment & Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 */

(function() {
    'use strict';

    /**
     * Sample blog data for demonstration
     * @type {Array<Object>}
     */
    const blogsData = [
        {
            id: 1,
            title: "Eco Gardening Tips",
            author: "User12",
            category: "environment",
            img: "https://picsum.photos/seed/blog1/300/200",
            content: "Eco gardening promotes natural growing methods using compost, native plants, and water conservation to protect the environment and improve soil health."
        },
        {
            id: 2,
            title: "Plastic-Free Living",
            author: "User34",
            category: "diy",
            img: "https://picsum.photos/seed/blog2/300/200",
            content: "Plastic-free living focuses on reducing single-use plastics by switching to reusable products like cloth bags, metal bottles, and glass containers."
        },
        {
            id: 3,
            title: "Solar Power Ideas",
            author: "User56",
            category: "energy",
            img: "https://picsum.photos/seed/blog3/300/200",
            content: "Solar energy is a clean and renewable power source. Using solar panels and solar-powered devices helps reduce electricity bills and carbon emissions."
        },
        {
            id: 4,
            title: "Tech for Nature",
            author: "User78",
            category: "technology",
            img: "https://picsum.photos/seed/blog4/300/200",
            content: "Technology helps protect nature through tools like wildlife tracking, environmental sensors, and data-driven conservation efforts."
        },
        {
            id: 5,
            title: "Composting at Home",
            author: "User90",
            category: "environment",
            img: "https://picsum.photos/seed/blog5/300/200",
            content: "Home composting turns kitchen waste into organic fertilizer, reducing landfill waste and improving soil quality naturally."
        },
        {
            id: 6,
            title: "DIY Birdhouses",
            author: "User21",
            category: "diy",
            img: "https://picsum.photos/seed/blog6/300/200",
            content: "DIY birdhouses provide safe shelters for birds and support biodiversity. They are simple projects made using recycled materials."
        },
        {
            id: 7,
            title: "Energy Efficient Homes",
            author: "User33",
            category: "energy",
            img: "https://picsum.photos/seed/blog7/300/200",
            content: "Energy-efficient homes use insulation, LED lighting, and smart appliances to reduce power usage and save money."
        },
        {
            id: 8,
            title: "Urban Gardening Hacks",
            author: "User45",
            category: "environment",
            img: "https://picsum.photos/seed/blog8/300/200",
            content: "Urban gardening uses balconies, rooftops, and small spaces to grow plants using containers and vertical gardening techniques."
        },
        {
            id: 9,
            title: "Rainwater Harvesting",
            author: "User11",
            category: "environment",
            img: "https://picsum.photos/seed/blog9/300/200",
            content: "Rainwater harvesting collects rainwater for reuse, reducing water bills and conserving groundwater resources."
        },
        {
            id: 10,
            title: "Minimalist Home Decor",
            author: "User22",
            category: "diy",
            img: "https://picsum.photos/seed/blog10/300/200",
            content: "Minimalist decor focuses on simplicity, functionality, and natural materials to create calm and eco-friendly spaces."
        },
        {
            id: 11,
            title: "Wind Energy Explained",
            author: "User35",
            category: "energy",
            img: "https://picsum.photos/seed/blog11/300/200",
            content: "Wind energy uses turbines to convert wind into electricity and is one of the most sustainable power sources."
        },
        {
            id: 12,
            title: "Smart Irrigation Systems",
            author: "User46",
            category: "technology",
            img: "https://picsum.photos/seed/blog12/300/200",
            content: "Smart irrigation systems optimize water usage using sensors and weather data, reducing waste and improving plant growth."
        },
        {
            id: 13,
            title: "Plant-Based Recipes",
            author: "User57",
            category: "diy",
            img: "https://picsum.photos/seed/blog13/300/200",
            content: "Plant-based diets rely on vegetables, grains, and legumes, offering health benefits and reducing environmental impact."
        },
        {
            id: 14,
            title: "Green Roof Benefits",
            author: "User68",
            category: "environment",
            img: "https://picsum.photos/seed/blog14/300/200",
            content: "Green roofs reduce heat, manage rainwater, improve air quality, and create habitats for birds and insects."
        },
        {
            id: 15,
            title: "Solar Panel Maintenance",
            author: "User79",
            category: "energy",
            img: "https://picsum.photos/seed/blog15/300/200",
            content: "Maintaining solar panels by cleaning and inspections ensures better efficiency and longer lifespan."
        },
        {
            id: 16,
            title: "Home Automation for Energy Saving",
            author: "User80",
            category: "technology",
            img: "https://picsum.photos/seed/blog16/300/200",
            content: "Home automation controls lighting, temperature, and devices automatically to reduce energy usage."
        },
        {
            id: 17,
            title: "Recycled Crafts Ideas",
            author: "User81",
            category: "diy",
            img: "https://picsum.photos/seed/blog17/300/200",
            content: "Recycled crafts transform waste materials into creative and useful products, helping reduce pollution."
        },
        {
            id: 18,
            title: "Organic Vegetable Gardening",
            author: "User82",
            category: "environment",
            img: "https://picsum.photos/seed/blog18/300/200",
            content: "Organic vegetable gardening avoids chemicals and promotes healthy soil for safer and nutritious food."
        },
        {
            id: 19,
            title: "LED Lighting Upgrades",
            author: "User83",
            category: "energy",
            img: "https://picsum.photos/seed/blog19/300/200",
            content: "LED lighting consumes less power, lasts longer, and reduces electricity bills compared to traditional bulbs."
        },
        {
            id: 20,
            title: "Sustainable Tech Gadgets",
            author: "User84",
            category: "technology",
            img: "https://picsum.photos/seed/blog20/300/200",
            content: "Eco-friendly tech gadgets use less energy and are designed with sustainability in mind."
        },
        {
            id: 21,
            title: "DIY Herb Garden",
            author: "User85",
            category: "diy",
            img: "https://picsum.photos/seed/blog21/300/200",
            content: "DIY herb gardens are easy to build at home and provide fresh herbs while promoting green living."
        },
        {
            id: 22,
            title: "Compostable Kitchen Waste",
            author: "User86",
            category: "environment",
            img: "https://picsum.photos/seed/blog22/300/200",
            content: "Kitchen waste like fruit peels and leftovers can be composted to reduce garbage and enrich soil."
        },
        {
            id: 23,
            title: "Geothermal Energy Basics",
            author: "User87",
            category: "energy",
            img: "https://picsum.photos/seed/blog23/300/200",
            content: "Geothermal energy uses heat from the earth to generate power and is a reliable renewable source."
        },
        {
            id: 24,
            title: "Tech for Urban Farming",
            author: "User88",
            category: "technology",
            img: "https://picsum.photos/seed/blog24/300/200",
            content: "Urban farming technology helps grow food efficiently using hydroponics, sensors, and automation."
        },
        {
            id: 25,
            title: "Upcycled Furniture Ideas",
            author: "User89",
            category: "diy",
            img: "https://picsum.photos/seed/blog25/300/200",
            content: "Upcycling furniture gives old items new life, reducing waste and adding unique style."
        },
        {
            id: 26,
            title: "Indoor Air Quality Tips",
            author: "User90",
            category: "environment",
            img: "https://picsum.photos/seed/blog26/300/200",
            content: "Improving indoor air quality involves plants, ventilation, and reducing chemical pollutants."
        },
        {
            id: 27,
            title: "Energy Star Appliances",
            author: "User91",
            category: "energy",
            img: "https://picsum.photos/seed/blog27/300/200",
            content: "Energy Star appliances consume less electricity and help save energy without losing performance."
        },
        {
            id: 28,
            title: "Wearable Eco-Tech",
            author: "User92",
            category: "technology",
            img: "https://picsum.photos/seed/blog28/300/200",
            content: "Wearable eco-tech includes smart devices designed to be energy-efficient and environmentally friendly."
        },
        {
            id: 29,
            title: "DIY Natural Cleaning Products",
            author: "User93",
            category: "diy",
            img: "https://picsum.photos/seed/blog29/300/200",
            content: "DIY natural cleaning products use simple ingredients like vinegar, baking soda, and lemon to keep homes clean without harmful chemicals."
        }
    ];

    /**
     * Renders blog posts based on filter and search criteria
     * @param {string} filter - Category filter ('all', 'environment', 'diy', 'energy', 'technology')
     * @param {string} search - Search query string
     */
    function renderBlogs(filter = 'all', search = '') {
        const container = document.getElementById('blogs-container');
        container.innerHTML = '';

        let filteredBlogs = blogsData.filter(blog => {
            const matchesFilter = filter === 'all' || blog.category === filter;
            const matchesSearch = blog.title.toLowerCase().includes(search.toLowerCase());
            return matchesFilter && matchesSearch;
        });

        if (filteredBlogs.length === 0) {
            container.innerHTML = "<p class='text-sm' style='text-align:center;width:100%'>No blogs found</p>";
            return;
        }

        filteredBlogs.forEach(blog => {
            const blogCard = document.createElement('div');
            blogCard.className = 'blog-card';
            blogCard.innerHTML = `
                <img src="${blog.img}" alt="Blog Image">
                <div class="blog-title">${blog.title}</div>
                <div class="blog-author">by ${blog.author}</div>
                <div class="blog-actions row">
                    <i class="fa-regular fa-heart upvote-btn" title="Upvote"></i>
                    <i class="fa-regular fa-comment comment-btn" title="Comment"></i>
                    <button class="read-btn" data-id="${blog.id}">Read More</button>
                </div>
            `;
            container.appendChild(blogCard);
        });
    }

    /**
     * Opens blog detail modal with full content
     * @param {number} blogId - ID of the blog post to display
     */
    function openBlogDetail(blogId) {
        const blog = blogsData.find(b => b.id === blogId);
        if (!blog) {
            return;
        }

        const modalContent = document.getElementById('blogModalContent');
        modalContent.innerHTML = `
            <div class="modal-image-wrapper">
                <img src="${blog.img}" alt="${blog.title}">
            </div>
            <div class="modal-content-wrapper">
                <div class="modal-header">
                    <h2>${blog.title}</h2>
                    <span class="category-badge">${blog.category}</span>
                </div>
                <div class="modal-meta">
                    <p><strong>Author:</strong> ${blog.author}</p>
                </div>
            </div>
            <hr style="margin: 16px 0">
            <p style="line-height: 1.6;">${blog.content}</p>
        `;

        document.getElementById('blogModal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    /**
     * Closes the blog detail modal
     */
    function closeBlogModal() {
        document.getElementById('blogModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    /**
     * Initializes blog functionality when DOM is loaded
     */
    function initBlogSystem() {
        // Initial render
        renderBlogs();

        // Read More button click handler
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('read-btn')) {
                const blogId = Number(e.target.dataset.id);
                openBlogDetail(blogId);
            }
        });

        // Modal close handlers
        document.getElementById('blogModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeBlogModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeBlogModal();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderBlogs(btn.dataset.filter, document.querySelector('.search-blog')?.value || '');
            });
        });

        // Search functionality
        const searchInput = document.querySelector('.top-bar .input');
        searchInput?.addEventListener('input', () => {
            const searchValue = searchInput.value.toLowerCase().trim();
            // Get all dynamically created blog cards each time user types
            const blogCards = document.querySelectorAll('.blog-card');
            blogCards.forEach(card => {
                const blogTitle = card.querySelector('.blog-title').textContent.toLowerCase();
                const blogAuthor = card.querySelector('.blog-author').textContent.toLowerCase();
                if (blogTitle.includes(searchValue) || blogAuthor.includes(searchValue)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });

        // Create blog modal
        const createBtn = document.querySelector('.create-blog-btn');
        const modal = document.getElementById('createBlogModal');
        const closeModal = modal?.querySelector('.close-modal');
        const submitBtn = modal?.querySelector('.submit-blog-btn');

        if (createBtn) {
            createBtn.addEventListener('click', () => modal.style.display = 'flex');
        }

        if (closeModal) {
            closeModal.addEventListener('click', () => modal.style.display = 'none');
            window.addEventListener('click', e => {
                if (e.target === modal) modal.style.display = 'none';
            });
        }

        // Submit blog handler
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                const title = modal.querySelector('.blog-title-input').value.trim();
                const category = modal.querySelector('.blog-category-input').value;
                const desc = modal.querySelector('.blog-desc-input').value.trim();
                const imageInput = modal.querySelector('.blog-image-input');
                const imgURL = imageInput.files[0] ? URL.createObjectURL(imageInput.files[0]) : 'https://picsum.photos/300/200';

                if (title && desc) {
                    const newBlog = {
                        title,
                        author: 'You',
                        category,
                        img: imgURL
                    };
                    blogsData.unshift(newBlog); // add to top
                    renderBlogs(document.querySelector('.filter-btn.active').dataset.filter, searchInput.value);
                    modal.style.display = 'none';

                    // Reset form
                    modal.querySelector('.blog-title-input').value = '';
                    modal.querySelector('.blog-desc-input').value = '';
                    modal.querySelector('.blog-image-input').value = '';
                }
            });
        }

        // View blog from right panel
        document.querySelectorAll('.view-blog-btn').forEach((btn, i) => {
            btn.addEventListener('click', () => {
                const blog = blogsData[i];
                if (blog) {
                    renderBlogs('all', ''); // Clear filter/search
                    const container = document.getElementById('blogs-container');
                    container.innerHTML = '';
                    const blogCard = document.createElement('div');
                    blogCard.className = 'blog-card';
                    blogCard.innerHTML = `
                        <img src="${blog.img}" alt="Blog Image">
                        <div class="blog-title">${blog.title}</div>
                        <div class="blog-author">by ${blog.author}</div>
                        <p class="blog-desc-text">${blog.title} details and content goes here...</p>
                    `;
                    container.appendChild(blogCard);
                }
            });
        });
    }

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', initBlogSystem);

})();
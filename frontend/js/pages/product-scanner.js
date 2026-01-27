document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Scanner
    const onScanSuccess = (decodedText, decodedResult) => {
        // Handle the scanned code as you like, for example:
        console.log(`Code matched = ${decodedText}`, decodedResult);

        // Stop scanning temporarily or purely to show results
        // html5QrcodeScanner.clear(); 
        // Or just process logic
        fetchProductData(decodedText);
    };

    const onScanFailure = (error) => {
        // handle scan failure, usually better to ignore and keep scanning.
        // console.warn(`Code scan error = ${error}`);
    };

    let html5QrcodeScanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false);
    html5QrcodeScanner.render(onScanSuccess, onScanFailure);

    // Mock data for testing without a barcode (Optional: functionality to enter manually could be added)
});

async function fetchProductData(barcode) {
    const loader = document.getElementById('loadingSpinner');
    const resultSection = document.getElementById('resultSection');
    const scannerSection = document.getElementById('reader');

    // Show loader
    loader.style.display = 'block';
    resultSection.style.display = 'none';

    // Smooth scroll to loader
    loader.scrollIntoView({ behavior: 'smooth' });

    try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
        const data = await response.json();

        if (data.status === 1) {
            displayProduct(data.product);
        } else {
            alert("Product not found! Please try another product.");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error connecting to database. Please check your internet.");
    } finally {
        loader.style.display = 'none';
    }
}

function displayProduct(product) {
    const resultSection = document.getElementById('resultSection');

    // Basic Info
    document.getElementById('productName').textContent = product.product_name || "Unknown Name";
    document.getElementById('productBrand').textContent = product.brands || "Unknown Brand";
    document.getElementById('productImage').src = product.image_url || 'https://via.placeholder.com/300?text=No+Image';

    // Scores
    const scoresContainer = document.getElementById('scoresContainer');
    scoresContainer.innerHTML = '';

    if (product.ecoscore_grade) {
        scoresContainer.innerHTML += createScoreBadge('Eco-Score', product.ecoscore_grade.toUpperCase(), 'eco');
    }

    if (product.nutriscore_grade) {
        scoresContainer.innerHTML += createScoreBadge('Nutri-Score', product.nutriscore_grade.toUpperCase(), 'nutri');
    }

    // Tags (Vegan, Organic, etc.)
    const tagsContainer = document.getElementById('tagsContainer');
    tagsContainer.innerHTML = '';

    const labels = product.labels_tags || [];
    const ingredients = product.ingredients_analysis_tags || [];

    // Helper to check tags
    const hasTag = (arr, term) => arr.some(t => t.toLowerCase().includes(term));

    if (hasTag(labels, 'organic')) tagsContainer.innerHTML += `<span class="tag organic"><i class="fas fa-leaf"></i> Organic</span>`;
    if (hasTag(labels, 'vegan') || hasTag(ingredients, 'vegan')) tagsContainer.innerHTML += `<span class="tag vegan"><i class="fas fa-seedling"></i> Vegan</span>`;
    if (hasTag(labels, 'fair-trade')) tagsContainer.innerHTML += `<span class="tag"><i class="fas fa-hand-holding-heart"></i> Fair Trade</span>`;

    // Palm Oil Check
    if (hasTag(ingredients, 'palm-oil')) {
        tagsContainer.innerHTML += `<span class="tag warning"><i class="fas fa-exclamation-triangle"></i> Palm Oil</span>`;
    } else if (hasTag(ingredients, 'palm-oil-free')) {
        tagsContainer.innerHTML += `<span class="tag palm-oil-free"><i class="fas fa-check"></i> Palm Oil Free</span>`;
    }

    // Metrics (Packaging, Origin)
    const metricsGrid = document.getElementById('metricsGrid');
    metricsGrid.innerHTML = '';

    if (product.packaging) {
        metricsGrid.innerHTML += createMetricItem('fas fa-box', 'Packaging', product.packaging.split(',')[0]); // Take first item
    }
    if (product.origins) {
        metricsGrid.innerHTML += createMetricItem('fas fa-globe', 'Origin', product.origins);
    }
    if (product.carbon_footprint_100g) {
        metricsGrid.innerHTML += createMetricItem('fas fa-smog', 'Carbon / 100g', product.carbon_footprint_100g + 'g');
    }

    // Alternatives
    const alternativesSection = document.getElementById('alternativesSection');
    const alternativesList = document.getElementById('alternativesList');

    // Logic: If ecoscore is bad (D or E), find alternatives
    const ecoScore = product.ecoscore_grade ? product.ecoscore_grade.toLowerCase() : null;
    const categories = product.categories_tags;

    if ((ecoScore === 'd' || ecoScore === 'e' || ecoScore === 'c') && categories && categories.length > 0) {
        fetchAlternatives(categories[0]); // Use first category
        alternativesSection.style.display = 'block';
    } else {
        alternativesSection.style.display = 'none';
    }

    // Show result
    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

function createScoreBadge(label, grade, type) {
    // Defines colors based on grade could be added here
    let colorClass = `score-${type}`;
    // Simple logic for colors based on grade letter
    const gradeColor = {
        'A': '#2ecc71',
        'B': '#82e0aa',
        'C': '#f1c40f',
        'D': '#e67e22',
        'E': '#e74c3c'
    };
    const color = gradeColor[grade] || '#666';

    return `
    <div class="score-badge" style="border-color: ${color}; color: ${color}; background-color: ${color}15;">
        <i class="fas fa-star"></i> ${label}: ${grade}
    </div>
    `;
}

function createMetricItem(icon, label, value) {
    if (!value) return '';
    if (value.length > 20) value = value.substring(0, 20) + '...';
    return `
    <div class="metric-item">
        <i class="${icon} metric-icon"></i>
        <span class="metric-label">${label}</span>
        <span class="metric-value">${value}</span>
    </div>
    `;
}

async function fetchAlternatives(categoryTag) {
    const list = document.getElementById('alternativesList');
    list.innerHTML = '<p>Loading alternatives...</p>';

    try {
        // Fetch products in same category with EcoScore A
        const response = await fetch(`https://world.openfoodfacts.org/api/v2/search?categories_tags=${categoryTag}&ecoscore_grade=a&page_size=5&fields=product_name,image_url,code,brands`);
        const data = await response.json();

        if (data.products && data.products.length > 0) {
            list.innerHTML = data.products.map(p => `
                <div class="alt-card">
                    <img src="${p.image_url || 'https://via.placeholder.com/150'}" class="alt-image" alt="${p.product_name}">
                    <div class="alt-name">${p.product_name || 'Unknown'}</div>
                    <div style="font-size: 0.8rem; color: #666;">${p.brands || ''}</div>
                </div>
            `).join('');
        } else {
            list.innerHTML = '<p>No better alternatives found in this category.</p>';
        }
    } catch (e) {
        console.error("Error fetching alternatives", e);
        list.innerHTML = '<p>Could not load alternatives.</p>';
    }
}

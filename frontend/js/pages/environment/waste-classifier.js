document.addEventListener('DOMContentLoaded', async () => {
    const fileInput = document.getElementById('file-input');
    const uploadArea = document.getElementById('upload-area');
    const imagePreview = document.getElementById('image-preview');
    const uploadText = document.getElementById('upload-text');
    const classifyBtn = document.getElementById('classify-btn');
    const resultSection = document.getElementById('result-section');
    const loadingSpinner = document.getElementById('loading-spinner');

    // Model loading
    let net;
    let isModelLoaded = false;

    // Load MobileNet model
    async function loadModel() {
        console.log("Loading model...");
        try {
            net = await mobilenet.load();
            isModelLoaded = true;
            console.log("Model loaded successfully");
            classifyBtn.innerText = "Classify Waste";
            classifyBtn.disabled = false;
        } catch (error) {
            console.error("Error loading model:", error);
            classifyBtn.innerText = "Error Loading Model";
        }
    }

    loadModel();

    // Mapping relevant imageNet classes to waste categories
    // This is a simplified mapping for demonstration
    const wasteDatabase = {
        'recycle': ['bottle', 'can', 'paper', 'cardboard', 'newspaper', 'magazine', 'glass', 'jug', 'plastic', 'box', 'carton', 'cup'],
        'compost': ['apple', 'banana', 'orange', 'fruit', 'vegetable', 'food', 'bread', 'leaf', 'flower', 'plant'],
        'trash': ['cigarette', 'diaper', 'wrapper', 'styrofoam', 'foil']
    };

    const tips = {
        'recycle': "Check for the recycling symbol (♻️). Rinse any food residue before binning. Crush cans and bottles to save space.",
        'compost': "Great for your garden! Ensure no plastic stickers or non-organic material is attached.",
        'trash': "This item typically goes to the landfill. Try to reduce usage of such items in the future!",
        'unknown': "We're not sure about this one. Please check your local waste management guidelines."
    };

    // Handle file selection
    fileInput.addEventListener('change', handleFileSelect);

    // Click on upload area triggers file input
    uploadArea.addEventListener('click', () => fileInput.click());

    // Drag and drop support
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#2ecc71';
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#27ae60';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#27ae60';
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    function handleFileSelect(e) {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    }

    function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please upload a valid image file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
            uploadText.style.display = 'none';
            resultSection.style.display = 'none'; // Hide previous results
        };
        reader.readAsDataURL(file);
    }

    classifyBtn.addEventListener('click', async () => {
        if (!isModelLoaded) {
            alert("Model is still loading, please wait...");
            return;
        }
        if (!imagePreview.src || imagePreview.style.display === 'none') {
            alert("Please upload an image first.");
            return;
        }

        classifyBtn.style.display = 'none';
        loadingSpinner.style.display = 'block';

        try {
            // Make prediction
            const result = await net.classify(imagePreview);
            console.log("Classification result:", result);

            displayResult(result);
        } catch (error) {
            console.error("Classification error:", error);
            alert("Something went wrong during classification.");
        } finally {
            loadingSpinner.style.display = 'none';
            classifyBtn.style.display = 'inline-block';
        }
    });

    function displayResult(predictions) {
        // predictions is an array of {className, probability}
        const topPrediction = predictions[0];
        const className = topPrediction.className.toLowerCase();
        const probability = topPrediction.probability;

        let category = 'unknown';
        let foundKeyword = '';

        // Simple keyword matching
        // Check if any keyword in our map exists in the predicted class name
        // Prioritize specific matches

        // 1. Check Recycle
        for (const keyword of wasteDatabase.recycle) {
            if (className.includes(keyword)) {
                category = 'recycle';
                foundKeyword = keyword;
                break;
            }
        }

        // 2. Check Compost (if not found yet)
        if (category === 'unknown') {
            for (const keyword of wasteDatabase.compost) {
                if (className.includes(keyword)) {
                    category = 'compost';
                    foundKeyword = keyword;
                    break;
                }
            }
        }

        // 3. Check Trash (if not found yet)
        if (category === 'unknown') {
            for (const keyword of wasteDatabase.trash) {
                if (className.includes(keyword)) {
                    category = 'trash';
                    foundKeyword = keyword;
                    break;
                }
            }
        }

        // Update UI
        const resultTitle = document.getElementById('result-title');
        const confidenceFill = document.getElementById('confidence-fill');
        const badge = document.getElementById('result-badge');
        const tipText = document.getElementById('tip-text');

        resultTitle.textContent = `Identified: ${topPrediction.className}`;
        confidenceFill.style.width = `${(probability * 100).toFixed(0)}%`;

        // Remove old classes
        badge.className = 'result-badge';

        if (category === 'recycle') {
            badge.textContent = "♻️ Recycle";
            badge.classList.add('status-recycle');
        } else if (category === 'compost') {
            badge.textContent = "🍂 Compost";
            badge.classList.add('status-compost');
        } else if (category === 'trash') {
            badge.textContent = "🗑️ Landfill";
            badge.classList.add('status-trash');
        } else {
            badge.textContent = "❓ Unknown / Check Local Rules";
            badge.classList.add('status-trash'); // Default styling
        }

        tipText.textContent = tips[category];

        resultSection.style.display = 'block';
    }
});

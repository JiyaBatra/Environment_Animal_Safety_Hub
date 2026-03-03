const products = [
    {
        name: "Reusable Water Bottle",
        category: "Reusable",
        impact: 9,
        price: 18.99,
        rating: 4.7,
        features: ["BPA-free", "Stainless steel"]
    },
    {
        name: "Solar Power Provider",
        category: "Energy",
        impact: 10,
        price: 0,
        rating: 4.9,
        features: ["Renewable energy", "Home installation"]
    },
    {
        name: "LED Light Bulbs",
        category: "Energy",
        impact: 9,
        price: 4.99,
        rating: 4.8,
        features: ["Low energy use", "Long lifespan"]
    }
];

function renderProductOptions() {
    const container = document.getElementById("product-options");
    container.innerHTML = "";

    products.forEach((p, idx) => {
        const div = document.createElement("div");
        div.className = "product-option";
        div.innerHTML = `
            <input type="checkbox" data-idx="${idx}">
            <label><strong>${p.name}</strong> (${p.category})</label>
        `;
        container.appendChild(div);
    });
}

function renderComparisonTable(selected) {
    const table = document.getElementById("comparison-table");
    table.innerHTML = "";

    if (selected.length === 0) {
        table.innerHTML = "<tr><td>No products selected</td></tr>";
        return;
    }

    table.innerHTML += `
        <tr>
            <th>Name</th>
            <th>Impact</th>
            <th>Price</th>
            <th>Rating</th>
        </tr>
    `;

    selected.forEach(p => {
        table.innerHTML += `
            <tr>
                <td>${p.name}</td>
                <td>${p.impact}</td>
                <td>$${p.price.toFixed(2)}</td>
                <td>${p.rating} ★</td>
            </tr>
        `;
    });
}

document.getElementById("compare-btn").addEventListener("click", () => {
    const checked = Array.from(document.querySelectorAll("#product-options input:checked"));
    const selected = checked.map(c => products[c.dataset.idx]);

    renderComparisonTable(selected);
    document.getElementById("comparison-table-section").classList.remove("hidden");
});

document.getElementById("reset-btn").addEventListener("click", () => {
    document.getElementById("comparison-table-section").classList.add("hidden");
    document.querySelectorAll("#product-options input").forEach(c => c.checked = false);
});

document.getElementById("add-product-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const newProduct = {
        name: document.getElementById("add-name").value,
        category: document.getElementById("add-category").value,
        impact: parseInt(document.getElementById("add-impact").value),
        price: parseFloat(document.getElementById("add-price").value),
        rating: parseFloat(document.getElementById("add-rating").value),
        features: document.getElementById("add-features").value.split(",").map(f => f.trim())
    };

    products.push(newProduct);
    renderProductOptions();
    this.reset();
});

renderProductOptions();
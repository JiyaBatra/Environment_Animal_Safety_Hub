const tips = [
    { category: "energy", tip: "Switch to LED light bulbs to reduce electricity consumption." },
    { category: "energy", tip: "Unplug devices when not in use to avoid phantom energy drain." },
    { category: "energy", tip: "Install solar panels to generate clean energy at home." },
    { category: "waste", tip: "Compost food scraps to reduce landfill waste." },
    { category: "waste", tip: "Use reusable shopping bags instead of plastic." },
    { category: "water", tip: "Fix leaky faucets and pipes to save water." },
    { category: "water", tip: "Take shorter showers to conserve water." },
    { category: "shopping", tip: "Support local and sustainable brands." },
    { category: "shopping", tip: "Avoid fast fashion; buy quality clothes." }
];

function renderTips(list) {
    const container = document.getElementById("tips-list");
    container.innerHTML = "";

    if (list.length === 0) {
        container.innerHTML = "<li>No tips found.</li>";
        return;
    }

    list.forEach(t => {
        const li = document.createElement("li");
        li.className = "tip-card";
        li.innerHTML = `
            <span class="tip-icon">🌱</span>
            <span class="tip-text">${t.tip}</span>
            <span class="tip-category">${t.category.toUpperCase()}</span>
        `;
        container.appendChild(li);
    });
}

function filterTips() {
    const search = document.getElementById("tips-search").value.toLowerCase();
    const category = document.getElementById("tips-category").value;

    const filtered = tips.filter(t =>
        (category === "all" || t.category === category) &&
        t.tip.toLowerCase().includes(search)
    );

    renderTips(filtered);
}

document.getElementById("tips-search").addEventListener("input", filterTips);
document.getElementById("tips-category").addEventListener("change", filterTips);

renderTips(tips);
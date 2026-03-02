document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("impact-form");
    const resultsSection = document.getElementById("results");
    const tipsContainer = document.getElementById("tips");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const carKm = parseFloat(document.getElementById("car-km").value) || 0;
        const publicKm = parseFloat(document.getElementById("public-km").value) || 0;
        const electricityKwh = parseFloat(document.getElementById("electricity-kwh").value) || 0;
        const waterLiters = parseFloat(document.getElementById("water-liters").value) || 0;
        const wasteKg = parseFloat(document.getElementById("waste-kg").value) || 0;
        const meatMeals = parseFloat(document.getElementById("meat-meals").value) || 0;

        const carCO2 = carKm * 0.21;
        const publicCO2 = publicKm * 0.09;
        const electricityCO2 = electricityKwh * 0.475;
        const meatCO2 = meatMeals * 2.5;

        const totalCO2 = carCO2 + publicCO2 + electricityCO2 + meatCO2;

        document.getElementById("carbon-result").textContent =
            `Carbon Footprint: ${totalCO2.toFixed(2)} kg CO₂/day`;

        document.getElementById("water-result").textContent =
            `Water Usage: ${waterLiters.toFixed(0)} liters/day`;

        document.getElementById("waste-result").textContent =
            `Waste Generation: ${wasteKg.toFixed(2)} kg/day`;

        let tips = [];

        if (carKm > 20)
            tips.push("Try carpooling or using public transport.");

        if (electricityKwh > 10)
            tips.push("Switch to energy-efficient appliances.");

        if (waterLiters > 150)
            tips.push("Reduce shower time and fix leaks.");

        if (wasteKg > 2)
            tips.push("Compost organic waste and recycle more.");

        if (meatMeals > 1)
            tips.push("Consider more plant-based meals.");

        if (tips.length === 0)
            tips.push("Great job! Your impact is below average.");

        tipsContainer.innerHTML =
            "<h3>Tips for Improvement</h3><ul>" +
            tips.map(t => `<li>${t}</li>`).join("") +
            "</ul>";

        resultsSection.classList.remove("hidden");
    });

    // Sample Presets
    const samplePresets = [
        {
            name: "Urban Commuter",
            data: { carKm: 10, publicKm: 15, electricityKwh: 8, waterLiters: 120, wasteKg: 1.5, meatMeals: 1 }
        },
        {
            name: "Eco-Conscious Household",
            data: { carKm: 2, publicKm: 5, electricityKwh: 6, waterLiters: 90, wasteKg: 0.8, meatMeals: 0 }
        },
        {
            name: "High Consumption Family",
            data: { carKm: 40, publicKm: 0, electricityKwh: 18, waterLiters: 220, wasteKg: 3.5, meatMeals: 3 }
        },
    ];

    const presetContainer = document.createElement("div");
    presetContainer.id = "preset-container";
    presetContainer.innerHTML = "<h3>Sample Data Presets</h3>";

    samplePresets.forEach(preset => {
        const btn = document.createElement("button");
        btn.textContent = preset.name;
        btn.className = "preset-btn";

        btn.addEventListener("click", () => {
            document.getElementById("car-km").value = preset.data.carKm;
            document.getElementById("public-km").value = preset.data.publicKm;
            document.getElementById("electricity-kwh").value = preset.data.electricityKwh;
            document.getElementById("water-liters").value = preset.data.waterLiters;
            document.getElementById("waste-kg").value = preset.data.wasteKg;
            document.getElementById("meat-meals").value = preset.data.meatMeals;
        });

        presetContainer.appendChild(btn);
    });

    document.querySelector(".calculator-card").prepend(presetContainer);

});
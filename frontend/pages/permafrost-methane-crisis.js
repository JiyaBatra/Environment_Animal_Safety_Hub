/* ==========================================
   Permafrost Thaw & Methane Time Bomb Crisis
   Interactive features JavaScript
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNavToggle();
    initHeroCounters();
    initHeroParticles();
    initPermafrostMap();
    initMethaneSimulator();
    initInfraBarAnimation();
});

/* ==========================================
   Navigation Toggle (Mobile)
   ========================================== */
function initNavToggle() {
    const toggle = document.getElementById('navToggle');
    const links = document.querySelector('.nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
        links.classList.toggle('active');
        const icon = toggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Close menu on link click
    links.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            links.classList.remove('active');
            const icon = toggle.querySelector('i');
            icon.className = 'fas fa-bars';
        });
    });
}

/* ==========================================
   Hero Stat Counters
   ========================================== */
function initHeroCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    if (!counters.length) return;

    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const update = () => {
            current += step;
            if (current < target) {
                el.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(update);
            } else {
                el.textContent = target.toLocaleString();
            }
        };
        update();
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

/* ==========================================
   Hero Particle Effect
   ========================================== */
function initHeroParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    for (let i = 0; i < 40; i++) {
        const p = document.createElement('div');
        p.className = 'hero-particle';
        const size = Math.random() * 3 + 1;
        const left = Math.random() * 100;
        const delay = Math.random() * 15;
        const duration = Math.random() * 12 + 8;
        const hue = Math.random() > 0.5 ? '20, 100%, 56%' : '187, 96%, 43%';
        p.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            bottom: -10px;
            background: hsla(${hue}, ${Math.random() * 0.4 + 0.2});
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
        `;
        container.appendChild(p);
    }
}

/* ==========================================
   Interactive Permafrost Retreat Map
   Canvas-based visualizer (2025–2075)
   ========================================== */
function initPermafrostMap() {
    const canvas = document.getElementById('permafrostMap');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const scenarioSelect = document.getElementById('scenarioSelect');
    const yearSlider = document.getElementById('yearSlider');
    const yearDisplay = document.getElementById('yearDisplay');
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const infoPanel = document.getElementById('mapInfoPanel');

    let animationId = null;
    let isPlaying = false;

    // Region data
    const regions = [
        { name: 'Western Siberia', x: 0.62, y: 0.22, baseThaw: 0.15, sensitivity: 1.2 },
        { name: 'Eastern Siberia', x: 0.75, y: 0.18, baseThaw: 0.10, sensitivity: 0.9 },
        { name: 'Central Alaska', x: 0.15, y: 0.28, baseThaw: 0.12, sensitivity: 1.0 },
        { name: 'Northern Canada', x: 0.30, y: 0.20, baseThaw: 0.08, sensitivity: 0.85 },
        { name: 'Yamal Peninsula', x: 0.55, y: 0.15, baseThaw: 0.18, sensitivity: 1.3 },
        { name: 'Laptev Sea Coast', x: 0.72, y: 0.12, baseThaw: 0.14, sensitivity: 1.1 },
        { name: 'Mackenzie Delta', x: 0.22, y: 0.22, baseThaw: 0.11, sensitivity: 0.95 },
        { name: 'Scandinavian Arctic', x: 0.48, y: 0.25, baseThaw: 0.09, sensitivity: 0.8 },
    ];

    const scenarioMultipliers = {
        low: 0.6,
        moderate: 1.0,
        high: 1.8
    };

    function getThawFraction(region, year, scenario) {
        const yearFactor = (year - 2025) / 50;
        const multiplier = scenarioMultipliers[scenario] || 1.0;
        return Math.min(1, region.baseThaw + yearFactor * region.sensitivity * multiplier * 0.6);
    }

    function drawMap(year, scenario) {
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        // Background — ocean
        ctx.fillStyle = '#0b1628';
        ctx.fillRect(0, 0, w, h);

        // Draw land masses (simplified arctic view)
        drawLandMasses(ctx, w, h);

        // Draw permafrost zones for each region
        regions.forEach(region => {
            const thaw = getThawFraction(region, year, scenario);
            const rx = region.x * w;
            const ry = region.y * h;
            const baseRadius = 35;

            // Continuous permafrost (shrinks)
            const continuousRadius = baseRadius * (1 - thaw * 0.7);
            if (continuousRadius > 5) {
                ctx.beginPath();
                ctx.arc(rx, ry, continuousRadius, 0, Math.PI * 2);
                ctx.fillStyle = '#1a3a5c';
                ctx.fill();
            }

            // Discontinuous ring
            const disRadius = baseRadius * (1 - thaw * 0.3);
            ctx.beginPath();
            ctx.arc(rx, ry, disRadius, 0, Math.PI * 2);
            ctx.strokeStyle = '#3a7ca5';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Sporadic ring
            ctx.beginPath();
            ctx.arc(rx, ry, baseRadius + 5, 0, Math.PI * 2);
            ctx.strokeStyle = '#81c3d7';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);
            ctx.stroke();
            ctx.setLineDash([]);

            // Thawed area (grows with thaw)
            const thawRadius = baseRadius * thaw * 0.8;
            if (thawRadius > 3) {
                ctx.beginPath();
                ctx.arc(rx, ry, thawRadius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212, 165, 116, ${0.3 + thaw * 0.4})`;
                ctx.fill();
            }

            // Methane hotspot indicator
            if (thaw > 0.3) {
                const hotspotAlpha = (thaw - 0.3) * 1.4;
                ctx.beginPath();
                ctx.arc(rx, ry, 8 + thaw * 12, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 107, 53, ${Math.min(hotspotAlpha, 0.6)})`;
                ctx.fill();

                // Pulsing ring
                const pulseSize = 15 + Math.sin(Date.now() / 500) * 5;
                ctx.beginPath();
                ctx.arc(rx, ry, pulseSize + thaw * 10, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255, 107, 53, ${Math.min(hotspotAlpha * 0.5, 0.4)})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }

            // Region label
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.font = '10px system-ui';
            ctx.textAlign = 'center';
            ctx.fillText(region.name, rx, ry + baseRadius + 16);
        });

        // Year overlay
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 16px system-ui';
        ctx.textAlign = 'left';
        ctx.fillText(`Year: ${year}`, 15, 25);
        ctx.font = '12px system-ui';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        const scenarioLabel = scenario.charAt(0).toUpperCase() + scenario.slice(1) + ' Warming';
        ctx.fillText(scenarioLabel, 15, 42);
    }

    function drawLandMasses(ctx, w, h) {
        // Simplified land shapes  
        ctx.fillStyle = '#1a2e1a';
        
        // North America
        ctx.beginPath();
        ctx.moveTo(w * 0.05, h * 0.1);
        ctx.lineTo(w * 0.35, h * 0.08);
        ctx.lineTo(w * 0.38, h * 0.45);
        ctx.lineTo(w * 0.25, h * 0.55);
        ctx.lineTo(w * 0.05, h * 0.4);
        ctx.closePath();
        ctx.fill();

        // Greenland
        ctx.beginPath();
        ctx.ellipse(w * 0.40, h * 0.15, w * 0.04, h * 0.12, 0, 0, Math.PI * 2);
        ctx.fill();

        // Scandinavia
        ctx.beginPath();
        ctx.moveTo(w * 0.44, h * 0.15);
        ctx.lineTo(w * 0.50, h * 0.08);
        ctx.lineTo(w * 0.52, h * 0.40);
        ctx.lineTo(w * 0.46, h * 0.42);
        ctx.closePath();
        ctx.fill();

        // Russia / Siberia
        ctx.beginPath();
        ctx.moveTo(w * 0.50, h * 0.06);
        ctx.lineTo(w * 0.95, h * 0.05);
        ctx.lineTo(w * 0.92, h * 0.50);
        ctx.lineTo(w * 0.55, h * 0.48);
        ctx.closePath();
        ctx.fill();

        // Add subtle grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < w; i += 40) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, h);
            ctx.stroke();
        }
        for (let j = 0; j < h; j += 40) {
            ctx.beginPath();
            ctx.moveTo(0, j);
            ctx.lineTo(w, j);
            ctx.stroke();
        }
    }

    function updateMap() {
        const year = parseInt(yearSlider.value);
        const scenario = scenarioSelect.value;
        yearDisplay.textContent = year;
        drawMap(year, scenario);
    }

    // Mouse hover info
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mx = (e.clientX - rect.left) / rect.width;
        const my = (e.clientY - rect.top) / rect.height;
        
        let closest = null;
        let minDist = Infinity;
        
        regions.forEach(r => {
            const dist = Math.hypot(mx - r.x, my - r.y);
            if (dist < 0.08 && dist < minDist) {
                minDist = dist;
                closest = r;
            }
        });

        if (closest && infoPanel) {
            const scenario = scenarioSelect.value;
            const year = parseInt(yearSlider.value);
            const thaw = getThawFraction(closest, year, scenario);
            const thawPct = (thaw * 100).toFixed(1);
            const methaneRisk = thaw > 0.5 ? 'Critical' : thaw > 0.3 ? 'High' : thaw > 0.15 ? 'Moderate' : 'Low';
            const riskColor = thaw > 0.5 ? '#ef4444' : thaw > 0.3 ? '#f59e0b' : thaw > 0.15 ? '#06b6d4' : '#10b981';
            
            infoPanel.innerHTML = `
                <h4><i class="fas fa-map-marker-alt" style="color:${riskColor}"></i> ${closest.name}</h4>
                <p><strong>Thaw Progress:</strong> ${thawPct}% — <strong>Methane Risk:</strong> <span style="color:${riskColor};font-weight:700">${methaneRisk}</span></p>
                <p><strong>Sensitivity Factor:</strong> ${closest.sensitivity}× — <strong>Year:</strong> ${year}</p>
            `;
        }
    });

    // Play/Pause animation
    function startAnimation() {
        isPlaying = true;
        playBtn.disabled = true;
        pauseBtn.disabled = false;

        const animate = () => {
            if (!isPlaying) return;
            let year = parseInt(yearSlider.value);
            if (year < 2075) {
                year += 5;
                yearSlider.value = year;
                updateMap();
                animationId = setTimeout(() => requestAnimationFrame(animate), 800);
            } else {
                stopAnimation();
            }
        };
        animate();
    }

    function stopAnimation() {
        isPlaying = false;
        playBtn.disabled = false;
        pauseBtn.disabled = true;
        if (animationId) clearTimeout(animationId);
    }

    function resetMap() {
        stopAnimation();
        yearSlider.value = 2025;
        updateMap();
    }

    playBtn.addEventListener('click', startAnimation);
    pauseBtn.addEventListener('click', stopAnimation);
    resetBtn.addEventListener('click', resetMap);
    yearSlider.addEventListener('input', updateMap);
    scenarioSelect.addEventListener('change', updateMap);

    // Initial draw
    updateMap();
}

/* ==========================================
   Methane vs CO₂ Warming Simulator
   Chart.js-powered interactive module
   ========================================== */
function initMethaneSimulator() {
    const warmingCanvas = document.getElementById('warmingChart');
    const forcingCanvas = document.getElementById('forcingChart');
    if (!warmingCanvas || !forcingCanvas) return;

    const methaneSlider = document.getElementById('methaneRate');
    const co2Slider = document.getElementById('co2Emissions');
    const timeSlider = document.getElementById('timeframe');
    const methaneVal = document.getElementById('methaneRateValue');
    const co2Val = document.getElementById('co2EmissionsValue');
    const timeVal = document.getElementById('timeframeValue');
    const simulateBtn = document.getElementById('simulateBtn');

    // Chart.js default dark theme
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';

    // Warming chart
    const warmingChart = new Chart(warmingCanvas, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Methane Warming (°C)',
                    data: [],
                    borderColor: '#ff6b35',
                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 3,
                    pointHoverRadius: 6,
                },
                {
                    label: 'CO₂ Warming (°C)',
                    data: [],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 3,
                    pointHoverRadius: 6,
                },
                {
                    label: 'Combined (°C)',
                    data: [],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.05)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2.5,
                    borderDash: [6, 3],
                    pointRadius: 3,
                    pointHoverRadius: 6,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'top', labels: { usePointStyle: true, padding: 15 } },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    titleColor: '#fff',
                    bodyColor: '#94a3b8',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1,
                }
            },
            scales: {
                x: { title: { display: true, text: 'Year', color: '#94a3b8' }, grid: { display: false } },
                y: { title: { display: true, text: 'Temperature Change (°C)', color: '#94a3b8' }, beginAtZero: true }
            }
        }
    });

    // Forcing chart
    const forcingChart = new Chart(forcingCanvas, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Methane Forcing (W/m²)',
                    data: [],
                    backgroundColor: 'rgba(255, 107, 53, 0.7)',
                    borderColor: '#ff6b35',
                    borderWidth: 1,
                    borderRadius: 4,
                },
                {
                    label: 'CO₂ Forcing (W/m²)',
                    data: [],
                    backgroundColor: 'rgba(59, 130, 246, 0.7)',
                    borderColor: '#3b82f6',
                    borderWidth: 1,
                    borderRadius: 4,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'top', labels: { usePointStyle: true, padding: 15 } },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    titleColor: '#fff',
                    bodyColor: '#94a3b8',
                }
            },
            scales: {
                x: { title: { display: true, text: 'Year', color: '#94a3b8' }, grid: { display: false } },
                y: { title: { display: true, text: 'Radiative Forcing (W/m²)', color: '#94a3b8' }, beginAtZero: true }
            }
        }
    });

    // Update slider display values
    methaneSlider.addEventListener('input', () => { methaneVal.textContent = methaneSlider.value + ' Tg/yr'; });
    co2Slider.addEventListener('input', () => { co2Val.textContent = co2Slider.value + ' Gt/yr'; });
    timeSlider.addEventListener('input', () => { timeVal.textContent = timeSlider.value + ' years'; });

    function runSimulation() {
        const methaneRate = parseFloat(methaneSlider.value);
        const co2Rate = parseFloat(co2Slider.value);
        const timeframe = parseInt(timeSlider.value);

        const years = [];
        const methaneWarming = [];
        const co2Warming = [];
        const combined = [];
        const methaneForcing = [];
        const co2Forcing = [];

        for (let y = 0; y <= timeframe; y += 5) {
            const year = 2025 + y;
            years.push(year);

            // Simplified warming model
            // Methane: high initial potency, decays (~12yr half-life in atmosphere)
            const methaneAccum = methaneRate * (1 - Math.exp(-y / 12)) * 12;
            const ch4Warm = methaneAccum * 0.00036; // simplified sensitivity
            
            // CO₂: slow accumulation, long persistence
            const co2Accum = co2Rate * y * 0.45; // airborne fraction ~45%
            const co2Warm = co2Accum * 0.0054 * Math.log(1 + co2Accum / 280) / Math.log(2);

            methaneWarming.push(parseFloat(ch4Warm.toFixed(3)));
            co2Warming.push(parseFloat(co2Warm.toFixed(3)));
            combined.push(parseFloat((ch4Warm + co2Warm).toFixed(3)));

            // Radiative forcing approximations
            const ch4Force = ch4Warm * 3.7 / 1.1;
            const co2Force = co2Warm * 3.7 / 1.1;
            methaneForcing.push(parseFloat(ch4Force.toFixed(3)));
            co2Forcing.push(parseFloat(co2Force.toFixed(3)));
        }

        // Update warming chart
        warmingChart.data.labels = years;
        warmingChart.data.datasets[0].data = methaneWarming;
        warmingChart.data.datasets[1].data = co2Warming;
        warmingChart.data.datasets[2].data = combined;
        warmingChart.update();

        // Update forcing chart
        forcingChart.data.labels = years;
        forcingChart.data.datasets[0].data = methaneForcing;
        forcingChart.data.datasets[1].data = co2Forcing;
        forcingChart.update();

        // Update insights
        updateInsights(methaneRate, co2Rate, timeframe, combined[combined.length - 1]);
    }

    function updateInsights(methaneRate, co2Rate, timeframe, totalWarming) {
        const insightsEl = document.getElementById('simulatorInsights');
        if (!insightsEl) return;

        let severity = 'moderate';
        if (totalWarming > 2.0) severity = 'extreme';
        else if (totalWarming > 1.0) severity = 'severe';
        else if (totalWarming > 0.5) severity = 'significant';

        const warningMessages = {
            extreme: `At ${methaneRate} Tg/yr methane + ${co2Rate} Gt/yr CO₂, projected additional warming of <strong>${totalWarming.toFixed(2)}°C</strong> in ${timeframe} years. This crosses multiple tipping points.`,
            severe: `Projected additional warming of <strong>${totalWarming.toFixed(2)}°C</strong> over ${timeframe} years. Significant permafrost loss and methane feedback amplification expected.`,
            significant: `Projected warming of <strong>${totalWarming.toFixed(2)}°C</strong>. Widespread permafrost degradation likely, requiring urgent mitigation.`,
            moderate: `Projected warming of <strong>${totalWarming.toFixed(2)}°C</strong>. Continued permafrost loss, but within potentially manageable bounds with rapid action.`
        };

        insightsEl.innerHTML = `
            <div class="insight-card warning">
                <i class="fas fa-exclamation-triangle"></i>
                <div>
                    <h4>Simulation Result</h4>
                    <p>${warningMessages[severity]}</p>
                </div>
            </div>
            <div class="insight-card info">
                <i class="fas fa-lightbulb"></i>
                <div>
                    <h4>Key Insight</h4>
                    <p>Methane is <strong>80× more potent</strong> than CO₂ over 20 years. Even small reductions in methane release buy critical time for long-term CO₂ solutions.</p>
                </div>
            </div>
        `;
    }

    simulateBtn.addEventListener('click', runSimulation);

    // Run initial simulation
    runSimulation();
}

/* ==========================================
   Infrastructure Bar Animation
   ========================================== */
function initInfraBarAnimation() {
    const bars = document.querySelectorAll('.infra-fill');
    if (!bars.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const width = fill.style.width;
                fill.style.width = '0%';
                setTimeout(() => { fill.style.width = width; }, 100);
                observer.unobserve(fill);
            }
        });
    }, { threshold: 0.3 });

    bars.forEach(bar => observer.observe(bar));
}

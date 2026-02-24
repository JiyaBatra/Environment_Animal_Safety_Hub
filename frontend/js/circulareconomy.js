        // Phase Information
        function showPhaseInfo(phase) {
            const infoDiv = document.getElementById('phase-info');
            const phaseData = {
                design: {
                    title: "Design Phase",
                    description: "Products are designed for durability, repairability, and recyclability from the start. Using modular components, non-toxic materials, and standardized parts.",
                    examples: "Modular smartphones, furniture with replaceable parts, biodegradable packaging"
                },
                manufacture: {
                    title: "Manufacture Phase",
                    description: "Using renewable energy, recycled materials, and waste-minimizing processes. Implementing industrial symbiosis where one factory's waste becomes another's raw material.",
                    examples: "Factories powered by solar/wind, using recycled steel/aluminum, water recycling systems"
                },
                distribute: {
                    title: "Distribute Phase",
                    description: "Efficient logistics, reusable packaging, and local production to minimize transportation emissions. Product-as-a-service models instead of ownership.",
                    examples: "Reusable shipping containers, electric delivery vehicles, local manufacturing hubs"
                },
                use: {
                    title: "Use Phase",
                    description: "Products designed for long life, easy maintenance, and upgradability. Sharing platforms enable multiple users to maximize utilization.",
                    examples: "Tool libraries, car sharing, clothing rental, repair cafes"
                },
                collect: {
                    title: "Collect Phase",
                    description: "Systems to efficiently gather used products for repair, refurbishment, or recycling. Reverse logistics and convenient drop-off points.",
                    examples: "Manufacturer take-back programs, municipal recycling, deposit return schemes"
                },
                recycle: {
                    title: "Recycle Phase",
                    description: "Advanced recycling technologies to recover high-quality materials for manufacturing new products. Chemical recycling for plastics, urban mining for electronics.",
                    examples: "Battery material recovery, textile-to-textile recycling, plastic depolymerization"
                },
                repair: {
                    title: "Repair Phase",
                    description: "Extending product life through maintenance, repair, and refurbishment. Right-to-repair legislation and repair manuals availability.",
                    examples: "Repair cafes, manufacturer repair services, third-party repair businesses"
                },
                renew: {
                    title: "Renew Phase",
                    description: "Returning biological materials to nature through composting or anaerobic digestion. Creating nutrient cycles instead of waste streams.",
                    examples: "Food waste composting, biodegradable packaging, agricultural nutrient recovery"
                }
            };
            
            infoDiv.style.display = 'block';
            infoDiv.innerHTML = `
                <h3 style="color: var(--primary); margin-bottom: 15px;">${phaseData[phase].title}</h3>
                <p style="margin-bottom: 20px;">${phaseData[phase].description}</p>
                <div style="background: white; padding: 15px; border-radius: 10px; border-left: 4px solid var(--primary);">
                    <strong>Examples:</strong> ${phaseData[phase].examples}
                </div>
            `;
            
            // Animate the clicked phase
            const clickedPhase = event.currentTarget;
            clickedPhase.style.transform = 'scale(1.3)';
            setTimeout(() => {
                clickedPhase.style.transform = '';
            }, 300);
        }
        
        // Update slider values
        document.getElementById('plastic-waste').addEventListener('input', updateCalculator);
        document.getElementById('electronic-waste').addEventListener('input', updateCalculator);
        document.getElementById('food-waste').addEventListener('input', updateCalculator);
        
        function updateCalculator() {
            const plastic = parseInt(document.getElementById('plastic-waste').value);
            const eWaste = parseInt(document.getElementById('electronic-waste').value);
            const food = parseInt(document.getElementById('food-waste').value);
            
            // Update display values
            document.getElementById('plastic-value').textContent = plastic + ' kg';
            document.getElementById('e-waste-value').textContent = eWaste + ' kg';
            document.getElementById('food-value').textContent = food + ' kg';
            
            // Calculate values
            const plasticValue = plastic * 12 * 0.5; // $0.5/kg monthly
            const eWasteValue = eWaste * 15; // $15/kg annual
            const foodValue = food * 52 * 0.1; // $0.1/kg weekly
            const totalValue = Math.round(plasticValue + eWasteValue + foodValue);
            
            // Update results
            document.getElementById('total-value').textContent = '$' + totalValue;
            document.getElementById('plastic-recovery').textContent = (plastic * 12) + ' kg recycled';
            document.getElementById('e-recovery').textContent = (eWaste * 0.24).toFixed(1) + 'g gold';
            document.getElementById('compost-recovery').textContent = (food * 52) + ' kg compost';
        }
        
        // Initialize calculator
        updateCalculator();
        
        // Business Models Tabs
        function showModel(model) {
            // Update active tab
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            event.currentTarget.classList.add('active');
            
            const modelData = {
                'product-service': {
                    title: "Product-as-Service",
                    description: "Companies retain ownership of products while customers pay for access or performance. This incentivizes durability, repairability, and recycling.",
                    examples: [
                        "📦 Philips 'Light as a Service'",
                        "🚗 Car leasing/rental services",
                        "👔 Clothing rental subscriptions"
                    ],
                    benefits: [
                        "✅ Reduced material consumption",
                        "✅ Higher quality products",
                        "✅ Predictable costs for users"
                    ]
                },
                'sharing': {
                    title: "Sharing Platforms",
                    description: "Platforms that enable sharing, renting, or swapping of underutilized assets. Maximizes use of existing products and reduces need for new production.",
                    examples: [
                        "🏠 Airbnb property sharing",
                        "🔧 Peer-to-peer tool libraries",
                        "👗 Fashion swapping platforms"
                    ],
                    benefits: [
                        "✅ Lower individual ownership costs",
                        "✅ Reduced environmental footprint",
                        "✅ Community building"
                    ]
                },
                'resource-recovery': {
                    title: "Resource Recovery",
                    description: "Businesses that collect waste materials and transform them into valuable resources. Creating supply chains from waste streams.",
                    examples: [
                        "♻️ Plastic waste to construction materials",
                        "⚡ Organic waste to biogas energy",
                        "💧 Wastewater to fertilizer"
                    ],
                    benefits: [
                        "✅ Waste reduction",
                        "✅ New revenue streams",
                        "✅ Reduced virgin material use"
                    ]
                },
                'product-life': {
                    title: "Product Life Extension",
                    description: "Businesses focused on repair, refurbishment, remanufacturing, and resale. Extending product lifespan through maintenance and upgrades.",
                    examples: [
                        "🔧 Electronics repair services",
                        "🛋️ Furniture restoration",
                        "📱 Certified refurbished products"
                    ],
                    benefits: [
                        "✅ Reduced waste generation",
                        "✅ Affordable quality products",
                        "✅ Skilled job creation"
                    ]
                }
            };
            
            const content = document.getElementById('model-content');
            const data = modelData[model];
            
            content.innerHTML = `
                <h3 style="margin-bottom: 20px; color: var(--primary);">${data.title}</h3>
                <p>${data.description}</p>
                
                <div style="margin-top: 25px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                    <div style="background: #F8F9FA; padding: 20px; border-radius: 10px;">
                        <h4 style="color: var(--secondary); margin-bottom: 10px;">Examples</h4>
                        <ul style="list-style: none; padding-left: 0;">
                            ${data.examples.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    <div style="background: #F8F9FA; padding: 20px; border-radius: 10px;">
                        <h4 style="color: var(--secondary); margin-bottom: 10px;">Benefits</h4>
                        <ul style="list-style: none; padding-left: 0;">
                            ${data.benefits.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
        }
        
        // Initialize first model
        showModel('product-service');

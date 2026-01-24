AOS.init();

// Theme Toggle Functionality - SIMPLIFIED VERSION
const themeToggle = document.getElementById('themeToggle');
const themeStatus = document.getElementById('themeStatus');

// Check for saved theme preference
if (localStorage.getItem('darkMode') === 'enabled') {
    enableDarkMode();
}

function enableDarkMode() {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i><span>Light Mode</span>';
    themeStatus.textContent = 'On';
    localStorage.setItem('darkMode', 'enabled');
}

function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i><span>Dark Mode</span>';
    themeStatus.textContent = 'Off';
    localStorage.setItem('darkMode', 'disabled');
}

themeToggle.addEventListener('click', () => {
    if (document.body.classList.contains('dark-mode')) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }

    
    // Add click animation
    themeToggle.style.transform = 'scale(0.95)';
    setTimeout(() => {
        themeToggle.style.transform = '';
    }, 150);
});

// Original First Aid Grid Code
const firstAidData = {
    bird: [
        { icon: '🪶', title: 'Wing Injury', desc: 'Keep the bird calm, gently immobilize the wing, and consult a vet.' },
        { icon: '🍃', title: 'Hypothermia', desc: 'Provide warmth using a soft cloth or heating pad at low temperature.' },
        { icon: '💧', title: 'Dehydration', desc: 'Offer water using a shallow dish or syringe carefully.' },
        { icon: '🌡️', title: 'Shock', desc: 'Keep in a quiet, dark place and minimize handling.' },
        { icon: '🍽️', title: 'Malnutrition', desc: 'Provide species-appropriate food and consult a wildlife rehabilitator.' }
    ],
    mammal: [
        { icon: '🐾', title: 'Fractures', desc: 'Immobilize the injured limb and keep the animal calm until professional help arrives.' },
        { icon: '🩹', title: 'Cuts & Wounds', desc: 'Clean gently, apply antiseptic, and monitor for infection.' },
        { icon: '💊', title: 'Poisoning', desc: 'Do not induce vomiting. Contact a wildlife vet immediately.' },
        { icon: '🤢', title: 'Digestive Issues', desc: 'Withhold food for 12-24 hours, provide water, and monitor.' },
        { icon: '👁️', title: 'Eye Problems', desc: 'Flush with saline solution and avoid direct sunlight.' }
    ],
    reptile: [
        { icon: '🦎', title: 'Burns', desc: 'Cool the burn with lukewarm water and avoid applying creams meant for humans.' },
        { icon: '🌡️', title: 'Temperature Shock', desc: 'Move to a suitable temperature environment and hydrate carefully.' },
        { icon: '🩺', title: 'Infections', desc: 'Clean wounds gently and monitor. Seek vet assistance.' },
        { icon: '💧', title: 'Dehydration', desc: 'Provide shallow water bowl and mist habitat regularly.' },
        { icon: '🥚', title: 'Egg Binding', desc: 'Provide warm bath and consult a reptile specialist immediately.' }
    ],
    amphibian: [
        { icon: '🐸', title: 'Skin Damage', desc: 'Keep skin moist and avoid handling unnecessarily.' },
        { icon: '💧', title: 'Dehydration', desc: 'Provide shallow water and mist environment to maintain humidity.' },
        { icon: '🍂', title: 'Contamination', desc: 'Remove from polluted areas and clean habitat gently.' },
        { icon: '🌡️', title: 'Temperature Stress', desc: 'Maintain optimal temperature range for the specific species.' },
        { icon: '🦠', title: 'Fungal Infections', desc: 'Isolate and provide clean, filtered water. Consult a vet.' }
        {icon:'🪶', title:'Wing Injury', desc:'Keep the bird calm, gently immobilize the wing, and consult a vet.'},
        {icon:'🍃', title:'Hypothermia', desc:'Provide warmth using a soft cloth or heating pad at low temperature.'},
        {icon:'💧', title:'Dehydration', desc:'Offer water using a shallow dish or syringe carefully.'},
        {icon:'🌡️', title:'Shock', desc:'Keep in a quiet, dark place and minimize handling.'},
        {icon:'🍽️', title:'Malnutrition', desc:'Provide species-appropriate food and consult a wildlife rehabilitator.'}
    ],
    mammal: [
        {icon:'🐾', title:'Fractures', desc:'Immobilize the injured limb and keep the animal calm until professional help arrives.'},
        {icon:'🩹', title:'Cuts & Wounds', desc:'Clean gently, apply antiseptic, and monitor for infection.'},
        {icon:'💊', title:'Poisoning', desc:'Do not induce vomiting. Contact a wildlife vet immediately.'},
        {icon:'🤢', title:'Digestive Issues', desc:'Withhold food for 12-24 hours, provide water, and monitor.'},
        {icon:'👁️', title:'Eye Problems', desc:'Flush with saline solution and avoid direct sunlight.'}
    ],
    reptile: [
        {icon:'🦎', title:'Burns', desc:'Cool the burn with lukewarm water and avoid applying creams meant for humans.'},
        {icon:'🌡️', title:'Temperature Shock', desc:'Move to a suitable temperature environment and hydrate carefully.'},
        {icon:'🩺', title:'Infections', desc:'Clean wounds gently and monitor. Seek vet assistance.'},
        {icon:'💧', title:'Dehydration', desc:'Provide shallow water bowl and mist habitat regularly.'},
        {icon:'🥚', title:'Egg Binding', desc:'Provide warm bath and consult a reptile specialist immediately.'}
    ],
    amphibian: [
        {icon:'🐸', title:'Skin Damage', desc:'Keep skin moist and avoid handling unnecessarily.'},
        {icon:'💧', title:'Dehydration', desc:'Provide shallow water and mist environment to maintain humidity.'},
        {icon:'🍂', title:'Contamination', desc:'Remove from polluted areas and clean habitat gently.'},
        {icon:'🌡️', title:'Temperature Stress', desc:'Maintain optimal temperature range for the specific species.'},
        {icon:'🦠', title:'Fungal Infections', desc:'Isolate and provide clean, filtered water. Consult a vet.'}
    ]
};

const firstAidGrid = document.getElementById('firstAidGrid');
const buttons = document.querySelectorAll('.animal-type-btn');

function populateFirstAid(type) {
    firstAidGrid.innerHTML = '';
    firstAidData[type].forEach(aid => {
        const card = document.createElement('div');
        card.className = 'aid-card';
        card.setAttribute('data-aos', 'fade-up');
        card.innerHTML = `
function populateFirstAid(type){
    firstAidGrid.innerHTML='';
    firstAidData[type].forEach(aid=>{
        const card = document.createElement('div');
        card.className='aid-card';
        card.setAttribute('data-aos','fade-up');
        card.innerHTML=`
            <div class="aid-icon">${aid.icon}</div>
            <h4>${aid.title}</h4>
            <p>${aid.desc}</p>
        `;
        firstAidGrid.appendChild(card);
    });

    
    // Animate cards sequentially
    const cards = firstAidGrid.querySelectorAll('.aid-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        populateFirstAid(btn.dataset.type);

buttons.forEach(btn=>{
    btn.addEventListener('click',()=>{
        buttons.forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        populateFirstAid(btn.dataset.type);
        
        // Add click animation
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 150);
    });
});

// Initialize with birds
populateFirstAid('bird');

// NEW: Symptom Assessment Functions
const symptomData = {
    breathing: { level: 'critical', steps: ['Keep airway clear', 'Do not tilt head', 'Check for obstructions'] },
    bleeding: { level: 'critical', steps: ['Apply direct pressure with clean cloth', 'Elevate wound if possible', 'Do not remove soaked cloth'] },
    unconscious: { level: 'critical', steps: ['Check breathing', 'Place in recovery position', 'Keep warm'] },
    broken: { level: 'urgent', steps: ['Immobilize limb', 'Do not attempt to realign', 'Support with padding'] },
    seizure: { level: 'critical', steps: ['Clear surrounding area', 'Time the seizure', 'Do not restrain'] },
    burn: { level: 'urgent', steps: ['Cool with lukewarm water', 'Do not apply ice', 'Cover with sterile dressing'] },
    vomit: { level: 'monitor', steps: ['Withhold food 12-24 hours', 'Offer small amounts of water', 'Monitor for dehydration'] },
    poison: { level: 'critical', steps: ['Identify poison if possible', 'Do not induce vomiting', 'Call poison control'] },
    swelling: { level: 'urgent', steps: ['Apply cold compress', 'Monitor breathing', 'Check for allergic reaction'] },
    eye: { level: 'urgent', steps: ['Flush with saline solution', 'Do not rub', 'Cover with clean cloth'] },
    shock: { level: 'critical', steps: ['Keep warm with blanket', 'Elevate hindquarters', 'Minimize movement'] },
    paralyzed: { level: 'critical', steps: ['Immobilize completely', 'Use rigid surface for transport', 'Support head and neck'] }
};

function assessSymptoms() {
    const selectedSymptoms = [];
    document.querySelectorAll('.symptom-item input:checked').forEach(input => {
        selectedSymptoms.push(input.value);
    });

    
    if (selectedSymptoms.length === 0) {
        alert('Please select at least one symptom');
        return;
    }

    
    // Determine emergency level
    let highestLevel = 'monitor';
    selectedSymptoms.forEach(symptom => {
        if (symptomData[symptom]) {
            const level = symptomData[symptom].level;
            if (level === 'critical') highestLevel = 'critical';
            else if (level === 'urgent' && highestLevel !== 'critical') highestLevel = 'urgent';
        }
    });

    
    // Show emergency level
    const emergencyLevel = document.getElementById('emergencyLevel');
    const levelIcon = document.getElementById('levelIcon');
    const levelTitle = document.getElementById('levelTitle');
    const levelDescription = document.getElementById('levelDescription');
    const levelInstructions = document.getElementById('levelInstructions');

    emergencyLevel.className = `emergency-level show ${highestLevel}`;

    switch (highestLevel) {
    
    emergencyLevel.className = `emergency-level show ${highestLevel}`;
    
    switch(highestLevel) {
        case 'critical':
            levelIcon.textContent = '🚨';
            levelTitle.textContent = 'CRITICAL EMERGENCY';
            levelTitle.className = 'level-title critical';
            levelDescription.textContent = 'Life-threatening situation requiring immediate action';
            levelInstructions.textContent = 'Take action NOW and prepare for immediate veterinary care';
            break;
        case 'urgent':
            levelIcon.textContent = '⚠️';
            levelTitle.textContent = 'URGENT CARE NEEDED';
            levelTitle.className = 'level-title urgent';
            levelDescription.textContent = 'Serious condition requiring prompt veterinary attention';
            levelInstructions.textContent = 'Seek veterinary care within 2-4 hours';
            break;
        case 'monitor':
            levelIcon.textContent = 'ℹ️';
            levelTitle.textContent = 'MONITOR CLOSELY';
            levelTitle.className = 'level-title monitor';
            levelDescription.textContent = 'Non-emergency situation requiring observation';
            levelInstructions.textContent = 'Monitor closely and seek veterinary advice if condition worsens';
            break;
    }

    
    // Show action steps
    const actionSteps = document.getElementById('actionSteps');
    const stepsContainer = document.getElementById('stepsContainer');
    stepsContainer.innerHTML = '';

    
    // Combine steps from all selected symptoms
    const allSteps = [];
    selectedSymptoms.forEach(symptom => {
        if (symptomData[symptom]) {
            symptomData[symptom].steps.forEach((step, index) => {
                allSteps.push({
                    symptom: symptom,
                    step: step,
                    priority: symptomData[symptom].level === 'critical' ? 1 :
                        symptomData[symptom].level === 'urgent' ? 2 : 3
                });
            });
        }
    });

                    priority: symptomData[symptom].level === 'critical' ? 1 : 
                             symptomData[symptom].level === 'urgent' ? 2 : 3
                });
            });
        }
    });
    
    // Sort by priority and deduplicate
    const uniqueSteps = [...new Set(allSteps.map(s => s.step))];
    uniqueSteps.forEach((step, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step';
        stepDiv.innerHTML = `
            <div class="step-number">${index + 1}</div>
            <div>${step}</div>
        `;
        stepsContainer.appendChild(stepDiv);
    });

    actionSteps.classList.add('show');

    // Show vet guidance if critical or urgent
    const vetGuidance = document.getElementById('vetGuidance');
    const vetInstructions = document.getElementById('vetInstructions');

    
    actionSteps.classList.add('show');
    
    // Show vet guidance if critical or urgent
    const vetGuidance = document.getElementById('vetGuidance');
    const vetInstructions = document.getElementById('vetInstructions');
    
    if (highestLevel === 'critical' || highestLevel === 'urgent') {
        vetGuidance.classList.add('show');
        if (highestLevel === 'critical') {
            vetInstructions.textContent = 'IMMEDIATE veterinary care is required. Call emergency vet NOW and prepare for transport.';
        } else {
            vetInstructions.textContent = 'Veterinary care needed within a few hours. Call your vet immediately for guidance.';
        }
    } else {
        vetGuidance.classList.remove('show');
    }

    
    // Scroll to results
    emergencyLevel.scrollIntoView({ behavior: 'smooth' });
}

function resetAssessment() {
    document.querySelectorAll('.symptom-item input:checked').forEach(input => {
        input.checked = false;
        input.parentElement.classList.remove('selected');
    });

    
    document.getElementById('emergencyLevel').classList.remove('show');
    document.getElementById('actionSteps').classList.remove('show');
    document.getElementById('vetGuidance').classList.remove('show');
}

function findNearestVet() {
    alert('Feature: Would open map with nearest emergency veterinary clinics. In a real app, this would use geolocation API.');
}

function prepareForVetVisit() {
    alert('Vet Visit Preparation:\n1. Keep animal calm and warm\n2. Bring any vomit/poison samples\n3. Note all symptoms and timeline\n4. Bring medical history if available\n5. Have emergency contact ready');
}

// Add click handlers to symptom items
document.querySelectorAll('.symptom-item').forEach(item => {
    item.addEventListener('click', function (e) {
    item.addEventListener('click', function(e) {
        if (e.target.type !== 'checkbox') {
            const checkbox = this.querySelector('input');
            checkbox.checked = !checkbox.checked;
        }
        this.classList.toggle('selected', this.querySelector('input').checked);
    });
});

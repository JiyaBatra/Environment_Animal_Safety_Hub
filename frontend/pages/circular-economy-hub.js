// Circular Economy Education Hub JS
// Handles principles, examples, and actions

document.addEventListener('DOMContentLoaded', function() {
  // --- Principles ---
  const principles = [
    'Design out waste and pollution.',
    'Keep products and materials in use.',
    'Regenerate natural systems.',
    'Promote reuse, repair, and recycling.',
    'Encourage sharing and collaborative consumption.'
  ];
  const principlesList = document.getElementById('principlesList');
  principles.forEach(p => {
    const li = document.createElement('li');
    li.textContent = p;
    principlesList.appendChild(li);
  });

  // --- Examples ---
  const examples = [
    { title: 'Clothing Swap Events', desc: 'Communities organize swaps to extend clothing life and reduce textile waste.' },
    { title: 'Refill Stations', desc: 'Stores offer refillable containers for cleaning and personal care products.' },
    { title: 'Repair Cafés', desc: 'Local workshops help people fix broken items instead of discarding them.' },
    { title: 'Compost Collection', desc: 'Cities collect food scraps for composting, returning nutrients to the soil.' },
    { title: 'Product Take-Back Programs', desc: 'Manufacturers reclaim used products for recycling or remanufacturing.' }
  ];
  const examplesGrid = document.getElementById('examplesGrid');
  examples.forEach(e => {
    const card = document.createElement('div');
    card.className = 'example-card';
    card.innerHTML = `<div class="example-title">${e.title}</div><div class="example-desc">${e.desc}</div>`;
    examplesGrid.appendChild(card);
  });

  // --- Actions ---
  const actions = [
    'Buy durable, repairable products.',
    'Participate in local sharing and swap events.',
    'Compost food scraps and yard waste.',
    'Choose products with recycled content.',
    'Support businesses with circular practices.'
  ];
  const actionsList = document.getElementById('actionsList');
  actions.forEach(a => {
    const li = document.createElement('li');
    li.textContent = a;
    actionsList.appendChild(li);
  });
});

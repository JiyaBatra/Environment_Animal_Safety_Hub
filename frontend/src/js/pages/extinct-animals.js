const extinctAnimals = [
  {
    name: "Dodo",
    year: "1681",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/50/Dodo_1.JPG",
    reason: "Hunting & invasive species"
  },
  {
    name: "Woolly Mammoth",
    year: "2000 BC",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Woolly_mammoth_model_Royal_BC_Museum.jpg",
    reason: "Climate change & human hunting"
  },
  {
    name: "Tasmanian Tiger",
    year: "1936",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Thylacine_melbourne_zoo_1936.jpg",
    reason: "Overhunting"
  }
];

const grid = document.getElementById("extinctGrid");

extinctAnimals.forEach(animal => {
  grid.innerHTML += `
    <div class="extinct-card">
      <img src="${animal.image}" alt="${animal.name}">
      <div class="extinct-content">
        <h3>${animal.name}</h3>
        <span>Extinct: ${animal.year}</span>
        <p>${animal.reason}</p>
      </div>
    </div>
  `;
});

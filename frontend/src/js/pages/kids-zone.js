const emojis = ['🌳','🌱','🍃','🍂','🐶','🐱','🦁','🦉','🐢','🐸','🎤','🧩','♻️','🗑️','🌞','🌍','💡','⚡']; 
const container = document.querySelector('.floating-emojis');
const count = 20;

for(let i = 0; i < count; i++){
  const span = document.createElement('span');
  span.innerText = emojis[Math.floor(Math.random() * emojis.length)];

  // Random horizontal position
  span.style.left = Math.random() * 100 + 'vw';

  // Random size
  span.style.fontSize = (20 + Math.random() * 30) + 'px';

  // Random animation duration (speed)
  span.style.animationDuration = (8 + Math.random() * 12) + 's';

  // Random animation delay
  span.style.animationDelay = Math.random() * 10 + 's';

  container.appendChild(span);
}


AOS.init({
  duration: 1000,
  once: true,
  easing: "ease-in-out"
});

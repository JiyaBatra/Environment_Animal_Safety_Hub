/*==================================================
i am a contributor want to add leaf-styling in cursor
===================================================*/

document.addEventListener("mousemove", function(e) {
  const leaf = document.createElement("div");
  leaf.classList.add("leaf");
  leaf.textContent = "🍃"; // the leaf emoji

  // starting position
  leaf.style.left = e.clientX + "px";
  leaf.style.top = e.clientY + "px";

  // random rotation
  const rotate = Math.random() * 360;
  leaf.style.transform = `translate(-50%, -50%) rotate(${rotate}deg)`;

  document.body.appendChild(leaf);

  // float animation
  setTimeout(() => {
    leaf.style.transform = `translate(${Math.random() * 50 - 25}px, -100px) rotate(${rotate + 45}deg)`;
    leaf.style.opacity = 0;
  }, 50);

  // remove after animation
  setTimeout(() => {
    leaf.remove();
  }, 1500);
});

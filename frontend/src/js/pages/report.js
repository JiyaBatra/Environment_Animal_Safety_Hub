// Initialize AOS
AOS.init({
  duration: 1000,
  once: true,
});

// Simple submit handler
document.getElementById("reportForm").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("🐾 Thank you! Your report has been submitted successfully 💚");
  this.reset();
});

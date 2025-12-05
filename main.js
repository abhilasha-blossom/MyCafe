document.addEventListener('DOMContentLoaded', () => {
  // ================= DARK MODE LOGIC =================
  const themeBtn = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  
  // Check if elements exist (to avoid errors on pages that might miss them)
  if (themeBtn && themeIcon) {
    const savedTheme = localStorage.getItem("flowerdoor-theme");

    // Apply saved theme on load
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
      themeIcon.classList.replace("fa-moon", "fa-sun");
    }

    // Toggle theme on click
    themeBtn.addEventListener("click", () => {
      const isDark = document.body.classList.toggle("dark-mode");
      themeIcon.classList.replace(isDark ? "fa-moon" : "fa-sun", isDark ? "fa-sun" : "fa-moon");
      localStorage.setItem("flowerdoor-theme", isDark ? "dark" : "light");
    });
  }

  // ================= ORDER BUTTON LOGIC =================
  const orderButtons = document.querySelectorAll('.pastel-btn');
  
  orderButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Prevent default if it's a link styled as a button, unless it has a specific href
      if (btn.tagName === 'A' && btn.getAttribute('href') && btn.getAttribute('href') !== '#') {
        return; 
      }
      
      // If it's a button or a link with href="#"
      if (btn.tagName === 'BUTTON' || (btn.tagName === 'A' && btn.getAttribute('href') === '#')) {
        e.preventDefault();
        
        // Simple visual feedback
        const originalText = btn.innerText;
        btn.innerText = "Added to Cart! 🌸";
        btn.style.backgroundColor = "#4caf50"; // Green success color
        btn.disabled = true;

        setTimeout(() => {
          btn.innerText = originalText;
          btn.style.backgroundColor = ""; // Revert to CSS default
          btn.disabled = false;
        }, 2000);
      }
    });
  });
});

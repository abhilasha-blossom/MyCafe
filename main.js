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

  // ================= CART LOGIC =================
  let cart = JSON.parse(localStorage.getItem("flowerdoor-cart")) || [];

  function updateCartCount() {
    const countBadge = document.getElementById("cart-count");
    if (countBadge) {
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      countBadge.innerText = totalItems;
    }
  }

  function saveCart() {
    localStorage.setItem("flowerdoor-cart", JSON.stringify(cart));
    updateCartCount();
  }

  function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1 });
    }
    saveCart();
  }

  function renderCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotalElement = document.getElementById("cart-total");

    if (!cartItemsContainer || !cartTotalElement) return;

    cartItemsContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="text-center text-muted">Your cart is empty.</p>';
    } else {
      cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const itemEl = document.createElement("div");
        itemEl.classList.add("d-flex", "justify-content-between", "align-items-center", "mb-2");
        itemEl.innerHTML = `
          <div>
            <h6 class="mb-0">${item.name}</h6>
            <small class="text-muted">₹ ${item.price} x ${item.quantity}</small>
          </div>
          <div class="d-flex align-items-center gap-2">
            <span class="fw-bold">₹ ${itemTotal}</span>
            <button class="btn btn-sm btn-outline-danger remove-btn" data-index="${index}">&times;</button>
          </div>
        `;
        cartItemsContainer.appendChild(itemEl);
      });

      // Add event listeners to remove buttons
      document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
          const index = parseInt(e.target.getAttribute("data-index"));
          cart.splice(index, 1);
          saveCart();
          renderCart();
        });
      });
    }

    cartTotalElement.innerText = "₹ " + total;
  }

  // Initial Load
  updateCartCount();

  // Render cart when modal opens
  const cartModal = document.getElementById('cartModal');
  if (cartModal) {
    cartModal.addEventListener('show.bs.modal', renderCart);
  }

  // ================= ORDER BUTTON LOGIC =================
  const orderButtons = document.querySelectorAll(".pastel-btn");

  orderButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      // Prevent default if it is a link styled as a button, unless it has a specific href
      if (btn.tagName === "A" && btn.getAttribute("href") && btn.getAttribute("href") !== "#") {
        return;
      }

      // If it is a button or a link with href="#"
      if (btn.tagName === "BUTTON" || (btn.tagName === "A" && btn.getAttribute("href") === "#")) {
        e.preventDefault();

        // Extract Product Info
        let name = "Unknown Item";
        let price = 0;

        const productBox = btn.closest(".product-box");
        const menuItem = btn.closest(".menu-item");

        if (productBox) {
          name = productBox.querySelector("p")?.innerText || "Unknown Item";
          const priceText = productBox.querySelector("h3")?.innerText || "0";
          price = parseInt(priceText.replace(/[^0-9]/g, "")) || 0;
        } else if (menuItem) {
          const h5 = menuItem.querySelector("h5");
          if (h5) {
            // Get text node only (name)
            name = Array.from(h5.childNodes)
              .filter(node => node.nodeType === Node.TEXT_NODE)
              .map(node => node.textContent.trim())
              .join(" ");

            const priceTag = h5.querySelector(".price-tag");
            const priceText = priceTag?.innerText || "0";
            price = parseInt(priceText.replace(/[^0-9]/g, "")) || 0;
          }
        }

        console.log("Adding to cart:", name, price);
        if (price > 0) {
          addToCart(name, price);
        }

        // Simple visual feedback
        const originalText = btn.innerText;
        btn.innerText = "Added! 🌸";
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

  // ================= MANGA SEARCH LOGIC =================
  const mangaSearch = document.getElementById("mangaSearch");
  if (mangaSearch) {
    mangaSearch.addEventListener("input", (e) => {
      const term = e.target.value.toLowerCase();
      const mangaItems = document.querySelectorAll(".manga-box");

      mangaItems.forEach(item => {
        const title = item.querySelector("h4").innerText.toLowerCase();
        const genre = item.querySelector("p").innerText.toLowerCase();
        const parentCol = item.closest(".col-xl-3"); // Hide the column

        if (title.includes(term) || genre.includes(term)) {
          parentCol.style.display = "block";
        } else {
          parentCol.style.display = "none";
        }
      });
    });
  }

  // ================= FLOWER BUILDER LOGIC =================
  const flowerForm = document.getElementById("flowerForm");
  if (flowerForm) {
    const totalDisplay = document.getElementById("totalPrice");
    const budgetInput = document.getElementById("budget");
    const budgetValue = document.getElementById("budgetValue");
    const inputs = flowerForm.querySelectorAll("input, select");

    function calculateTotal() {
      let total = parseInt(budgetInput.value) || 0;

      // Occasion
      const occasion = document.getElementById("occasion");
      if (occasion.selectedOptions[0]) {
        total += parseInt(occasion.selectedOptions[0].getAttribute("data-price")) || 0;
      }

      // Palette
      const palette = document.querySelector("input[name='palette']:checked");
      if (palette) {
        total += parseInt(palette.getAttribute("data-price")) || 0;
      }

      // Flowers
      flowerForm.querySelectorAll("input[type='checkbox']:checked").forEach(cb => {
        total += parseInt(cb.getAttribute("data-price")) || 0;
      });

      totalDisplay.innerText = "₹ " + total;
    }

    inputs.forEach(input => {
      input.addEventListener("change", calculateTotal);
      input.addEventListener("input", calculateTotal);
    });

    budgetInput.addEventListener("input", (e) => {
      budgetValue.innerText = "₹ " + e.target.value;
      calculateTotal();
    });

    // Initial Calc
    calculateTotal();
  }

  // ================= RESERVATION LOGIC =================
  const reservationForm = document.getElementById("reservationForm");
  if (reservationForm) {
    reservationForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("resName").value;
      const date = document.getElementById("resDate").value;
      const time = document.getElementById("resTime").value;
      const guests = document.getElementById("resGuests").value;

      alert(`Table reserved for ${name} on ${date} at ${time} for ${guests} guests! 🌸`);
      reservationForm.reset();
    });
  }
});

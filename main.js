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

  // ================= PRELOADER LOGIC =================
  const preloader = document.createElement('div');
  preloader.id = 'preloader';
  preloader.innerHTML = `
      <img src="https://cdn-icons-png.flaticon.com/128/346/346167.png" class="loader-flower" alt="Loading...">
      <h4 class="mt-3 text-muted" style="letter-spacing: 2px;">BLOOMING...</h4>
  `;
  document.body.prepend(preloader);

  window.addEventListener("load", () => {
    setTimeout(() => {
      preloader.style.opacity = "0";
      setTimeout(() => {
        preloader.remove();
      }, 500);
    }, 800); // Small delay to let user see it
  });

  // ================= DYNAMIC RENDERING (HOME) =================
  const homeSpecialsContainer = document.getElementById("home-specials");
  const reviewsContainer = document.getElementById("reviews-container");

  if (homeSpecialsContainer && typeof products !== 'undefined') {
    const specials = [
      ...products.cafe.filter(p => p.featured),
      ...products.flowers.filter(p => p.featured),
      ...products.manga.filter(p => p.featured)
    ].slice(0, 6); // Just top 6 for home

    homeSpecialsContainer.innerHTML = specials.map((item, index) => `
      <figure class="col-lg-4 col-md-6 col-6 text-center product-box" data-aos="fade-up" data-aos-delay="${index * 100}">
        <button class="fav-btn" data-name="${item.name}" data-img="${item.image}" data-price="${item.price}"><i class="fa-regular fa-heart"></i></button>
        <img src="${item.image}" class="img-fluid" alt="${item.name}" />
        <h3>₹ ${item.price}</h3>
        <p>${item.name}</p>
        <button class="btn pastel-btn" data-name="${item.name}" data-price="${item.price}">Order Now</button>
      </figure>
    `).join('');
  }

  if (reviewsContainer && typeof products !== 'undefined') {
    reviewsContainer.innerHTML = products.reviews.map((review, index) => `
      <div class="carousel-item ${index === 0 ? 'active' : ''}">
        <div class="review-card text-center mx-auto p-4">
          <p class="fst-italic">${review.text}</p>
          <h6 class="fw-bold mt-2">— ${review.author}</h6>
          <p class="text-warning fs-4">
            ${'<i class="fa-solid fa-star"></i>'.repeat(review.stars)}
            ${'<i class="fa-regular fa-star"></i>'.repeat(5 - review.stars)}
          </p>
        </div>
      </div>
    `).join('');
  }

  // ================= DYNAMIC RENDERING (MENU PAGE) =================
  const hotBrewsContainer = document.getElementById("hot-brews-container");
  const sweetTreatsContainer = document.getElementById("sweet-treats-container");
  const menuFlowersContainer = document.getElementById("menu-flowers-container");

  if (hotBrewsContainer && typeof products !== 'undefined') {
    const hotBrews = products.cafe.filter(p => p.category === "Hot Brews");
    hotBrews.forEach(item => {
      const div = document.createElement('div');
      div.className = 'menu-item';
      div.setAttribute('data-aos', 'fade-up');
      div.innerHTML = `
            <h5>${item.name} <span class="price-tag">₹ ${item.price}</span></h5>
            <small class="text-muted">${item.description}</small>
            <button class="btn btn-sm pastel-btn mt-2" data-name="${item.name}" data-price="${item.price}">Order Now</button>
        `;
      hotBrewsContainer.appendChild(div);
    });
  }

  if (sweetTreatsContainer && typeof products !== 'undefined') {
    const sweetTreats = products.cafe.filter(p => p.category === "Sweet Treats");
    sweetTreats.forEach(item => {
      const div = document.createElement('div');
      div.className = 'menu-item';
      div.setAttribute('data-aos', 'fade-up');
      div.innerHTML = `
            <h5>${item.name} <span class="price-tag">₹ ${item.price}</span></h5>
            <small class="text-muted">${item.description}</small>
            <button class="btn btn-sm pastel-btn mt-2" data-name="${item.name}" data-price="${item.price}">Order Now</button>
        `;
      sweetTreatsContainer.appendChild(div);
    });
  }

  if (menuFlowersContainer && typeof products !== 'undefined') {
    // Keep the "Custom Arrangement" card which is the last child usually
    const customCard = menuFlowersContainer.querySelector('.col-md-4:last-child');
    menuFlowersContainer.innerHTML = ''; // Clear it

    products.flowers.slice(0, 2).forEach(item => {
      const div = document.createElement('div');
      div.className = 'col-md-4';
      div.innerHTML = `
            <div class="product-box text-center" data-aos="fade-up">
                <img src="${item.image}" class="img-fluid mb-3 rounded" alt="${item.name}">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <h3>₹ ${item.price}</h3>
                <button class="btn pastel-btn mt-2" data-name="${item.name}" data-price="${item.price}">Order Now</button>
            </div>
        `;
      menuFlowersContainer.appendChild(div);
    });

    // Add custom card back
    if (customCard) menuFlowersContainer.appendChild(customCard);
  }

  // ================= DYNAMIC RENDERING (FLOWERS PAGE) =================
  const flowerGrid = document.getElementById("flower-grid");
  if (flowerGrid && typeof products !== 'undefined') {
    flowerGrid.innerHTML = products.flowers.map((item, index) => `
      <figure class="col-lg-4 col-md-4 col-6 text-center product-box" data-aos="fade-up" data-aos-delay="${index * 50}">
        <img src="${item.image}" class="img-fluid" alt="${item.name}" />
        <h3>₹ ${item.price}</h3>
        <p>${item.name}</p>
        <button class="btn pastel-btn" data-name="${item.name}" data-price="${item.price}">Order Now</button>
      </figure>
    `).join('');
  }

  // ================= DYNAMIC RENDERING (MANGA PAGE) =================
  const mangaGrid = document.getElementById("manga-grid");
  if (mangaGrid && typeof products !== 'undefined') {
    const mangas = products.manga.filter(m => m.category !== 'Set');
    mangaGrid.innerHTML = mangas.map((item, index) => `
      <div class="col-xl-3 col-lg-3 col-md-4 col-6 mb-4" data-aos="fade-up" data-aos-delay="${index * 50}">
        <div class="manga-box text-center">
          <button class="fav-btn" data-name="${item.name}" data-img="${item.image}" data-price="0"><i class="fa-regular fa-heart"></i></button>
          <img src="${item.image}" class="img-fluid manga-cover" alt="${item.name}" />
          <h4>${item.name}</h4>
          <p class="text-muted">${item.genre}</p>
          <button class="btn pastel-btn btn-sm">Read More</button>
        </div>
      </div>
    `).join('');
  }

  // ================= FAVORITES / WISHLIST LOGIC =================
  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest(".fav-btn");
    if (btn) {
      e.preventDefault();
      e.stopPropagation(); // Don't trigger card click
      const name = btn.getAttribute("data-name");
      const img = btn.getAttribute("data-img");
      const price = btn.getAttribute("data-price");

      let wishlist = JSON.parse(localStorage.getItem('flowerdoor-wishlist')) || [];
      const existingIndex = wishlist.findIndex(item => item.name === name);

      if (existingIndex > -1) {
        // Remove
        wishlist.splice(existingIndex, 1);
        btn.classList.remove("active");
        btn.innerHTML = '<i class="fa-regular fa-heart"></i>';
      } else {
        // Add
        wishlist.push({ name, image: img, price });
        btn.classList.add("active");
        btn.innerHTML = '<i class="fa-solid fa-heart"></i>';

        // Cute animation effect
        const heart = document.createElement('i');
        heart.className = 'fa-solid fa-heart text-danger';
        heart.style.position = 'fixed';
        heart.style.left = e.clientX + 'px';
        heart.style.top = e.clientY + 'px';
        heart.style.fontSize = '2rem';
        heart.style.pointerEvents = 'none';
        heart.style.transition = 'all 0.8s ease';
        heart.style.zIndex = 10000;
        document.body.appendChild(heart);

        setTimeout(() => {
          heart.style.transform = 'translateY(-100px) scale(0)';
          heart.style.opacity = 0;
        }, 10);
        setTimeout(() => heart.remove(), 800);
      }

      localStorage.setItem('flowerdoor-wishlist', JSON.stringify(wishlist));
    }
  });

  // ================= ORDER BUTTON LOGIC (DELEGATED) =================
  document.body.addEventListener("click", (e) => {
    if (e.target.classList.contains("pastel-btn")) {
      const btn = e.target;

      // Prevent default if it is a link styled as a button, unless it has a specific href
      if (btn.tagName === "A" && btn.getAttribute("href") && btn.getAttribute("href") !== "#") {
        return;
      }

      // If it is a button or a link with href="#"
      if (btn.tagName === "BUTTON" || (btn.tagName === "A" && btn.getAttribute("href") === "#")) {
        e.preventDefault();

        // Extract Product Info
        let name = btn.getAttribute("data-name");
        let price = parseInt(btn.getAttribute("data-price"));

        // Fallback for non-dynamic pages (legacy support)
        if (!name || isNaN(price)) {
          const productBox = btn.closest(".product-box");
          const menuItem = btn.closest(".menu-item");

          if (productBox) {
            name = productBox.querySelector("p")?.innerText || "Unknown Item";
            const priceText = productBox.querySelector("h3")?.innerText || "0";
            price = parseInt(priceText.replace(/[^0-9]/g, "")) || 0;
          } else if (menuItem) {
            const h5 = menuItem.querySelector("h5");
            if (h5) {
              name = Array.from(h5.childNodes)
                .filter(node => node.nodeType === Node.TEXT_NODE)
                .map(node => node.textContent.trim())
                .join(" ");
              const priceTag = h5.querySelector(".price-tag");
              const priceText = priceTag?.innerText || "0";
              price = parseInt(priceText.replace(/[^0-9]/g, "")) || 0;
            }
          }
        }

        console.log("Adding to cart:", name, price);
        if (price > 0) {
          addToCart(name, price);

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
      }
    }
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

  // ================= MANGA READER LOGIC =================
  const mangaReaderModal = document.getElementById("mangaReaderModal");
  if (mangaReaderModal) {
    const titleEl = document.getElementById("mangaReaderTitle");
    const imgEl = document.getElementById("currentMangaPage");
    const prevBtn = document.getElementById("prevPage");
    const nextBtn = document.getElementById("nextPage");
    const pageInd = document.getElementById("pageIndicator");

    let currentPage = 1;
    let currentManga = "";
    const totalPages = 3; // Simulated

    // Delegate click for "Read More" buttons
    document.body.addEventListener("click", (e) => {
      if (e.target.innerText === "Read More") {
        const box = e.target.closest(".manga-box");
        if (box) {
          currentManga = box.querySelector("h4").innerText;
          titleEl.innerText = "Reading: " + currentManga;
          currentPage = 1;
          updatePage();
          new bootstrap.Modal(mangaReaderModal).show();
        }
      }
    });

    function updatePage() {
      // Simulating pages with placeholders or diverse images
      // Ideally these would be real pages from data.js
      imgEl.src = `https://dummyimage.com/600x900/fff/000&text=${currentManga}+Page+${currentPage}`;
      pageInd.innerText = currentPage;
    }

    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        updatePage();
      }
    });

    nextBtn.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        updatePage();
      }
    });
  }
  const flowerForm = document.getElementById("flowerForm");
  if (flowerForm) {
    const totalDisplay = document.getElementById("totalPrice");
    const budgetInput = document.getElementById("budget");
    const budgetValue = document.getElementById("budgetValue");
    const inputs = flowerForm.querySelectorAll("input, select");
    const visualVase = document.getElementById("vase-visual");

    // Minimal icons for visualization
    const flowerAssets = {
      'roses': 'https://cdn-icons-png.flaticon.com/128/9620/9620771.png',
      'lilies': 'https://cdn-icons-png.flaticon.com/128/9620/9620771.png',
      'tulips': 'https://cdn-icons-png.flaticon.com/128/9620/9620771.png',
      'sunflowers': 'https://cdn-icons-png.flaticon.com/128/9620/9620771.png',
      'orchids': 'https://cdn-icons-png.flaticon.com/128/9620/9620771.png'
    };

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

      // Flowers & Visuals
      // First clear old dynamic flowers from vase
      if (visualVase) {
        const oldFlowers = visualVase.querySelectorAll('.dynamic-flower');
        oldFlowers.forEach(el => el.remove());
      }

      flowerForm.querySelectorAll("input[type='checkbox']:checked").forEach((cb, index) => {
        total += parseInt(cb.getAttribute("data-price")) || 0;

        if (visualVase) {
          // Add visual flower
          const img = document.createElement('img');
          img.src = "https://cdn-icons-png.flaticon.com/128/1825/1825637.png"; // Generic Rose Icon
          if (cb.id === 'sunflowers') img.src = "https://cdn-icons-png.flaticon.com/128/7394/7394208.png";
          if (cb.id === 'tulips') img.src = "https://cdn-icons-png.flaticon.com/128/2926/2926343.png";

          img.className = 'dynamic-flower';
          img.style.position = 'absolute';
          img.style.width = '60px';
          img.style.zIndex = 1;

          // Randomize position in the "vase" area
          const randomX = 20 + (Math.random() * 60); // 20% to 80% left
          const randomH = Math.random() * 50;
          img.style.left = randomX + '%';
          img.style.bottom = (40 + randomH) + 'px';
          img.style.transform = `translateX(-50%) rotate(${Math.random() * 40 - 20}deg)`;

          visualVase.appendChild(img);
        }
      });

      if (totalDisplay) totalDisplay.innerText = "₹ " + total;
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

  // ================= LOFI WIDGET LOGIC =================
  const lofiWidget = document.createElement("div");
  lofiWidget.id = "lofi-widget";
  lofiWidget.innerHTML = `
    <div class="lofi-player">
      <div class="lofi-icon"><i class="fa-solid fa-headphones"></i></div>
      <div class="lofi-controls">
        <span class="song-title">Cozy Beats</span>
        <div class="d-flex gap-2 align-items-center">
            <button id="lofi-prev" class="btn btn-sm btn-link text-white p-0"><i class="fa-solid fa-backward-step"></i></button>
            <button id="lofi-toggle" class="btn btn-sm btn-light rounded-circle"><i class="fa-solid fa-play"></i></button>
            <button id="lofi-next" class="btn btn-sm btn-link text-white p-0"><i class="fa-solid fa-forward-step"></i></button>
        </div>
      </div>
      <audio id="lofi-audio" loop>
        <source src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112778.mp3" type="audio/mpeg">
      </audio>
    </div>
  `;
  document.body.appendChild(lofiWidget);

  const audio = document.getElementById("lofi-audio");
  const toggleBtn = document.getElementById("lofi-toggle");

  // Set volume low for background ambience
  if (audio) audio.volume = 0.3;

  if (toggleBtn && audio) {
    toggleBtn.addEventListener("click", () => {
      if (audio.paused) {
        audio.play().then(() => {
          toggleBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
          lofiWidget.classList.add("playing");
        }).catch(e => console.log("Audio play failed:", e));
      } else {
        audio.pause();
        toggleBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        lofiWidget.classList.remove("playing");
      }
    });
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

  // ================= AOS ANIMATION =================
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true
    });
  }
});

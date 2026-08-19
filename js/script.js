document.addEventListener("DOMContentLoaded", () => {
  const rupiah = (n) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(n);
  const products = [...document.querySelectorAll(".product")];
  const cartButton = document.getElementById("cartButton");
  const cartPanel = document.getElementById("cartPanel");
  const cartOverlay = document.getElementById("cartOverlay");
  const closeCart = document.getElementById("closeCart");
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const subtotalEl = document.getElementById("subtotal");
  const shippingEl = document.getElementById("shipping");
  const totalEl = document.getElementById("total");

  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileOverlay = document.getElementById("mobileOverlay");
  const closeMenu = document.getElementById("closeMenu");

  // GANTI DENGAN NOMOR WHATSAPP TOKO.
  const WHATSAPP = "6281234567890";
  const DELIVERY = 10000;
  const cart = {};

  function openCart() {
    cartPanel.classList.add("open");
    cartOverlay.classList.add("show");
  }
  function closeCartPanel() {
    cartPanel.classList.remove("open");
    cartOverlay.classList.remove("show");
  }
  cartButton.addEventListener("click", openCart);
  closeCart.addEventListener("click", closeCartPanel);
  cartOverlay.addEventListener("click", closeCartPanel);

  function renderCart() {
    const items = Object.values(cart);
    const count = items.reduce((a, b) => a + b.qty, 0);
    const subtotal = items.reduce((a, b) => a + b.price * b.qty, 0);
    const shipping = subtotal ? DELIVERY : 0;
    cartCount.textContent = count;
    subtotalEl.textContent = rupiah(subtotal);
    shippingEl.textContent = rupiah(shipping);
    totalEl.textContent = rupiah(subtotal + shipping);

    if (!items.length) {
      cartItems.innerHTML = '<p class="empty">Keranjang masih kosong.</p>';
      return;
    }

    cartItems.innerHTML = items
      .map(
        (item) => ` <div class="cart-line"> <div><strong>${item.name}</strong><br><small>${item.qty} Ã— ${rupiah( item.price )}</small></div> <button class="remove" data-name="${ item.name }" style="border:0;background:transparent;color:#c33">Hapus</button> </div> `
      )
      .join("");

    cartItems.querySelectorAll(".remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        delete cart[btn.dataset.name];
        renderCart();
      });
    });
  }

  products.forEach((product) => {
    product.querySelector(".add").addEventListener("click", () => {
      const name = product.dataset.name;
      const price = Number(product.dataset.price);
      if (!cart[name]) cart[name] = { name, price, qty: 0 };
      cart[name].qty++;
      renderCart();
      openCart();
    });
  });

  // Product filters
  document.querySelectorAll(".filter").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".filter")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      products.forEach((p) =>
        p.classList.toggle(
          "hidden",
          filter !== "Semua" && p.dataset.category !== filter
        )
      );
    });
  });

  document.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", () => {
      const filter = card.dataset.filter;
      document
        .querySelectorAll(".filter")
        .forEach((b) =>
          b.classList.toggle("active", b.dataset.filter === filter)
        );
      products.forEach((p) =>
        p.classList.toggle("hidden", p.dataset.category !== filter)
      );
    });
  });

  // Mobile menu
  function openMobile() {
    mobileMenu.classList.add("open");
    mobileOverlay.classList.add("show");
    document.body.style.overflow = "hidden";
    burger.setAttribute("aria-expanded", "true");
  }
  function closeMobile() {
    mobileMenu.classList.remove("open");
    mobileOverlay.classList.remove("show");
    document.body.style.overflow = "";
    burger.setAttribute("aria-expanded", "false");
  }
  burger.addEventListener("click", openMobile);
  closeMenu.addEventListener("click", closeMobile);
  mobileOverlay.addEventListener("click", closeMobile);
  mobileMenu
    .querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", closeMobile));

  function search(value) {
    const q = value.trim().toLowerCase();
    if (!q) {
      products.forEach((p) => p.classList.remove("hidden"));
      return;
    }
    products.forEach((p) =>
      p.classList.toggle("hidden", !p.dataset.name.toLowerCase().includes(q))
    );
    document.getElementById("products").scrollIntoView({ behavior: "smooth" });
  }
  document
    .getElementById("mobileSearchBtn")
    .addEventListener("click", () =>
      search(document.getElementById("mobileSearch").value)
    );
  document.getElementById("mobileSearch").addEventListener("keydown", (e) => {
    if (e.key === "Enter") search(e.target.value);
  });

  document.getElementById("checkout").addEventListener("click", () => {
    const items = Object.values(cart);
    if (!items.length) {
      alert("Keranjang masih kosong.");
      return;
    }
    const subtotal = items.reduce((a, b) => a + b.price * b.qty, 0);
    const message = `Halo SegarMart ðŸ‘‹ Saya ingin memesan: ${items .map((i) => `â€¢ ${i.name} x${i.qty} = ${rupiah(i.price * i.qty)}`) .join("\n")} Subtotal: ${rupiah(subtotal)} Ongkir: ${rupiah(DELIVERY)} Total: ${rupiah(subtotal + DELIVERY)} Mohon dikonfirmasi. Terima kasih.`;
    window.open(
      `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  });

  document.getElementById("year").textContent = new Date().getFullYear();
  renderCart();
});
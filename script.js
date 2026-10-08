/* =========================================================
   CAOTICCO — SCRIPT PRINCIPAL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     UTILIDADES
  ========================================================= */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  const formatPrice = (price) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0
    }).format(price);


  /* =========================================================
     ALTURA DEL VIEWPORT
  ========================================================= */

  const setViewportHeight = () => {
    document.documentElement.style.setProperty(
      "--vh",
      `${window.innerHeight * 0.01}px`
    );
  };

  setViewportHeight();

  window.addEventListener("resize", setViewportHeight);


  /* =========================================================
     MENÚ MÓVIL
  ========================================================= */

  const menuToggle = $("#menu-toggle");
  const mobileMenu = $("#mobile-menu");

  if (menuToggle && mobileMenu) {

    menuToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("active");
      document.body.classList.toggle("menu-open");
    });

    $$("#mobile-menu a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
        document.body.classList.remove("menu-open");
      });
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1000) {
        mobileMenu.classList.remove("active");
        document.body.classList.remove("menu-open");
      }
    });
  }


  /* =========================================================
     REVEAL / ANIMACIONES
  ========================================================= */

  const revealElements = $$(".reveal");

  if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {

          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }

        });
      },
      {
        threshold: 0.12
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });

  } else {

    revealElements.forEach((element) => {
      element.classList.add("in-view");
    });

  }


  /* =========================================================
     PRODUCTOS
  ========================================================= */

  const products = [
    {
      id: 1,
      name: "CAOTICCO TEE",
      price: 89900,
      description: "Camiseta urbana CAOTICCO.",
      icon: "shirt"
    },

    {
      id: 2,
      name: "CAOTICCO HOODIE",
      price: 179900,
      description: "Hoodie pesado de estética urbana.",
      icon: "shirt"
    },

    {
      id: 3,
      name: "TOTE BAG BASIC",
      price: 50000,
      description:
        "Una pieza esencial elevada por un diseño exclusivo y acabados premium.",
      icon: "shopping-bag"
    }
  ];


  /* =========================================================
     CARRITO
  ========================================================= */

  let cart = [];

  try {
    cart = JSON.parse(localStorage.getItem("caoticcoCart")) || [];
  } catch (error) {
    cart = [];
  }


  const saveCart = () => {
    localStorage.setItem(
      "caoticcoCart",
      JSON.stringify(cart)
    );
  };


  const getProduct = (productId) => {
    return products.find(
      (product) => product.id === Number(productId)
    );
  };


  const addToCart = (productId) => {

    const product = getProduct(productId);

    if (!product) return;

    const existingProduct = cart.find(
      (item) => item.id === product.id
    );

    if (existingProduct) {

      existingProduct.quantity += 1;

    } else {

      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
      });

    }

    saveCart();
    renderCart();

    showNotification(
      `${product.name} añadido al carrito`
    );
  };


  const removeFromCart = (productId) => {

    cart = cart.filter(
      (item) => item.id !== Number(productId)
    );

    saveCart();
    renderCart();
  };


  const changeQuantity = (productId, amount) => {

    const item = cart.find(
      (product) => product.id === Number(productId)
    );

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    saveCart();
    renderCart();
  };


  const getCartTotal = () => {

    return cart.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0
    );

  };


  const getCartCount = () => {

    return cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  };


  /* =========================================================
     ELEMENTOS DEL CARRITO
  ========================================================= */

  const cartDrawer = $("#cart-drawer");
  const cartItems = $("#cart-items");
  const cartTotal = $("#cart-total");
  const cartCount = $("#cart-count");
  const cartButton = $("#cart-button");
  const cartClose = $("#cart-close");


  const openCart = () => {

    if (!cartDrawer) return;

    cartDrawer.classList.add("active");
    document.body.classList.add("cart-open");

  };


  const closeCart = () => {

    if (!cartDrawer) return;

    cartDrawer.classList.remove("active");
    document.body.classList.remove("cart-open");

  };


  if (cartButton) {
    cartButton.addEventListener("click", (event) => {
      event.preventDefault();
      openCart();
    });
  }


  if (cartClose) {
    cartClose.addEventListener("click", closeCart);
  }


  const renderCart = () => {

    if (cartCount) {
      cartCount.textContent = getCartCount();
    }

    if (cartTotal) {
      cartTotal.textContent =
        formatPrice(getCartTotal());
    }

    if (!cartItems) return;

    if (cart.length === 0) {

      cartItems.innerHTML = `
        <p class="cart-empty">
          Tu carrito está vacío.
        </p>
      `;

      return;
    }


    cartItems.innerHTML = cart.map((item) => `

      <div class="cart-item">

        <div class="cart-item-info">

          <h4>${item.name}</h4>

          <p>${formatPrice(item.price)}</p>

        </div>

        <div class="cart-item-controls">

          <button
            type="button"
            class="quantity-minus"
            data-cart-minus="${item.id}"
          >
            −
          </button>

          <span>${item.quantity}</span>

          <button
            type="button"
            class="quantity-plus"
            data-cart-plus="${item.id}"
          >
            +
          </button>

        </div>

        <button
          type="button"
          class="cart-item-remove"
          data-cart-remove="${item.id}"
        >
          ×
        </button>

      </div>

    `).join("");

  };


  /* =========================================================
     CONTROLES DEL CARRITO
  ========================================================= */

  document.addEventListener("click", (event) => {

    const addButton =
      event.target.closest("[data-add-cart]");

    if (addButton) {

      event.preventDefault();
      event.stopPropagation();

      const productId =
        Number(addButton.dataset.addCart);

      if (!Number.isNaN(productId)) {
        addToCart(productId);
      }

      return;
    }


    const plusButton =
      event.target.closest("[data-cart-plus]");

    if (plusButton) {

      const productId =
        Number(plusButton.dataset.cartPlus);

      changeQuantity(productId, 1);

      return;
    }


    const minusButton =
      event.target.closest("[data-cart-minus]");

    if (minusButton) {

      const productId =
        Number(minusButton.dataset.cartMinus);

      changeQuantity(productId, -1);

      return;
    }


    const removeButton =
      event.target.closest("[data-cart-remove]");

    if (removeButton) {

      const productId =
        Number(removeButton.dataset.cartRemove);

      removeFromCart(productId);

    }

  });


  /* =========================================================
     RENDER PRODUCTOS
  ========================================================= */

  const productsContainer =
    $("#products-container");


  if (productsContainer) {
    renderProducts();
  }


  function renderProducts() {

    if (!productsContainer) return;


    productsContainer.innerHTML = products.map(
      (product, index) => {

        /* ===============================================
           PRODUCTO 3 — TOTE BAG CON FOTO CLICKEABLE
        =============================================== */

        if (product.id === 3) {

          return `

            <article
              class="product-card reveal in-view"
              data-product-id="3"
              data-product-name="TOTE BAG BASIC"
              data-product-price="50000"
            >

              <div class="product-image">

                <span class="product-number">
                  03
                </span>

                <img
                  id="product-image-3"
                  class="clickable-product-image"
                  src="logo.jpeg"
                  alt="Tote Bag Basic"
                  data-image-index="0"
                >

              </div>


              <div class="product-info">

                <h3 class="display product-name">
                  TOTE BAG BASIC
                </h3>

                <p class="product-description">
                  Una pieza esencial elevada por un diseño exclusivo y acabados premium.
                </p>


                <div class="product-bottom">

                  <strong class="product-price">
                    $50.000
                  </strong>

                  <button
                    type="button"
                    class="product-add"
                    data-add-cart="3"
                  >

                    <i
                      data-lucide="plus"
                      width="17"
                    ></i>

                    Añadir

                  </button>

                </div>

              </div>

            </article>

          `;

        }


        /* ===============================================
           PRODUCTOS 1 Y 2
        =============================================== */

        return `

          <article
            class="product-card reveal in-view"
            data-product-id="${product.id}"
            data-product-name="${product.name}"
            data-product-price="${product.price}"
          >

            <div class="product-image">

              <span class="product-number">
                ${String(index + 1).padStart(2, "0")}
              </span>

              <i
                data-lucide="${product.icon}"
                width="85"
                height="85"
              ></i>

            </div>


            <div class="product-info">

              <h3 class="display product-name">
                ${product.name}
              </h3>

              <p class="product-description">
                ${product.description}
              </p>


              <div class="product-bottom">

                <strong class="product-price">
                  ${formatPrice(product.price)}
                </strong>

                <button
                  type="button"
                  class="product-add"
                  data-add-cart="${product.id}"
                >

                  <i
                    data-lucide="plus"
                    width="17"
                  ></i>

                  Añadir

                </button>

              </div>

            </div>

          </article>

        `;

      }
    ).join("");


    /* =====================================================
       ICONOS LUCIDE
    ===================================================== */

    if (window.lucide) {
      lucide.createIcons();
    }


    /* =====================================================
       CLICK EN LA IMAGEN DEL PRODUCTO 3
    ===================================================== */

    const productImage3 =
      $("#product-image-3");


    if (productImage3) {

      productImage3.addEventListener(
        "click",
        (event) => {

          /*
             IMPORTANTE:
             Evita que el clic en la imagen
             interfiera con otras funciones.
          */

          event.preventDefault();
          event.stopPropagation();


          const images = [
            "tote1.jpeg",
            "tote2.jpeg",
            "tote3.jpeg"
          ];


          let currentIndex =
            Number(
              productImage3.dataset.imageIndex || 0
            );


          currentIndex++;


          if (currentIndex >= images.length) {
            currentIndex = 0;
          }


          /*
             Efecto suave
          */

          productImage3.style.opacity = "0";


          setTimeout(() => {

            productImage3.src =
              images[currentIndex];

            productImage3.dataset.imageIndex =
              currentIndex;

            productImage3.style.opacity = "1";

          }, 180);

        }
      );

    }

  }


  /* =========================================================
     TRANSICIÓN DE LA IMAGEN
  ========================================================= */

  const imageStyle = document.createElement("style");

  imageStyle.textContent = `
    .clickable-product-image {
      cursor: pointer;
      transition: opacity 0.18s ease;
    }

    .clickable-product-image:hover {
      opacity: 0.85;
    }
  `;

  document.head.appendChild(imageStyle);


  /* =========================================================
     NOTIFICACIONES
  ========================================================= */

  function showNotification(message) {

    let notification =
      $("#caoticco-notification");


    if (!notification) {

      notification =
        document.createElement("div");

      notification.id =
        "caoticco-notification";

      notification.className =
        "caoticco-notification";

      document.body.appendChild(notification);

    }


    notification.textContent = message;

    notification.classList.add("active");


    setTimeout(() => {

      notification.classList.remove("active");

    }, 2500);

  }


  /* =========================================================
     WHATSAPP — CONTINUAR COMPRA
  ========================================================= */

  const checkoutButton =
    $("#checkout-button");


  if (checkoutButton) {

    checkoutButton.addEventListener(
      "click",
      () => {

        if (cart.length === 0) {

          showNotification(
            "Tu carrito está vacío."
          );

          return;
        }


        let message =
          "Hola, quiero comprar en CAOTICCO.%0A%0A";


        cart.forEach((item) => {

          message +=
            `• ${item.name} x${item.quantity} — ${formatPrice(
              item.price * item.quantity
            )}%0A`;

        });


        message +=
          `%0ATotal: ${formatPrice(
            getCartTotal()
          )}`;


        const whatsappURL =
          `https://wa.me/?text=${message}`;


        window.open(
          whatsappURL,
          "_blank"
        );

      }
    );

  }


  /* =========================================================
     AUTH / LOGIN
  ========================================================= */

  const authModal =
    $("#auth-modal");

  const authOpen =
    $("#auth-open");

  const authClose =
    $("#auth-close");


  if (authOpen && authModal) {

    authOpen.addEventListener(
      "click",
      () => {

        authModal.classList.add("active");

      }
    );

  }


  if (authClose && authModal) {

    authClose.addEventListener(
      "click",
      () => {

        authModal.classList.remove("active");

      }
    );

  }


  if (authModal) {

    authModal.addEventListener(
      "click",
      (event) => {

        if (event.target === authModal) {

          authModal.classList.remove("active");

        }

      }
    );

  }


  /* =========================================================
     CERRAR MODALES CON ESC
  ========================================================= */

  document.addEventListener(
    "keydown",
    (event) => {

      if (event.key === "Escape") {

        closeCart();

        if (authModal) {
          authModal.classList.remove("active");
        }

        if (mobileMenu) {
          mobileMenu.classList.remove("active");
          document.body.classList.remove("menu-open");
        }

      }

    }
  );


  /* =========================================================
     INICIALIZAR CARRITO
  ========================================================= */

  renderCart();


  /* =========================================================
     LUCIDE
  ========================================================= */

  if (window.lucide) {
    lucide.createIcons();
  }

});

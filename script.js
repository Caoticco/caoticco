/* =========================================================
   CAOTICCO — SCRIPT PRINCIPAL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     LUCIDE ICONS
  ======================================================= */

  if (window.lucide) {
    lucide.createIcons();
  }


  /* =======================================================
     UTILIDADES
  ======================================================= */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    Array.from(parent.querySelectorAll(selector));

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0
    }).format(price);
  };


  /* =======================================================
     ALTURA REAL DEL VIEWPORT
     Soluciona problemas de 100vh en móviles
  ======================================================= */

  function updateViewportHeight() {
    document.documentElement.style.setProperty(
      "--vh",
      `${window.innerHeight * 0.01}px`
    );
  }

  updateViewportHeight();

  let resizeTimeout;

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(() => {
      updateViewportHeight();
    }, 100);
  });


  /* =======================================================
     MENÚ MOBILE
  ======================================================= */

  const menuToggle = $("#menu-toggle");
  const mobileMenu = $("#mobile-menu");

  function closeMobileMenu() {
    if (!mobileMenu || !menuToggle) return;

    mobileMenu.classList.remove("open");

    menuToggle.setAttribute(
      "aria-expanded",
      "false"
    );

    menuToggle.setAttribute(
      "aria-label",
      "Abrir menú de navegación"
    );

    updateMenuIcon(false);
  }

  function updateMenuIcon(isOpen) {
    if (!menuToggle) return;

    const icon = $("i", menuToggle);

    if (!icon) return;

    icon.setAttribute(
      "data-lucide",
      isOpen ? "x" : "menu"
    );

    if (window.lucide) {
      lucide.createIcons();
    }
  }

  if (menuToggle && mobileMenu) {

    menuToggle.addEventListener("click", () => {

      const isOpen =
        mobileMenu.classList.toggle("open");

      menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      menuToggle.setAttribute(
        "aria-label",
        isOpen
          ? "Cerrar menú de navegación"
          : "Abrir menú de navegación"
      );

      updateMenuIcon(isOpen);
    });

    $$("#mobile-menu a").forEach((link) => {

      link.addEventListener("click", () => {
        closeMobileMenu();
      });

    });

    window.addEventListener("resize", () => {

      if (window.innerWidth >= 1024) {
        closeMobileMenu();
      }

    });
  }


  /* =======================================================
     ANIMACIONES REVEAL
  ======================================================= */

  const revealElements = $$(".reveal");

  if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add("in-view");

            observer.unobserve(entry.target);
          }

        });

      },
      {
        threshold: 0.12
      }
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });

  } else {

    revealElements.forEach((element) => {
      element.classList.add("in-view");
    });

  }


  /* =======================================================
     PRODUCTOS
  ======================================================= */

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
      name: "CAOTICCO CAP",
      price: 69900,
      description: "Gorra clásica con identidad CAOTICCO.",
      icon: "hat"
    }
  ];


  /* =======================================================
     CARRITO
  ======================================================= */

  let cart = [];

  try {

    const savedCart =
      localStorage.getItem("caoticco_cart");

    if (savedCart) {
      cart = JSON.parse(savedCart);
    }

  } catch (error) {

    console.warn(
      "No se pudo recuperar el carrito.",
      error
    );

    cart = [];
  }


  function saveCart() {

    try {

      localStorage.setItem(
        "caoticco_cart",
        JSON.stringify(cart)
      );

    } catch (error) {

      console.warn(
        "No se pudo guardar el carrito.",
        error
      );

    }
  }


  function getCartQuantity() {

    return cart.reduce(
      (total, item) => total + item.quantity,
      0
    );

  }


  function getCartTotal() {

    return cart.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0
    );

  }


  /* =======================================================
     ELEMENTOS DEL CARRITO
  ======================================================= */

  const cartButton = $("#cart-button");
  const cartModal = $("#cart-modal");
  const cartPanel = $(".cart-panel", cartModal || document);
  const cartItems = $("#cart-items");
  const cartCount = $("#cart-count");
  const cartTotal = $("#cart-total");
  const cartClose = $("#cart-close");
  const cartBackdrop = $(".cart-backdrop");
  const checkoutButton = $("#checkout-button");


  /* =======================================================
     ACTUALIZAR CONTADOR
  ======================================================= */

  function updateCartCount() {

    if (!cartCount) return;

    const quantity = getCartQuantity();

    cartCount.textContent = quantity;

    if (quantity > 0) {
      cartCount.classList.add("visible");
    } else {
      cartCount.classList.remove("visible");
    }
  }


  /* =======================================================
     ABRIR CARRITO
  ======================================================= */

  function openCart() {

    if (!cartModal) return;

    cartModal.classList.add("open");

    cartModal.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.classList.add("modal-open");

    renderCart();

    setTimeout(() => {

      const firstButton =
        $(".cart-close", cartModal);

      if (firstButton) {
        firstButton.focus();
      }

    }, 100);
  }


  /* =======================================================
     CERRAR CARRITO
  ======================================================= */

  function closeCart() {

    if (!cartModal) return;

    cartModal.classList.remove("open");

    cartModal.setAttribute(
      "aria-hidden",
      "true"
    );

    if (
      !authModal ||
      !authModal.classList.contains("open")
    ) {
      document.body.classList.remove("modal-open");
    }
  }


  /* =======================================================
     RENDER CARRITO
  ======================================================= */

  function renderCart() {

    if (!cartItems) return;

    updateCartCount();

    if (cart.length === 0) {

      cartItems.innerHTML = `
        <div class="empty-cart">
          <i data-lucide="shopping-bag"
             width="42"
             height="42"></i>

          <p>
            Tu carrito está vacío.
          </p>

          <button
            type="button"
            class="cta cta-wine"
            id="continue-shopping"
          >
            Explorar productos
          </button>
        </div>
      `;

      if (window.lucide) {
        lucide.createIcons();
      }

      const continueButton =
        $("#continue-shopping");

      if (continueButton) {

        continueButton.addEventListener(
          "click",
          () => closeCart()
        );

      }

    } else {

      cartItems.innerHTML = "";

      cart.forEach((item) => {

        const article =
          document.createElement("article");

        article.className = "cart-item";

        article.dataset.id = item.id;

        article.innerHTML = `
          <div class="cart-item-image">
            <i data-lucide="${item.icon || "package"}"
               width="30"
               height="30"></i>
          </div>

          <div class="cart-item-info">

            <h3 class="cart-item-name">
              ${escapeHTML(item.name)}
            </h3>

            <span class="cart-item-price">
              ${formatPrice(item.price)}
            </span>

            <div class="cart-item-controls">

              <button
                type="button"
                class="quantity-button decrease"
                data-id="${item.id}"
                aria-label="Disminuir cantidad"
              >
                −
              </button>

              <span class="quantity-value">
                ${item.quantity}
              </span>

              <button
                type="button"
                class="quantity-button increase"
                data-id="${item.id}"
                aria-label="Aumentar cantidad"
              >
                +
              </button>

            </div>

            <button
              type="button"
              class="cart-remove"
              data-id="${item.id}"
            >
              Eliminar
            </button>

          </div>

          <strong class="cart-item-total">
            ${formatPrice(item.price * item.quantity)}
          </strong>
        `;

        cartItems.appendChild(article);
      });

      $$(".increase", cartItems).forEach((button) => {

        button.addEventListener(
          "click",
          () => {

            const id =
              Number(button.dataset.id);

            changeQuantity(id, 1);
          }
        );

      });

      $$(".decrease", cartItems).forEach((button) => {

        button.addEventListener(
          "click",
          () => {

            const id =
              Number(button.dataset.id);

            changeQuantity(id, -1);
          }
        );

      });

      $$(".cart-remove", cartItems).forEach((button) => {

        button.addEventListener(
          "click",
          () => {

            const id =
              Number(button.dataset.id);

            removeFromCart(id);
          }
        );

      });

      if (window.lucide) {
        lucide.createIcons();
      }
    }

    if (cartTotal) {
      cartTotal.textContent =
        formatPrice(getCartTotal());
    }
  }


  /* =======================================================
     AÑADIR PRODUCTO
  ======================================================= */

  function addToCart(productId) {

    const product =
      products.find(
        (item) => item.id === productId
      );

    if (!product) return;

    const existing =
      cart.find(
        (item) => item.id === productId
      );

    if (existing) {

      existing.quantity += 1;

    } else {

      cart.push({
        ...product,
        quantity: 1
      });

    }

    saveCart();
    renderCart();

    showNotification(
      `${product.name} añadido al carrito`
    );
  }


  /* =======================================================
     CAMBIAR CANTIDAD
  ======================================================= */

  function changeQuantity(productId, amount) {

    const item =
      cart.find(
        (product) =>
          product.id === productId
      );

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {

      cart =
        cart.filter(
          (product) =>
            product.id !== productId
        );
    }

    saveCart();
    renderCart();
  }


  /* =======================================================
     ELIMINAR PRODUCTO
  ======================================================= */

  function removeFromCart(productId) {

    cart =
      cart.filter(
        (item) =>
          item.id !== productId
      );

    saveCart();
    renderCart();
  }


  /* =======================================================
     BOTONES "AÑADIR AL CARRITO"
  ======================================================= */

  $$("[data-product-id]").forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        const productId =
          Number(button.dataset.productId);

        if (!Number.isNaN(productId)) {
          addToCart(productId);
        }

      }
    );

  });


  /* =======================================================
     EVENTOS CARRITO
  ======================================================= */

  if (cartButton) {

    cartButton.addEventListener(
      "click",
      openCart
    );

  }

  if (cartClose) {

    cartClose.addEventListener(
      "click",
      closeCart
    );

  }

  if (cartBackdrop) {

    cartBackdrop.addEventListener(
      "click",
      closeCart
    );

  }

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

        showNotification(
          "El checkout estará disponible próximamente."
        );

      }
    );

  }


  /* =======================================================
     LOGIN / REGISTRO
  ======================================================= */

  const authModal = $("#auth-modal");
  const authClose = $("#auth-close");
  const authBackdrop = $(".auth-backdrop");

  const loginView = $("#login-view");
  const registerView = $("#register-view");

  const loginForm = $("#login-form");
  const registerForm = $("#register-form");

  const loginMessage = $("#login-message");
  const registerMessage = $("#register-message");

  const loginButton =
    $("#login-button");

  const mobileLoginButton =
    $("#mobile-login-button");

  const switchToRegister =
    $("#switch-to-register");

  const switchToLogin =
    $("#switch-to-login");


  /* =======================================================
     ABRIR LOGIN
  ======================================================= */

  function openAuth(view = "login") {

    if (!authModal) return;

    authModal.classList.add("open");

    authModal.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.classList.add("modal-open");

    showAuthView(view);

    setTimeout(() => {

      const input =
        view === "login"
          ? $("#login-email")
          : $("#register-name");

      if (input) {
        input.focus();
      }

    }, 150);
  }


  /* =======================================================
     CERRAR LOGIN
  ======================================================= */

  function closeAuth() {

    if (!authModal) return;

    authModal.classList.remove("open");

    authModal.setAttribute(
      "aria-hidden",
      "true"
    );

    if (
      !cartModal ||
      !cartModal.classList.contains("open")
    ) {
      document.body.classList.remove("modal-open");
    }
  }


  /* =======================================================
     CAMBIAR LOGIN / REGISTRO
  ======================================================= */

  function showAuthView(view) {

    if (!loginView || !registerView) return;

    loginView.classList.remove("active");
    registerView.classList.remove("active");

    if (view === "register") {

      registerView.classList.add("active");

    } else {

      loginView.classList.add("active");
    }

    clearAuthMessages();
  }


  /* =======================================================
     LIMPIAR MENSAJES
  ======================================================= */

  function clearAuthMessages() {

    if (loginMessage) {
      loginMessage.textContent = "";
      loginMessage.className = "auth-message";
    }

    if (registerMessage) {
      registerMessage.textContent = "";
      registerMessage.className = "auth-message";
    }
  }


  /* =======================================================
     EVENTOS AUTH
  ======================================================= */

  if (loginButton) {

    loginButton.addEventListener(
      "click",
      () => openAuth("login")
    );

  }

  if (mobileLoginButton) {

    mobileLoginButton.addEventListener(
      "click",
      () => {

        closeMobileMenu();

        openAuth("login");
      }
    );

  }

  if (authClose) {

    authClose.addEventListener(
      "click",
      closeAuth
    );

  }

  if (authBackdrop) {

    authBackdrop.addEventListener(
      "click",
      closeAuth
    );

  }

  if (switchToRegister) {

    switchToRegister.addEventListener(
      "click",
      () => showAuthView("register")
    );

  }

  if (switchToLogin) {

    switchToLogin.addEventListener(
      "click",
      () => showAuthView("login")
    );

  }


  /* =======================================================
     REGISTRO LOCAL
  ======================================================= */

  function getUsers() {

    try {

      const users =
        localStorage.getItem(
          "caoticco_users"
        );

      return users
        ? JSON.parse(users)
        : [];

    } catch (error) {

      console.warn(
        "No se pudieron recuperar los usuarios.",
        error
      );

      return [];
    }
  }


  function saveUsers(users) {

    localStorage.setItem(
      "caoticco_users",
      JSON.stringify(users)
    );
  }


  /* =======================================================
     FORMULARIO REGISTRO
  ======================================================= */

  if (registerForm) {

    registerForm.addEventListener(
      "submit",
      (event) => {

        event.preventDefault();

        const name =
          $("#register-name")?.value.trim();

        const email =
          $("#register-email")?.value
            .trim()
            .toLowerCase();

        const password =
          $("#register-password")?.value;

        const confirmPassword =
          $("#register-password-confirm")?.value;

        if (
          !name ||
          !email ||
          !password ||
          !confirmPassword
        ) {

          showRegisterMessage(
            "Completa todos los campos.",
            "error"
          );

          return;
        }

        if (!isValidEmail(email)) {

          showRegisterMessage(
            "Introduce un correo válido.",
            "error"
          );

          return;
        }

        if (password.length < 6) {

          showRegisterMessage(
            "La contraseña debe tener mínimo 6 caracteres.",
            "error"
          );

          return;
        }

        if (password !== confirmPassword) {

          showRegisterMessage(
            "Las contraseñas no coinciden.",
            "error"
          );

          return;
        }

        const users = getUsers();

        const exists =
          users.some(
            (user) =>
              user.email === email
          );

        if (exists) {

          showRegisterMessage(
            "Este correo ya está registrado.",
            "error"
          );

          return;
        }

        const newUser = {
          id: Date.now(),
          name,
          email,
          password,
          createdAt:
            new Date().toISOString()
        };

        users.push(newUser);

        saveUsers(users);

        registerForm.reset();

        showRegisterMessage(
          "Cuenta creada correctamente. Ahora puedes iniciar sesión.",
          "success"
        );

        setTimeout(() => {

          showAuthView("login");

          const loginEmail =
            $("#login-email");

          if (loginEmail) {
            loginEmail.value = email;
          }

        }, 1200);

      }
    );
  }


  /* =======================================================
     FORMULARIO LOGIN
  ======================================================= */

  if (loginForm) {

    loginForm.addEventListener(
      "submit",
      (event) => {

        event.preventDefault();

        const email =
          $("#login-email")?.value
            .trim()
            .toLowerCase();

        const password =
          $("#login-password")?.value;

        if (!email || !password) {

          showLoginMessage(
            "Completa tu correo y contraseña.",
            "error"
          );

          return;
        }

        const users = getUsers();

        const user =
          users.find(
            (item) =>
              item.email === email &&
              item.password === password
          );

        if (!user) {

          showLoginMessage(
            "Correo o contraseña incorrectos.",
            "error"
          );

          return;
        }

        localStorage.setItem(
          "caoticco_current_user",
          JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email
          })
        );

        showLoginMessage(
          `Bienvenido, ${user.name}.`,
          "success"
        );

        updateUserInterface();

        setTimeout(() => {
          closeAuth();
        }, 900);

      }
    );
  }


  /* =======================================================
     MENSAJES AUTH
  ======================================================= */

  function showLoginMessage(
    message,
    type = ""
  ) {

    if (!loginMessage) return;

    loginMessage.textContent =
      message;

    loginMessage.className =
      `auth-message ${type}`;
  }


  function showRegisterMessage(
    message,
    type = ""
  ) {

    if (!registerMessage) return;

    registerMessage.textContent =
      message;

    registerMessage.className =
      `auth-message ${type}`;
  }


  /* =======================================================
     MOSTRAR / OCULTAR CONTRASEÑA
  ======================================================= */

  $$(".password-toggle").forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          const inputId =
            button.dataset.target;

          const input =
            document.getElementById(
              inputId
            );

          if (!input) return;

          const isPassword =
            input.type === "password";

          input.type =
            isPassword
              ? "text"
              : "password";

          const icon =
            $("i", button);

          if (icon) {

            icon.setAttribute(
              "data-lucide",
              isPassword
                ? "eye-off"
                : "eye"
            );

            if (window.lucide) {
              lucide.createIcons();
            }
          }

        }
      );

    }
  );


  /* =======================================================
     VALIDAR EMAIL
  ======================================================= */

  function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      .test(email);

  }


  /* =======================================================
     USUARIO ACTUAL
  ======================================================= */

  function getCurrentUser() {

    try {

      const user =
        localStorage.getItem(
          "caoticco_current_user"
        );

      return user
        ? JSON.parse(user)
        : null;

    } catch {
      return null;
    }
  }


  function logout() {

    localStorage.removeItem(
      "caoticco_current_user"
    );

    updateUserInterface();

    showNotification(
      "Sesión cerrada correctamente."
    );
  }


  /* =======================================================
     ACTUALIZAR INTERFAZ DEL USUARIO
  ======================================================= */

  function updateUserInterface() {

    const user =
      getCurrentUser();

    const loginButton =
      $("#login-button");

    const mobileLoginButton =
      $("#mobile-login-button");

    if (user) {

      if (loginButton) {

        loginButton.innerHTML = `
          <i data-lucide="user-round"
             width="16"
             height="16"></i>

          <span class="login-text">
            ${escapeHTML(user.name)}
          </span>
        `;

        loginButton.dataset.loggedIn =
          "true";

        loginButton.setAttribute(
          "aria-label",
          "Cerrar sesión"
        );
      }

      if (mobileLoginButton) {

        mobileLoginButton.textContent =
          `Cerrar sesión (${user.name})`;

      }

      if (loginButton) {

        loginButton.onclick = () => {

          const confirmLogout =
            window.confirm(
              "¿Quieres cerrar sesión?"
            );

          if (confirmLogout) {
            logout();
          }

        };
      }

      if (mobileLoginButton) {

        mobileLoginButton.onclick = () => {

          closeMobileMenu();

          const confirmLogout =
            window.confirm(
              "¿Quieres cerrar sesión?"
            );

          if (confirmLogout) {
            logout();
          }

        };
      }

    } else {

      if (loginButton) {

        loginButton.innerHTML = `
          <i data-lucide="user-round"
             width="16"
             height="16"></i>

          <span class="login-text">
            Iniciar sesión
          </span>
        `;

        loginButton.onclick =
          () => openAuth("login");

        loginButton.setAttribute(
          "aria-label",
          "Iniciar sesión"
        );
      }

      if (mobileLoginButton) {

        mobileLoginButton.textContent =
          "Iniciar sesión";

        mobileLoginButton.onclick =
          () => {

            closeMobileMenu();

            openAuth("login");
          };
      }
    }

    if (window.lucide) {
      lucide.createIcons();
    }
  }


  /* =======================================================
     ESCAPE HTML
     Protección básica cuando mostramos nombres
  ======================================================= */

  function escapeHTML(value) {

    const div =
      document.createElement("div");

    div.textContent =
      String(value);

    return div.innerHTML;
  }


  /* =======================================================
     NOTIFICACIONES
  ======================================================= */

  function showNotification(message) {

    let notification =
      $("#caoticco-notification");

    if (!notification) {

      notification =
        document.createElement("div");

      notification.id =
        "caoticco-notification";

      notification.style.position =
        "fixed";

      notification.style.left =
        "50%";

      notification.style.bottom =
        "25px";

      notification.style.zIndex =
        "10000";

      notification.style.transform =
        "translate(-50%, 120px)";

      notification.style.padding =
        "0.9rem 1.25rem";

      notification.style.background =
        "#761d22";

      notification.style.color =
        "#fff";

      notification.style.border =
        "1px solid #a42b31";

      notification.style.fontFamily =
        '"Work Sans", sans-serif';

      notification.style.fontSize =
        "0.75rem";

      notification.style.fontWeight =
        "700";

      notification.style.textAlign =
        "center";

      notification.style.boxShadow =
        "0 15px 40px rgba(0,0,0,.45)";

      notification.style.transition =
        "transform .3s ease, opacity .3s ease";

      notification.style.opacity =
        "0";

      document.body.appendChild(
        notification
      );
    }

    notification.textContent =
      message;

    notification.style.opacity =
      "1";

    notification.style.transform =
      "translate(-50%, 0)";

    clearTimeout(
      notification._timeout
    );

    notification._timeout =
      setTimeout(() => {

        notification.style.opacity =
          "0";

        notification.style.transform =
          "translate(-50%, 120px)";

      }, 2800);
  }


  /* =======================================================
     CERRAR MODALES CON ESC
  ======================================================= */

  document.addEventListener(
    "keydown",
    (event) => {

      if (event.key !== "Escape") {
        return;
      }

      if (
        authModal &&
        authModal.classList.contains("open")
      ) {
        closeAuth();
        return;
      }

      if (
        cartModal &&
        cartModal.classList.contains("open")
      ) {
        closeCart();
        return;
      }

      if (
        mobileMenu &&
        mobileMenu.classList.contains("open")
      ) {
        closeMobileMenu();
      }

    }
  );


  /* =======================================================
     EVITAR FONDO AL HACER CLICK EN MODAL
  ======================================================= */

  if (authModal) {

    authModal.addEventListener(
      "click",
      (event) => {

        if (
          event.target === authModal
        ) {
          closeAuth();
        }

      }
    );
  }


  /* =======================================================
     NAVEGACIÓN SUAVE
  ======================================================= */

  $$('a[href^="#"]').forEach(
    (link) => {

      link.addEventListener(
        "click",
        (event) => {

          const href =
            link.getAttribute("href");

          if (
            !href ||
            href === "#"
          ) {
            return;
          }

          const target =
            document.querySelector(href);

          if (!target) return;

          event.preventDefault();

          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }
      );

    }
  );


  /* =======================================================
     CARRITO INICIAL
  ======================================================= */

  updateCartCount();
  renderCart();


  /* =======================================================
     USUARIO INICIAL
  ======================================================= */

  updateUserInterface();


  /* =======================================================
     CREAR PRODUCTOS SI EXISTE EL CONTENEDOR
     
     Esto permite que el JS funcione aunque todavía
     no hayas escrito manualmente las tarjetas en HTML.
  ======================================================= */

  const productsContainer =
    $("#products-container");

  if (productsContainer) {

    renderProducts();

  }


  function renderProducts() {

    if (!productsContainer) return;

    productsContainer.innerHTML =
      products
        .map(
          (product, index) => `
            <article class="product-card reveal in-view">

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

                <h3 class="product-name display">
                  ${escapeHTML(product.name)}
                </h3>

                <p class="product-description">
                  ${escapeHTML(product.description)}
                </p>

                <div class="product-bottom">

                  <strong class="product-price">
                    ${formatPrice(product.price)}
                  </strong>

                  <button
                    type="button"
                    class="product-add"
                    data-product-id="${product.id}"
                  >
                    <i
                      data-lucide="shopping-bag"
                      width="15"
                      height="15"
                    ></i>

                    Añadir
                  </button>

                </div>

              </div>

            </article>
          `
        )
        .join("");

    $$(".product-add", productsContainer)
      .forEach((button) => {

        button.addEventListener(
          "click",
          () => {

            const id =
              Number(button.dataset.productId);

            addToCart(id);
          }
        );

      });

    if (window.lucide) {
      lucide.createIcons();
    }
  }


  /* =======================================================
     DETECTAR CLIC FUERA DE MENÚ
  ======================================================= */

  document.addEventListener(
    "click",
    (event) => {

      if (
        !mobileMenu ||
        !menuToggle
      ) {
        return;
      }

      const clickedInsideMenu =
        mobileMenu.contains(
          event.target
        );

      const clickedToggle =
        menuToggle.contains(
          event.target
        );

      if (
        mobileMenu.classList.contains("open") &&
        !clickedInsideMenu &&
        !clickedToggle
      ) {
        closeMobileMenu();
      }

    }
  );


  /* =======================================================
     ACTUALIZAR CARRITO CUANDO CAMBIA OTRA PESTAÑA
  ======================================================= */

  window.addEventListener(
    "storage",
    (event) => {

      if (
        event.key ===
        "caoticco_cart"
      ) {

        try {

          cart =
            event.newValue
              ? JSON.parse(event.newValue)
              : [];

          renderCart();

        } catch {
          cart = [];
        }
      }

      if (
        event.key ===
        "caoticco_current_user"
      ) {

        updateUserInterface();
      }

    }
  );


  /* =======================================================
     LOG INICIAL
  ======================================================= */

  console.log(
    "%cCAOTICCO",
    `
      color:#a42b31;
      font-size:30px;
      font-weight:900;
      font-family:Arial;
    `
  );

  console.log(
    "%cCultura en movimiento.",
    `
      color:#f4f0eb;
      font-size:14px;
      font-family:Arial;
    `
  );

});


    /* Cerrar menú al seleccionar un enlace */

    document
      .querySelectorAll("#mobile-menu a")
      .forEach((link) => {

        link.addEventListener("click", () => {
          mobileMenu.classList.remove("open");

          menuToggle.setAttribute(
            "aria-expanded",
            "false"
          );

          menuToggle.setAttribute(
            "aria-label",
            "Abrir menú de navegación"
          );
        });

      });
  }


  /* =========================
     ANIMACIONES AL HACER SCROLL
  ========================= */

  const revealElements =
    document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add(
              "in-view"
            );

            observer.unobserve(
              entry.target
            );
          }

        });

      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });

  } else {

    revealElements.forEach((element) => {
      element.classList.add("in-view");
    });

  }


  /* =========================
     ALTURA REAL DEL VIEWPORT
  ========================= */

  function updateViewportHeight() {

    const viewportHeight =
      window.innerHeight * 0.01;

    document.documentElement.style.setProperty(
      "--vh",
      `${viewportHeight}px`
    );
  }


  updateViewportHeight();


  /* Actualizar al cambiar tamaño */

  window.addEventListener(
    "resize",
    updateViewportHeight,
    { passive: true }
  );


  /* Actualizar al cambiar orientación */

  window.addEventListener(
    "orientationchange",
    () => {
      setTimeout(
        updateViewportHeight,
        150
      );
    },
    { passive: true }
  );


  /* =========================
     CERRAR MENÚ SI PASAMOS A DESKTOP
  ========================= */

  window.addEventListener(
    "resize",
    () => {

      if (
        window.innerWidth >= 1024 &&
        mobileMenu &&
        menuToggle
      ) {

        mobileMenu.classList.remove(
          "open"
        );

        menuToggle.setAttribute(
          "aria-expanded",
          "false"
        );

        menuToggle.setAttribute(
          "aria-label",
          "Abrir menú de navegación"
        );
      }

    },
    { passive: true }
  );
});

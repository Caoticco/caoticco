<?php
session_start();

$error = $_SESSION['login_error'] ?? '';
unset($_SESSION['login_error']);
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>CAOTICCO — Iniciar sesión</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link
        href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Work+Sans:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
    >

    <style>
        :root {
            --ink: #080707;
            --coal: #151111;
            --paper: #f4f0eb;
            --wine: #761d22;
            --wine-bright: #a42b31;
            --line: rgba(244, 240, 235, 0.16);
            --muted: rgba(244, 240, 235, 0.6);
            --danger: #d65a5a;
        }

        * {
            box-sizing: border-box;
        }

        html {
            scroll-behavior: smooth;
        }

        body {
            margin: 0;
            min-width: 320px;

            background: var(--ink);
            color: var(--paper);

            font-family: "Work Sans", sans-serif;

            -webkit-font-smoothing: antialiased;
        }

        body::before {
            content: "";

            position: fixed;
            inset: 0;

            z-index: 999;

            pointer-events: none;

            opacity: 0.07;

            background-image:
                radial-gradient(
                    rgba(255,255,255,0.75) 0.55px,
                    transparent 0.6px
                );

            background-size: 5px 5px;

            mix-blend-mode: soft-light;
        }

        .display {
            font-family: "Barlow Condensed", sans-serif;

            text-transform: uppercase;

            letter-spacing: -0.04em;
        }


        /* =========================
           CONTENEDOR
        ========================= */

        .login-page {
            min-height: 100vh;
            min-height: 100dvh;

            display: flex;
            align-items: center;
            justify-content: center;

            padding: 2rem 1rem;

            background:
                radial-gradient(
                    circle at center,
                    rgba(118, 29, 34, 0.14),
                    transparent 45%
                ),
                var(--ink);
        }


        /* =========================
           TARJETA
        ========================= */

        .login-card {
            position: relative;

            width: min(100%, 480px);

            padding: 3rem;

            border: 1px solid var(--line);

            background:
                linear-gradient(
                    145deg,
                    rgba(30, 23, 24, 0.97),
                    rgba(16, 13, 14, 0.99)
                );

            box-shadow:
                0 25px 80px rgba(0, 0, 0, 0.55);
        }

        .login-card::before {
            content: "";

            position: absolute;

            top: -1px;
            left: 2rem;

            width: 80px;
            height: 3px;

            background: var(--wine-bright);
        }


        /* =========================
           MARCA
        ========================= */

        .brand {
            display: flex;
            align-items: center;
            justify-content: center;

            gap: 0.7rem;

            margin-bottom: 2.8rem;

            color: var(--wine-bright);

            font-family: "Barlow Condensed", sans-serif;

            font-size: 0.72rem;
            font-weight: 900;

            letter-spacing: 0.25em;
        }

        .brand-line {
            width: 35px;
            height: 1px;

            background: var(--wine-bright);
        }


        /* =========================
           TITULO
        ========================= */

        .eyebrow {
            margin: 0 0 0.6rem;

            color: var(--wine-bright);

            font-size: 0.65rem;
            font-weight: 700;

            letter-spacing: 0.18em;

            text-transform: uppercase;
        }

        .title {
            margin: 0;

            font-size: clamp(4rem, 13vw, 6rem);

            font-weight: 900;

            line-height: 0.76;
        }

        .description {
            margin: 1.5rem 0 2rem;

            color: rgba(244, 240, 235, 0.55);

            font-size: 0.8rem;

            line-height: 1.7;
        }


        /* =========================
           FORMULARIO
        ========================= */

        .login-form {
            display: flex;
            flex-direction: column;

            gap: 1.15rem;
        }

        .field {
            display: flex;
            flex-direction: column;

            gap: 0.5rem;
        }

        .field label {
            color: rgba(244, 240, 235, 0.75);

            font-size: 0.65rem;
            font-weight: 700;

            letter-spacing: 0.1em;

            text-transform: uppercase;
        }

        .input {
            width: 100%;

            min-height: 3.3rem;

            padding: 0.85rem 1rem;

            border: 1px solid var(--line);

            outline: none;

            background: #0a0909;

            color: var(--paper);

            font-size: 0.82rem;

            transition:
                border-color 0.2s ease,
                background 0.2s ease;
        }

        .input::placeholder {
            color: rgba(244, 240, 235, 0.25);
        }

        .input:focus {
            border-color: var(--wine-bright);

            background: #100c0d;
        }


        /* =========================
           OPCIONES
        ========================= */

        .options {
            display: flex;
            align-items: center;
            justify-content: space-between;

            gap: 1rem;

            margin-top: -0.15rem;
        }

        .remember {
            display: flex;
            align-items: center;

            gap: 0.5rem;

            color: rgba(244, 240, 235, 0.5);

            font-size: 0.67rem;
        }

        .remember input {
            width: 15px;
            height: 15px;

            accent-color: var(--wine-bright);
        }

        .forgot {
            color: var(--wine-bright);

            font-size: 0.65rem;
            font-weight: 700;

            text-transform: uppercase;
        }

        .forgot:hover {
            color: #d44b52;
        }


        /* =========================
           BOTONES
        ========================= */

        .button {
            width: 100%;

            min-height: 3.4rem;

            display: inline-flex;
            align-items: center;
            justify-content: center;

            gap: 0.6rem;

            border: 1px solid var(--wine);

            background: var(--wine);

            color: #fff;

            font-size: 0.7rem;
            font-weight: 800;

            letter-spacing: 0.12em;

            text-transform: uppercase;

            cursor: pointer;

            transition:
                background 0.2s ease,
                border-color 0.2s ease,
                transform 0.2s ease;
        }

        .button:hover {
            border-color: var(--wine-bright);

            background: var(--wine-bright);

            transform: translateY(-2px);
        }

        .button:active {
            transform: scale(0.98);
        }


        /* =========================
           REGISTRO
        ========================= */

        .register-area {
            margin-top: 2rem;

            padding-top: 1.5rem;

            border-top: 1px solid rgba(244, 240, 235, 0.08);

            text-align: center;
        }

        .register-text {
            margin: 0 0 0.9rem;

            color: rgba(244, 240, 235, 0.42);

            font-size: 0.68rem;
        }

        .register-button {
            width: 100%;

            min-height: 3.2rem;

            display: flex;
            align-items: center;
            justify-content: center;

            border: 1px solid var(--line);

            background: transparent;

            color: var(--paper);

            font-size: 0.68rem;
            font-weight: 800;

            letter-spacing: 0.12em;

            text-transform: uppercase;

            transition:
                background 0.2s ease,
                border-color 0.2s ease,
                color 0.2s ease;
        }

        .register-button:hover {
            border-color: var(--paper);

            background: rgba(255,255,255,0.06);

            color: #fff;
        }


        /* =========================
           ERROR
        ========================= */

        .error {
            margin-bottom: 1rem;

            padding: 0.8rem 1rem;

            border: 1px solid rgba(214, 90, 90, 0.35);

            background: rgba(214, 90, 90, 0.08);

            color: var(--danger);

            font-size: 0.7rem;

            line-height: 1.5;
        }


        /* =========================
           MOBILE
        ========================= */

        @media (max-width: 600px) {

            .login-page {
                align-items: flex-start;

                padding: 1rem;
            }

            .login-card {
                margin-top: 1.5rem;

                padding: 2rem 1.25rem 1.5rem;
            }

            .login-card::before {
                left: 1.25rem;
            }

            .brand {
                margin-bottom: 2.4rem;
            }

            .title {
                font-size: clamp(3.7rem, 17vw, 5rem);
            }

            .options {
                align-items: flex-start;

                flex-direction: column;
            }

            .login-form {
                gap: 1rem;
            }

        }
    </style>
</head>

<body>

<main class="login-page">

    <section class="login-card">

        <!-- MARCA -->

        <div class="brand">

            <span class="brand-line"></span>

            CAOTICCO

            <span class="brand-line"></span>

        </div>


        <!-- TITULO -->

        <header>

            <p class="eyebrow">
                Bienvenido de nuevo
            </p>

            <h1 class="title display">
                INICIAR<br>
                SESIÓN
            </h1>

            <p class="description">
                Accede a tu cuenta para continuar
                dentro de CAOTICCO.
            </p>

        </header>


        <!-- ERROR PHP -->

        <?php if (!empty($error)): ?>

            <div class="error">
                <?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?>
            </div>

        <?php endif; ?>


        <!-- LOGIN -->

        <form
            class="login-form"
            action="procesar_login.php"
            method="POST"
        >

            <div class="field">

                <label for="email">
                    Correo electrónico
                </label>

                <input
                    class="input"
                    type="email"
                    id="email"
                    name="email"
                    placeholder="tu@email.com"
                    autocomplete="email"
                    required
                >

            </div>


            <div class="field">

                <label for="password">
                    Contraseña
                </label>

                <input
                    class="input"
                    type="password"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    autocomplete="current-password"
                    required
                >

            </div>


            <div class="options">

                <label class="remember">

                    <input
                        type="checkbox"
                        name="recordarme"
                        value="1"
                    >

                    Recordarme

                </label>


                <a
                    href="recuperar.php"
                    class="forgot"
                >
                    ¿Olvidaste tu contraseña?
                </a>

            </div>


            <!-- BOTÓN LOGIN -->

            <button
                type="submit"
                class="button"
            >

                INICIAR SESIÓN

                <span>→</span>

            </button>

        </form>


        <!-- REGISTRO -->

        <div class="register-area">

            <p class="register-text">
                ¿Todavía no tienes una cuenta?
            </p>

            <a
                href="registro.php"
                class="register-button"
            >
                CREAR UNA CUENTA
            </a>

        </div>

    </section>

</main>

</body>
</html>

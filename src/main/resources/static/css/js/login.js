const tokenKey = "token";
const message = document.getElementById("formMessage");

function showMessage(text, isError = false) {
    message.textContent = text;
    message.classList.toggle("is-error", isError);
    message.classList.toggle("is-success", !isError);
}

async function submitAuth(event, endpoint, isRegister) {
    event.preventDefault();
    const button = event.currentTarget.querySelector("button[type=submit]");
    button.disabled = true;
    showMessage("Conectando…");
    const payload = {
        username: document.getElementById("username").value.trim(),
        password: document.getElementById("password").value
    };
    if (isRegister) payload.email = document.getElementById("email").value.trim();

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify(payload)
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            if (!isRegister && (response.status === 401 || response.status === 403)) {
                throw new Error("Usuario o contraseña inválidos.");
            }
            if (isRegister && response.status === 409) {
                throw new Error("Ese usuario o correo ya está registrado.");
            }
            if (response.status === 400 || response.status === 422) {
                throw new Error("Revisa los datos ingresados e inténtalo de nuevo.");
            }
            throw new Error("No pudimos completar la solicitud. Inténtalo de nuevo.");
        }
        if (!data.token) throw new Error("No pudimos iniciar tu sesión. Inténtalo de nuevo.");
        localStorage.setItem(tokenKey, data.token);
        window.location.assign("/dashboard");
    } catch (error) {
        showMessage(error instanceof TypeError
            ? "No pudimos conectarnos. Revisa tu conexión e inténtalo de nuevo."
            : (error.message || "No pudimos completar la solicitud. Inténtalo de nuevo."), true);
    } finally {
        button.disabled = false;
    }
}

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
if (loginForm) loginForm.addEventListener("submit", event => submitAuth(event, "/api/auth/login", false));
if (registerForm) registerForm.addEventListener("submit", event => submitAuth(event, "/api/auth/register", true));

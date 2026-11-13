window.TaskManager = (() => {
    const token = () => localStorage.getItem("token");
    const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
    async function api(path, options = {}) {
        const headers = new Headers(options.headers || {});
        const jwt = token();
        if (jwt) headers.set("Authorization", `Bearer ${jwt}`);
        if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
        headers.set("Accept", "application/json");
        let response;
        try {
            response = await fetch(path, { ...options, headers });
        } catch {
            throw new Error("No pudimos conectarnos. Revisa tu conexión e inténtalo de nuevo.");
        }
        if (response.status === 401 || response.status === 403) {
            throw new Error(response.status === 401
                ? "No se pudo validar tu sesión para esta acción. Inténtalo de nuevo."
                : "No tienes permiso para realizar esta acción.");
        }
        if (!response.ok) {
            const method = (options.method || "GET").toUpperCase();
            const messages = {
                400: "Revisa la información ingresada e inténtalo de nuevo.",
                404: "No encontramos ese elemento. Actualiza la página e inténtalo de nuevo.",
                422: "Revisa la información ingresada e inténtalo de nuevo.",
                500: "Algo salió mal al procesar tu solicitud. Inténtalo de nuevo más tarde."
            };
            if (response.status === 409 && method === "DELETE" && path.startsWith("/api/projects/")) {
                throw new Error("No puedes borrar este proyecto porque tiene tareas asociadas. Elimina esas tareas primero.");
            }
            if (response.status === 409) throw new Error("No se pudo completar porque hay información relacionada.");
            throw new Error(messages[response.status] || "No pudimos completar la acción. Inténtalo de nuevo.");
        }
        if (response.status === 204) return null;
        return response.json();
    }
    function showMessage(element, text, error = false) {
        if (!element) return;
        element.textContent = text || "";
        element.classList.toggle("is-error", error);
        element.classList.toggle("is-success", Boolean(text) && !error);
    }
    document.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll("[data-logout]").forEach(button => button.addEventListener("click", () => {
            localStorage.removeItem("token");
            window.location.assign("/login");
        }));
    });
    return { api, token, escapeHtml, showMessage };
})();

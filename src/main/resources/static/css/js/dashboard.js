let dashboardProjects = [];
let dashboardTasks = [];

async function loadDashboard() {
    try {
        [dashboardProjects, dashboardTasks] = await Promise.all([
            TaskManager.api("/api/projects"),
            TaskManager.api("/api/tasks")
        ]);
        const pending = dashboardTasks.filter(task => task.status !== "DONE");
        const done = dashboardTasks.length - pending.length;
        document.getElementById("projectCount").textContent = dashboardProjects.length;
        document.getElementById("pendingTaskCount").textContent = pending.length;
        document.getElementById("doneTaskCount").textContent = done;
        document.getElementById("taskProgress").textContent = dashboardTasks.length ? `${dashboardTasks.length} tareas en total` : "Aún no hay tareas creadas";
        renderProjects();
        renderPendingTasks(pending);
        TaskManager.showMessage(document.querySelector(".dashboard-message"), "");
    } catch (error) {
        TaskManager.showMessage(document.querySelector(".dashboard-message"), error.message, true);
        document.getElementById("activeProjects").innerHTML = '<p class="empty-state">No se pudieron cargar los proyectos.</p>';
        document.getElementById("pendingTasks").innerHTML = '<p class="empty-state">No se pudieron cargar las tareas.</p>';
    }
}

function renderProjects() {
    const list = document.getElementById("activeProjects");
    list.replaceChildren();
    if (!dashboardProjects.length) {
        list.innerHTML = '<p class="empty-state">Aún no tienes proyectos. Crea el primero con el formulario de arriba.</p>';
        return;
    }
    dashboardProjects.forEach(project => {
        const item = document.createElement("article");
        item.className = "dashboard-list-item";
        const copy = document.createElement("div");
        const name = document.createElement("h3");
        name.textContent = project.name;
        const description = document.createElement("p");
        description.className = "muted small";
        description.textContent = project.description || "Sin descripción";
        copy.append(name, description);
        item.append(copy);
        list.append(item);
    });
}

function renderPendingTasks(pending) {
    const list = document.getElementById("pendingTasks");
    list.replaceChildren();
    if (!pending.length) {
        list.innerHTML = '<p class="empty-state">¡Todo al día! No tienes tareas pendientes.</p>';
        return;
    }
    pending.forEach(task => {
        const item = document.createElement("article");
        item.className = "dashboard-list-item";
        const copy = document.createElement("div");
        const title = document.createElement("h3");
        title.textContent = task.title;
        const details = document.createElement("p");
        details.className = "muted small";
        details.textContent = [task.projectName, task.status === "IN_PROGRESS" ? "En progreso" : "Por hacer", task.dueDate ? `Vence ${task.dueDate}` : ""].filter(Boolean).join(" · ");
        copy.append(title, details);
        const priority = document.createElement("span");
        priority.className = `priority priority-${String(task.priority || "medium").toLowerCase()}`;
        priority.textContent = task.priority || "Sin prioridad";
        item.append(copy, priority);
        list.append(item);
    });
}

loadDashboard();

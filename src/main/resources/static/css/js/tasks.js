const taskForm = document.getElementById("taskForm");
const taskTable = document.getElementById("taskTable");
const taskMessage = document.getElementById("taskMessage");
let tasksCache = [];
let projectsCache = [];

async function loadTaskProjects() {
    const select = document.getElementById("projectId");
    try {
        projectsCache = await TaskManager.api("/api/projects");
        select.replaceChildren(new Option("Selecciona un proyecto", ""));
        projectsCache.forEach(project => select.add(new Option(project.name, project.id)));
        if (!projectsCache.length) TaskManager.showMessage(taskMessage, "Crea primero un proyecto para poder registrar tareas.", true);
    } catch (error) { select.replaceChildren(new Option("No se pudieron cargar proyectos", "")); TaskManager.showMessage(taskMessage, error.message, true); }
}

function resetTaskForm() {
    taskForm.reset();
    document.getElementById("taskId").value = "";
    document.getElementById("taskFormTitle").textContent = "Nueva tarea";
    document.getElementById("taskSubmit").textContent = "Crear tarea";
    document.getElementById("cancelTaskEdit").hidden = true;
}

async function loadTasks() {
    const status = document.getElementById("taskListMessage");
    taskTable.innerHTML = '<tr><td colspan="7" class="empty-state">Cargando tareas…</td></tr>';
    try {
        tasksCache = await TaskManager.api("/api/tasks");
        taskTable.replaceChildren();
        if (!tasksCache.length) { taskTable.innerHTML = '<tr><td colspan="7" class="empty-state">Todavía no hay tareas.</td></tr>'; TaskManager.showMessage(status, ""); return; }
        tasksCache.forEach(task => {
            const row = document.createElement("tr");
            const statuses = ["TODO", "IN_PROGRESS", "DONE"].map(status => `<option value="${status}" ${task.status === status ? "selected" : ""}>${status === "TODO" ? "Por hacer" : status === "IN_PROGRESS" ? "En progreso" : "Hecha"}</option>`).join("");
            row.innerHTML = `<td><strong>${TaskManager.escapeHtml(task.title)}</strong><div class="muted small">${TaskManager.escapeHtml(task.description || "")}</div></td><td>${TaskManager.escapeHtml(task.projectName || "—")}</td><td><select class="status-select" data-status="${task.id}" aria-label="Estado de tarea">${statuses}</select></td><td><span class="priority priority-${TaskManager.escapeHtml((task.priority || "medium").toLowerCase())}">${TaskManager.escapeHtml(task.priority || "—")}</span></td><td>${TaskManager.escapeHtml(task.dueDate || "—")}</td><td>${TaskManager.escapeHtml(task.assignedUsername || "—")}</td><td class="row-actions"><button class="button button-secondary" data-edit-task="${task.id}">Editar</button><button class="button button-danger" data-delete-task="${task.id}">Eliminar</button></td>`;
            taskTable.append(row);
        });
        TaskManager.showMessage(status, "");
    } catch (error) { taskTable.innerHTML = '<tr><td colspan="7" class="empty-state">No se pudieron cargar las tareas.</td></tr>'; TaskManager.showMessage(status, error.message, true); }
}

taskForm.addEventListener("submit", async event => {
    event.preventDefault();
    const id = document.getElementById("taskId").value;
    const payload = {
        title: document.getElementById("title").value.trim(),
        description: document.getElementById("description").value.trim(),
        priority: document.getElementById("priority").value,
        dueDate: document.getElementById("dueDate").value || null,
        projectId: Number(document.getElementById("projectId").value),
    };
    try {
        await TaskManager.api(id ? `/api/tasks/${id}` : "/api/tasks", { method: id ? "PUT" : "POST", body: JSON.stringify(payload) });
        TaskManager.showMessage(taskMessage, id ? "Tarea actualizada." : "Tarea creada.");
        resetTaskForm(); await loadTasks();
    } catch (error) { TaskManager.showMessage(taskMessage, error.message, true); }
});

taskTable.addEventListener("change", async event => {
    const id = event.target.dataset.status;
    if (!id) return;
    try { await TaskManager.api(`/api/tasks/${id}/status`, { method: "PATCH", body: JSON.stringify({ status: event.target.value }) }); TaskManager.showMessage(taskMessage, "Estado actualizado."); await loadTasks(); }
    catch (error) { TaskManager.showMessage(taskMessage, error.message, true); await loadTasks(); }
});

taskTable.addEventListener("click", async event => {
    const editId = event.target.dataset.editTask;
    const deleteId = event.target.dataset.deleteTask;
    if (editId) {
        const task = tasksCache.find(item => String(item.id) === editId);
        if (!task) return;
        document.getElementById("taskId").value = task.id;
        document.getElementById("title").value = task.title || "";
        document.getElementById("description").value = task.description || "";
        document.getElementById("priority").value = task.priority || "MEDIUM";
        document.getElementById("dueDate").value = task.dueDate || "";
        document.getElementById("projectId").value = String(projectsCache.find(p => p.name === task.projectName)?.id || "");
        TaskManager.showMessage(taskMessage, "Se conserva la persona asignada actualmente.");
        document.getElementById("taskFormTitle").textContent = "Editar tarea";
        document.getElementById("taskSubmit").textContent = "Guardar cambios";
        document.getElementById("cancelTaskEdit").hidden = false;
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (deleteId && confirm("¿Eliminar esta tarea?")) {
        try { await TaskManager.api(`/api/tasks/${deleteId}`, { method: "DELETE" }); TaskManager.showMessage(taskMessage, "Tarea eliminada."); await loadTasks(); }
        catch (error) { TaskManager.showMessage(taskMessage, error.message, true); }
    }
});

document.getElementById("cancelTaskEdit").addEventListener("click", resetTaskForm);
document.getElementById("refreshTasks").addEventListener("click", loadTasks);
loadTaskProjects();
loadTasks();

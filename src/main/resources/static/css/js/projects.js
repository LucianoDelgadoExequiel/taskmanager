const projectForm = document.getElementById("projectForm");
const projectTable = document.getElementById("projectTable");
const projectMessage = document.getElementById("projectMessage");
let projectCache = [];

function resetProjectForm() {
    projectForm.reset();
    document.getElementById("projectId").value = "";
    document.getElementById("projectFormTitle").textContent = "Nuevo proyecto";
    document.getElementById("projectSubmit").textContent = "Crear proyecto";
    document.getElementById("cancelEdit").hidden = true;
}

async function loadProjects() {
    const status = document.getElementById("listMessage");
    projectTable.innerHTML = '<tr><td colspan="3" class="empty-state">Cargando…</td></tr>';
    try {
        projectCache = await TaskManager.api("/api/projects");
        projectTable.replaceChildren();
        if (!projectCache.length) {
            projectTable.innerHTML = '<tr><td colspan="3" class="empty-state">Todavía no hay proyectos. Crea el primero arriba.</td></tr>';
            TaskManager.showMessage(status, "");
            return;
        }
        projectCache.forEach(project => {
            const row = document.createElement("tr");
            row.innerHTML = `<td><strong>${TaskManager.escapeHtml(project.name)}</strong></td><td>${TaskManager.escapeHtml(project.description || "—")}</td><td class="row-actions"><button class="button button-secondary" data-edit="${project.id}">Editar</button><button class="button button-danger" data-delete="${project.id}">Eliminar</button></td>`;
            projectTable.append(row);
        });
        TaskManager.showMessage(status, "");
    } catch (error) {
        projectTable.innerHTML = '<tr><td colspan="3" class="empty-state">No se pudieron cargar los proyectos.</td></tr>';
        TaskManager.showMessage(status, error.message, true);
    }
}

projectForm.addEventListener("submit", async event => {
    event.preventDefault();
    const id = document.getElementById("projectId").value;
    const payload = { name: document.getElementById("name").value.trim(), description: document.getElementById("description").value.trim() };
    try {
        await TaskManager.api(id ? `/api/projects/${id}` : "/api/projects", { method: id ? "PUT" : "POST", body: JSON.stringify(payload) });
        TaskManager.showMessage(projectMessage, id ? "Proyecto actualizado." : "Proyecto creado.");
        resetProjectForm();
        await loadProjects();
    } catch (error) { TaskManager.showMessage(projectMessage, error.message, true); }
});

projectTable.addEventListener("click", async event => {
    const editId = event.target.dataset.edit;
    const deleteId = event.target.dataset.delete;
    if (editId) {
        const project = projectCache.find(item => String(item.id) === editId);
        if (!project) return;
        document.getElementById("projectId").value = project.id;
        document.getElementById("name").value = project.name || "";
        document.getElementById("description").value = project.description || "";
        document.getElementById("projectFormTitle").textContent = "Editar proyecto";
        document.getElementById("projectSubmit").textContent = "Guardar cambios";
        document.getElementById("cancelEdit").hidden = false;
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (deleteId && confirm("¿Eliminar este proyecto? Si tiene tareas asociadas, primero tendrás que eliminarlas.")) {
        try { await TaskManager.api(`/api/projects/${deleteId}`, { method: "DELETE" }); TaskManager.showMessage(projectMessage, "Proyecto eliminado."); await loadProjects(); }
        catch (error) { TaskManager.showMessage(projectMessage, error.message, true); }
    }
});

document.getElementById("cancelEdit").addEventListener("click", resetProjectForm);
document.getElementById("refreshProjects").addEventListener("click", loadProjects);
loadProjects();

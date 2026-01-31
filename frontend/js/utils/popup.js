import { fetchDeleteSubtask } from "../api/subtask.api.js";
import { fetchDeleteTask } from "../api/task.api.js";
import reinit from "../index.js";
import { controlTaskSidebarState } from "../index/taskbar.js";
import { parseDate } from "./dates.js";

const popup = document.querySelector('.js-popup');

export function displayPopup(errorMsg, success) {
    popup.style.display = 'block';
    popup.innerHTML = errorMsg;

    if (success) {
        popup.classList.add('success');
        popup.classList.remove('danger');
    } else {
        popup.classList.add('danger');
        popup.classList.remove('success');
    }

    setTimeout(() => {
        popup.style.display = 'none';
    }, 2000);
}

const modal = document.querySelector('dialog');
const taskLayout = document.querySelector('.js-task-layout');

const deleteTaskBtn = document.querySelector('.js-delete-task-modal');

export function renderTaskModal(task) {
    if (!taskLayout.classList.contains('is-closed')) controlTaskSidebarState();
    modal.showModal();

    console.log("Modal task:", task);

    const {id, title, dueDate, completed, description, subtasks} = task;

    const { date, overdue } = parseDate(dueDate)

    let modalHTML = '';

    modalHTML += `
        <div class="task-title">
            <div class="modal-title">${title}</div>

            ${dueDate ? `
                <div class="modal-date">${date}</div>
            ` : ""}

            <div class="modal-completed">${completed ? "COMPLETED" : "INCOMPLETE"}</div>
        </div>
        <hr>
        <p>${description}</p>
        <hr>
        <ul class="task-subtasks">
    `;

    subtasks.forEach(subtask => {
        const { title } = subtask;

        modalHTML += `
            <li>${title}</li>
        `;
    })

    modalHTML += `</ul>`;

    document.querySelector('.js-task-information').innerHTML = modalHTML;

    // only have taskId, no subtaskId needed
    deleteTaskBtn.dataset.taskId = id;
    deleteTaskBtn.dataset.subtaskId = '';
}


export function renderSubtaskModal(subtask) {
    if (!taskLayout.classList.contains('is-closed')) controlTaskSidebarState();
    modal.showModal();

    console.log("Modal subtask: ", subtask);

    const {_id, taskId, title, completed} = subtask;

    let modalHTML = '';

    modalHTML += `
        <div class="task-title">
            <div class="modal-title">${title}</div>
            <div class="modal-completed">${completed ? "COMPLETED" : "INCOMPLETE"}</div>
        </div>
    `;

    document.querySelector('.js-task-information').innerHTML = modalHTML;

    deleteTaskBtn.dataset.taskId = taskId;
    deleteTaskBtn.dataset.subtaskId = _id;
}

export async function deleteTask(deleteEl) {
    const taskId = deleteEl.dataset.taskId;
    const subtaskId = deleteEl.dataset.subtaskId;

    try {
        let data = null;
        closeModal();

        if (subtaskId) {
            data = await fetchDeleteSubtask(taskId, subtaskId);
        } else {
            data = await fetchDeleteTask(taskId);
        }

        displayPopup(data.message, true);
        reinit();
    } catch (error) {
        displayPopup(error.message, false);
    }
}

export function closeModal() {
    modal.close();
}
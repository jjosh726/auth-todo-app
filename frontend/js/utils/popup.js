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


export function renderModal(task) {
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

    document.querySelector('.js-delete-task-modal').dataset.taskId = id;
}

export function closeModal() {
    modal.close();
}


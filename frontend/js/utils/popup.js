import { fetchCreateList, fetchDeleteList, fetchList, fetchListWithTaskCount, fetchUpdateList } from "../api/list.api.js";
import { fetchDeleteSubtask } from "../api/subtask.api.js";
import { fetchDeleteTask } from "../api/task.api.js";
import reinit from "../index.js";
import { controlTaskSidebarState } from "../index/taskbar.js";
import { parseDate } from "./dates.js";
import { resetFilters } from "./filter.js";

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

// ------------------TASK RELATED MODALS----------------------------------------

const modal = document.querySelector('dialog');
const taskLayout = document.querySelector('.js-task-layout');

const deleteTaskBtn = document.querySelector('.js-delete-task-modal');

export function renderTaskModal(task) {
    if (!taskLayout.classList.contains('is-closed')) controlTaskSidebarState();
    openModal('task');

    const {id, title, dueDate, completed, description, subtasks} = task;
    const { date } = parseDate(dueDate);

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
    openModal('task');

    // console.log("Modal subtask: ", subtask);

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
// ------------------ CREATE LIST RELATED MODALS-----------------------------
export function createListModal() {
    openModal('create-list');
}

export async function createList() {
    const createListModalEl = document.querySelector('.js-create-list-modal');

    const name = createListModalEl.querySelector('input[type="text"]').value;
    const color = createListModalEl.querySelector('input[type="color"]').value;

    
    try {
        await fetchCreateList({ name, color });
        
        closeModal();
        reinit();
    } catch (error) {
        displayPopup(error.message, false);
    }
}

// ------------------ DELETE LIST RELATED MODALS-----------------------------

export async function deleteListModal(listId) {
    openModal('delete-list');

    try {
        const { list } = await fetchListWithTaskCount(listId);

        const { name, color, taskCount } = list;

        let listModalHTML = `
        <div>
            <div 
            class="list-col"
            style="
                background-color: 
                ${color};"
            ></div>
            ${name}
        </div>
        <div>${taskCount}</div>
        `;

        document.querySelector('.js-list-information').innerHTML = listModalHTML;
        document.querySelector('.js-delete-list-modal-button').dataset.listId = listId;

    } catch (error) {
        displayPopup(error.message, false);
        closeModal();
    }
}

export async function deleteList(deleteListEl) {
    const listId = deleteListEl.dataset.listId;

    try {
        closeModal();

        const data = await fetchDeleteList(listId);

        displayPopup(data.message, true);
        resetFilters();
        reinit();
    } catch (error) {
        displayPopup(error.message, false);
    }
}

// ------------------ EDIT LIST RELATED MODALS-----------------------------

export async function editListModal(listId) {
    openModal('edit-list');

    try {
        const { list } = await fetchList(listId);
        const { name, color } = list;

        const editListModalEl = document.querySelector('.js-edit-list-modal');

        editListModalEl.querySelector('input[type="text"]').value = name;
        editListModalEl.querySelector('input[type="color"]').value = color;

        document.querySelector('.js-edit-list-modal-button').dataset.listId = listId;

    } catch (error) {
        displayPopup(error.message, false);
    }
    
}

export async function editList(editListEl) {
    const listId = editListEl.dataset.listId;

    try {
        closeModal();

        const { list } = await fetchList(listId);

        const editListModalEl = document.querySelector('.js-edit-list-modal');

        const name = editListModalEl.querySelector('input[type="text"]').value;
        const color = editListModalEl.querySelector('input[type="color"]').value;

        let body = {name, color};

        if (list.name === name) delete body.name;
        if (list.color === color) delete body.color;

        if (Object.keys(body).length === 0) {
            displayPopup('No changes were made.', true);
            return;
        } else {
            const data = await fetchUpdateList(listId, body);

            displayPopup(data.message, true);
            reinit();
        }

    } catch (error) {
        displayPopup(error.message, false);
    }
}

// ------------------ GENERAL MODAL FUNCTIONS -----------------------------

function openModal(mode) {
    for (const element of document.querySelector('dialog').children) {
        element.style.display = 'none';
    }
    
    switch (mode) {
        case 'task':
            document.querySelector('.js-task-modal').style.display = 'block';
            break;
        
        case 'create-list':
            document.querySelector('.js-create-list-modal').style.display = 'block';
            break;
        
        case 'delete-list':
            document.querySelector('.js-delete-list-modal').style.display = 'block';
            break;
        
        case 'edit-list':
            document.querySelector('.js-edit-list-modal').style.display = 'block';
            break;
    }
    
    modal.showModal();
}

export function closeModal() {
    modal.close();
}
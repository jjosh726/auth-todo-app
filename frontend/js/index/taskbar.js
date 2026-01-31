import { fetchCreateSubtask } from "../api/subtask.api.js";
import { fetchCreateTask } from "../api/task.api.js";
import reinit from "../index.js";
import { formatDateString, parseDate } from "../utils/dates.js";
import { displayPopup } from "../utils/popup.js";

// GLOBAL TASKBAR ACTIONS TRACKING
let taskbarActions = {
    task : null,
    subtasks : {
        updates : [],
        deletes : [],
        creates : [],
        completes : []
    }
}

// ----------------------TASKBAR UI ACTIONS------------------

const taskLayout = document.querySelector('.js-task-layout');

export function controlTaskSidebarState() {
    taskLayout.classList.toggle('is-closed');
}

// ----------------------TASK ACTIONS------------------

export function updateTask () {
    // find all subtasks by looping backwards from newSubtasks
}

export async function createTask() {
    
    const title = document.querySelector('.js-task-title').innerText;
    const description =  document.querySelector('.js-task-description').innerText;
    
    const listId = document.querySelector('.js-list-select').value;
    const dueDate = document.querySelector('.js-date-input').value;

    try {
        let body = {
            title, description, dueDate, listId
        }

        if (!listId) delete body.listId;
        if (!dueDate) delete body.dueDate;

        let { task } = await fetchCreateTask(body);

        let subtasks = [];

        document.querySelectorAll('.js-new-subtask-title')
            .forEach(el => {
                const title = el.innerText.trim();

                if (title) 
                    subtasks.push(() => fetchCreateSubtask(
                    task.id, 
                    { title }
                ));
            })

        await Promise.all(subtasks.map(fn => fn()));

        displayPopup('New task successfully created.', true);
        resetTaskbarForm();
        controlTaskSidebarState();

        reinit();
    } catch (error) {
        displayPopup(error.message, false);
    }
}

export function deleteTask() {

}

// ----------------------TASKBAR UI AUTO UPDATES------------------

export function renderTaskbarLists(lists) {
    let listSelectHTML = '';

    lists.forEach(list => {
        const { id, name } = list;

        listSelectHTML += `
            <option value="${id}" data-list-id="${id}">
                <span class="icon" aria-hidden="true">🐱</span
                ><span class="option-label">${name}</span>
            </option>
        `
    })

    document.querySelector('.js-list-select').innerHTML += listSelectHTML;
}

export function resetTaskbarForm() {
    // reset new subtasks
    newSubtasks = 0;

    taskbarActions.task = null;

    document.querySelector('.js-task-title').innerHTML = 'Enter title here';
    document.querySelector('.js-task-description').innerHTML = 'Enter description here';

    document.querySelector('.js-list-select').value = '';
    document.querySelector('.js-date-input').value = '';

    document.querySelector('.js-overdue-label').classList.remove('is-visible');

    document.querySelector('.js-new-subtasks').innerHTML = '';

    // create tasks attributes
    document.querySelector('.js-save-task').innerHTML = 'Save New Task';

    document.querySelector('.js-save-task')
        .addEventListener('click', createTask);

    document.querySelector('.js-save-task')
        .removeEventListener('click', updateTask);
}

export function renderTaskbar(task) {
    // reset new subtasks
    newSubtasks = 0;

    // save tasks attributes
    document.querySelector('.js-save-task').innerHTML = 'Save Changes';

    document.querySelector('.js-save-task')
        .removeEventListener('click', createTask);

    document.querySelector('.js-save-task')
        .addEventListener('click', updateTask);

    // parse task
    const { title, description, subtasks, dueDate, listId } = task;

    taskbarActions.task = task;

    // change title and description
    document.querySelector('.js-task-title').innerHTML = title;
    document.querySelector('.js-task-description').innerHTML = description;

    // change list select
    if (listId) {
        document.querySelector('.js-list-select').value = listId;
    } else {
        document.querySelector('.js-list-select').value = '';
    }

    // change date input
    document.querySelector('.js-date-input').value = formatDateString(dueDate);

    const dateInfo = parseDate(dueDate);

    if (dateInfo.overdue) {
        document.querySelector('.js-overdue-label').classList.add('is-visible');
    }  else {
        document.querySelector('.js-overdue-label').classList.remove('is-visible');
    }

    let subtasksHTML = '';

    subtasks.forEach(subtask => {
        const {_id, title, completed, taskId } = subtask;

        subtasksHTML += `
        <div class="js-sidebar-subtask ${completed ? "completed" : ""}" data-subtask-id="${_id}" data-task-id="${taskId}">
            <div class="bul js-subtask-bul">
                <div></div>
            </div>
            <div contenteditable>
                ${title}
            </div>
            <svg class="js-del-subtask del-subtask" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"></path></svg>
        </div>
        `;
    })
    
    document.querySelector('.js-new-subtasks').innerHTML = subtasksHTML;
}

// ----------------------SUBTASK ACTIONS------------------

// acts as temporary IDs
let newSubtasks = 0;

// COMPLETE SUBTASKS
export function completeSubtaskTaskbar(subtaskEl) {
    const subtaskId = subtaskEl.dataset.subtaskId;

    subtaskEl.classList.toggle('completed');

    taskbarActions.subtasks.completes.push(subtaskId);

    console.log('taskbar actions', taskbarActions);
}

// DELETE SUBTASKS
export function deleteSubtaskTaskbar(subtaskEl) {

    subtaskEl.remove();

    if (!subtaskEl.classList.contains('js-new-subtask')) {
        const subtaskId = subtaskEl.dataset.subtaskId;
        taskbarActions.subtasks.deletes.push(subtaskId);
    }

    console.log('taskbar actions', taskbarActions);
}


export function createNewSubtask() {
    newSubtasks++;

    document.querySelector('.js-new-subtasks').innerHTML += `
    <div class="js-sidebar-subtask js-new-subtask">
        <div class="bul js-subtask-bul">
            <div></div>
        </div>
        <div class="js-new-subtask-title js-new-subtask-${newSubtasks}-title" contenteditable>
            Enter Subtask title here
        </div>
        <svg class="js-del-subtask del-subtask" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"></path></svg>
    </div>
    `;

    const newElement = document.querySelector(`.js-new-subtask-${newSubtasks}-title`);

    // Get the current selection object and create range
    const selection = window.getSelection();
    const range = document.createRange();

    // 3. Select all the contents of the element
    range.selectNodeContents(newElement);

    selection.removeAllRanges();
    selection.addRange(range);

}
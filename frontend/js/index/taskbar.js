import { fetchCreateSubtask, fetchDeleteSubtask, fetchUpdateSubtask } from "../api/subtask.api.js";
import { fetchCreateTask, fetchUpdateTask } from "../api/task.api.js";
import { PLACEHOLDERS } from "../config/constants.js";
import reinit from "../index.js";
import { formatDateString, isDateEqual, isDateInvalid, parseDate } from "../utils/dates.js";
import { displayPopup } from "../utils/popup.js";

// GLOBAL TASKBAR ACTIONS TRACKING
let taskbarState = {
    activeTask : null,
    deletedSubtasks : []
}

const titleInput = document.querySelector('.js-task-title');
const descInput = document.querySelector('.js-task-description');
const listInput = document.querySelector('.js-list-select');
const dateInput = document.querySelector('.js-date-input');

// ----------------------TASKBAR UI ACTIONS------------------

const taskLayout = document.querySelector('.js-task-layout');

export function controlTaskSidebarState() {
    taskLayout.classList.toggle('is-closed');
}

// ----------------------TASK ACTIONS------------------

// taskbar.js
export function getActiveTask() {
    return taskbarState.activeTask;
}

export function validateTask(task) {
    if (!task.title) throw new Error('Please fill in title!');
    if (task.dueDate && isDateInvalid(task.dueDate)) throw new Error('Due date cannot be before today!');

    return task;
}


function readTaskbarForm() {
    return validateTask({
        title : titleInput.value, 
        description :  descInput.value,
        listId : listInput.value,
        dueDate : dateInput.value
    });
}


export async function handleSaveTask() {
    try {
        const task = readTaskbarForm();

        if (taskbarState.activeTask) {
            await updateTask(task);
        } else {
            await createTask(task);
        }

    } catch (error) {
        displayPopup(error.message, false);
    } 
}

// ----------------------- GET ALL SUBTASK INFORMATION ------------------------

function getUpdatedSubtasks(taskId) {
    let fetchQueries = [];

    // make update queries for old subtasks
    document.querySelectorAll('.js-sidebar-subtask')
        .forEach(subtask => {
            const subtaskId = subtask.dataset.subtaskId;

            const completed = subtask.classList.contains('completed');
            const title = subtask.innerText;
            
            let matchingSubtask = null;

            taskbarState.activeTask.subtasks.forEach(existingSubtask => {
                if (existingSubtask._id === subtaskId) {
                    matchingSubtask = existingSubtask;
                } 
            });

            if (!matchingSubtask) return;

            let subtaskBody = {};

            if (completed !== matchingSubtask.completed) subtaskBody.completed = completed;
            if (title !== matchingSubtask.title) subtaskBody.title = title;

            if (Object.keys(subtaskBody).length > 0) fetchQueries.push(() => {
                fetchUpdateSubtask(taskId, subtaskId, subtaskBody);
            })
        })
    
    return fetchQueries;
}

function getDeletedSubtasks(taskId) {
    let fetchQueries = [];

    // make delete queries by looping through taskbarState.subtasks.deletes
    taskbarState.deletedSubtasks.forEach(subtaskId => {
        fetchQueries.push(() => {
            fetchDeleteSubtask(taskId, subtaskId);
        });
    });

    return fetchQueries;
}

function getCreatedSubtasks(taskId) {
    let fetchQueries = [];

    // make create queries for new subtasks added
    document.querySelectorAll('.js-new-subtask')
        .forEach(subtask => {
            const title = subtask.innerText.trim();

            if (title === PLACEHOLDERS.subtaskTitle) {
                displayPopup('Please enter subtask title', false);
                return;
            }

            if (title) 
                fetchQueries.push(() => fetchCreateSubtask(
                    taskId, 
                    { title }
                ));
        });

    return fetchQueries;
}

async function updateTask(body) {
    try {
        const taskId = taskbarState.activeTask.id;

        // for updates, 
        // we only want the body to contain keys 
        // in which are changed from the original task
        for (const key in body) {
            if (key in taskbarState.activeTask) {

                // if the key is dueDate, delete it if they are the same
                // from a custom function in dates.js
                if (key === 'dueDate') {
                    if (isDateEqual(body[key], taskbarState.activeTask[key])) {
                        delete body[key];
                    }
                    continue;
                }

                // otherwise, a simple equality check will do
                if (body[key] === taskbarState.activeTask[key]) {
                    delete body[key];
                }
            }
        }

        if ("listId" in body && body.listId === '') body.listId = null; 

        if (Object.keys(body).length > 0) await fetchUpdateTask(taskId, body);

        let fetchQueries = [
            ...getUpdatedSubtasks(taskId), 
            ...getDeletedSubtasks(taskId), 
            ...getCreatedSubtasks(taskId)
        ];

        if (fetchQueries.length > 0) await Promise.all(fetchQueries.map(fn => fn()));

        displayPopup('Task successfully updated.', true);
        resetTaskbarForm();
        controlTaskSidebarState();
        reinit();
    } catch (error) {
        displayPopup(error.message, false);
    }
}

async function createTask(body) {
    try {
        if (!body.listId) delete body.listId;
        if (!body.dueDate) delete body.dueDate;

        let { task } = await fetchCreateTask(body);
        const taskId = task.id;

        let fetchQueries = [...getCreatedSubtasks(taskId)];

        if (fetchQueries.length > 0) await Promise.all(fetchQueries.map(fn => fn()));

        displayPopup('New task successfully created.', true);
        resetTaskbarForm();
        controlTaskSidebarState();
        reinit();
    } catch (error) {
        displayPopup(error.message, false);
    }
}

// ----------------------TASKBAR UI AUTO UPDATES------------------

const saveTaskBtn = document.querySelector('.js-save-task');

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

    document.querySelector('.js-user-lists').innerHTML = listSelectHTML;
}

export function resetTaskbarForm() {
    // reset new subtasks
    newSubtasks = 0;

    taskbarState = {
        activeTask : null,
        deletedSubtasks : []
    }

    titleInput.value = '';
    descInput.value = '';
    listInput.value = '';
    dateInput.value = '';

    document.querySelector('.js-overdue-label').classList.remove('is-visible');
    document.querySelector('.js-new-subtasks').innerHTML = '';

    saveTaskBtn.innerHTML = 'Save New Task';
    document.querySelector('.js-delete-task').style.display = 'none';
}

export function renderTaskbar(task) {
    resetTaskbarForm();

    saveTaskBtn.innerHTML = 'Save Changes';
    document.querySelector('.js-delete-task').style.display = 'flex';
    
    // parse task
    const { title, description, subtasks, dueDate, listId } = task;

    taskbarState.activeTask = task;

    // change title and description
    titleInput.value = title;
    descInput.value = description;

    // change list select
    if (listId) {
        listInput.value = listId;
    } else {
        listInput.value = '';
    }

    // change date input
    dateInput.value = formatDateString(dueDate);

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
        <div class="js-sidebar-subtask js-sidebar-subtask-${_id} ${completed ? "completed" : ""}" data-subtask-id="${_id}" data-task-id="${taskId}">
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

// COMPLETE SUBTASKS
export function completeSubtaskTaskbar(subtaskEl) {
    subtaskEl.classList.toggle('completed');
}

// DELETE SUBTASKS
export function deleteSubtaskTaskbar(subtaskEl) {
    subtaskEl.remove();

    if (!subtaskEl.classList.contains('js-new-subtask')) {
        const subtaskId = subtaskEl.dataset.subtaskId;
        taskbarState.deletedSubtasks.push(subtaskId);
    }
}


// acts as temporary IDs
let newSubtasks = 0;

export function createNewSubtask() {
    newSubtasks++;

    document.querySelector('.js-new-subtasks').innerHTML += `
    <div class="js-new-subtask">
        <div class="bul js-subtask-bul">
            <div></div>
        </div>
        <div class="js-new-subtask-title js-new-subtask-${newSubtasks}-title" contenteditable>
            ${PLACEHOLDERS.subtaskTitle}
        </div>
        <svg class="js-del-subtask del-subtask" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"></path></svg>
    </div>
    `;

    const newElement = document.querySelector(`.js-new-subtask-${newSubtasks}-title`);

    // Get the current selection object and create range
    const selection = window.getSelection();
    const range = document.createRange();

    // Select all the contents of the element
    range.selectNodeContents(newElement);

    selection.removeAllRanges();
    selection.addRange(range);

}
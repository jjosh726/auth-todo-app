import { formatDateString, parseDate } from "../utils/dates.js";

const taskLayout = document.querySelector('.js-task-layout');

let currentTask = null;

export function controlTaskSidebarState() {
    taskLayout.classList.toggle('is-closed');
}

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

export function resetTaskbar() {
    
}

export function renderTaskbar(task) {
    const { title, description, subtasks, dueDate, listId } = task;

    currentTask = task;

    if (listId) {
        document.querySelector('.js-list-select').value = listId;
    } else {
        document.querySelector('.js-list-select').value = 'unlisted';
    }

    document.querySelector('.js-task-title').innerHTML = title;
    document.querySelector('.js-task-description').innerHTML = description;

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
        </div>
        `;
    })
    
    document.querySelector('.js-new-subtasks').innerHTML = subtasksHTML;

    document.querySelectorAll('.js-subtask-bul')
        .forEach(subtask => {
            subtask.addEventListener('click', async () => {
                const completed = subtask.parentElement.classList.contains('completed');

                const subtaskId = subtask.parentElement.dataset.subtaskId;
                const taskId = subtask.parentElement.dataset.taskId;
                
                subtask.parentElement.classList.toggle('completed');
            })
        })
}

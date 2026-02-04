import { fetchSubtask, fetchUpdateSubtask } from "../api/subtask.api.js";
import { fetchTask, fetchUpdateTask, fetchUpdateTaskWithSubtasks } from "../api/task.api.js";
import { EMPTY_TASKS_SUGGESTIONS } from "../config/constants.js";
import reinit from "../index.js";
import { parseDate } from "../utils/dates.js";
import { getFilters } from "../utils/filter.js";
import { displayPopup, renderSubtaskModal, renderTaskModal } from "../utils/popup.js";
import { controlTaskSidebarState, renderTaskbar } from "./taskbar.js";

const taskLayout = document.querySelector('.js-task-layout');

export async function renderMain(lists, tasks) {
    const filters = getFilters();

    let mainTitle = '';

    if (filters.category) {
        mainTitle = filters.category;
    } else if (filters.listId) {
        try {
            const list = findMatchingList(lists, filters.listId);
            mainTitle = list.name;
        } catch (error) {
            displayPopup(error.message, false);
        }
    } else {
        mainTitle = 'all';
    }

    document.querySelector('.js-title').innerHTML = `
        ${mainTitle.charAt(0).toLocaleUpperCase() + mainTitle.slice(1)}
        <div class="num">${tasks.length}</div>
    `

    let tasksHTML = '';

    if (tasks.length === 0) {
        const taskSuggestionCount = EMPTY_TASKS_SUGGESTIONS.length;
        const randomNo = Math.floor(Math.random() * taskSuggestionCount);

        tasksHTML += EMPTY_TASKS_SUGGESTIONS[randomNo];
    }

    tasks.forEach(task => {
        // avoid confusing between taskId aand subtaskId
        const taskId = task.id;
        const { id, title, completed, subtasks, dueDate, listId } = task;

        let date, overdue;

        if (dueDate) {
            let dateInfo = parseDate(dueDate);

            date = dateInfo.date;
            overdue = dateInfo.overdue;
        }

        let list = null;
        if (listId) list = findMatchingList(lists, listId);

        tasksHTML += `
        <div class="task-container js-task js-task-${id}" data-task-id="${id}">
            <div class="task">
                <div>
                    <div 
                    class="list-col"
                    style="
                        background-color: 
                        ${list ? list.color : "var(--grey-3)"};"
                    >
                        <input class="js-complete-task" 
                        data-task-id="${id}" 
                        type="checkbox" ${completed ? "checked" : ""}
                        style="
                            accent-color: 
                            ${list ? list.color : "var(--grey-3)"};"
                        >
                    </div>
                    <div>${title}</div>
                    ${dueDate ? `
                        <div class="date ${overdue ? "overdue" : ""}">${dueDate ? date : ""}</div>
                    ` : ""}
                </div>
                <div class="js-edit-task-button" data-task-id="${id}">
                    <svg class="edit-task js-edit-task" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>

                    <svg class="del-task js-del-task" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                </div>
            </div>
            ${subtasks.length > 0 ? `
                <div class="subtasks-container" >
                    <h3>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-80q-50 0-85-35t-35-85q0-39 22.5-70t57.5-43v-334q-35-12-57.5-43T160-760q0-50 35-85t85-35q50 0 85 35t35 85q0 39-22.5 70T320-647v7q0 50 35 85t85 35h80q83 0 141.5 58.5T720-320v7q35 12 57.5 43t22.5 70q0 50-35 85t-85 35q-50 0-85-35t-35-85q0-39 22.5-70t57.5-43v-7q0-50-35-85t-85-35h-80q-34 0-64.5-10.5T320-480v167q35 12 57.5 43t22.5 70q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T320-200q0-17-11.5-28.5T280-240q-17 0-28.5 11.5T240-200q0 17 11.5 28.5T280-160Zm400 0q17 0 28.5-11.5T720-200q0-17-11.5-28.5T680-240q-17 0-28.5 11.5T640-200q0 17 11.5 28.5T680-160ZM280-720q17 0 28.5-11.5T320-760q0-17-11.5-28.5T280-800q-17 0-28.5 11.5T240-760q0 17 11.5 28.5T280-720Z"/></svg>
                        Subtasks
                    </h3>
                ` : ''}
        `;

        subtasks.forEach(subtask => {
            const subtaskId = subtask._id;
            const { title, completed } = subtask;

            tasksHTML += `
                <div class="subtask js-subtask js-subtask-${subtaskId}" data-subtask-id="${subtaskId}">
                    <div>
                        <div class="list-col" 
                        style="
                            background-color: 
                            ${list ? list.color : "var(--grey-3)"};"
                        >
                            <input 
                            data-subtask-id="${subtaskId}" class="js-complete-subtask" 
                            type="checkbox" ${completed ? "checked" : ""}
                            style="
                            accent-color: 
                            ${list ? list.color : "var(--grey-3)"};"
                            >
                        </div>
                        <div>${title}</div>
                    </div>
                    <div data-task-id="${taskId}" data-subtask-id="${subtaskId}">
                        <svg class="del-task js-del-subtask" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                    </div>
                </div>
            
            `;
        })

        tasksHTML += `
            ${subtasks.length > 0 ? `
                </div>
                ` : ''}
        </div>
        `;
    })

    document.querySelector('.js-tasks').innerHTML = tasksHTML;

    document.querySelectorAll('.js-edit-task')
        .forEach(button => {
            button.addEventListener('click', async () => {
                const taskId = button.parentElement.dataset.taskId;

                if (taskLayout.classList.contains('is-closed')) controlTaskSidebarState();

                if (!taskLayout.classList.contains('is-closed')) {
                    try {
                        const { task } = await fetchTask(taskId);
    
                        renderTaskbar(task);
                    } catch (error) {
                        displayPopup(error.message, false);
                    }
                }
            })
        });
    
    document.querySelectorAll('.js-del-task')
        .forEach(button => {
            button.addEventListener('click', async () => {
                const taskId = button.parentElement.dataset.taskId;

                try {
                    const { task } = await fetchTask(taskId);

                    renderTaskModal(task);
                } catch (error) {
                    displayPopup(error.message, false);
                }
            })
        })
    
    document.querySelectorAll('.js-del-subtask')
        .forEach(button => {
            button.addEventListener('click', async () => {
                const taskId = button.parentElement.dataset.taskId;
                const subtaskId = button.parentElement.dataset.subtaskId;

                try {
                    const { subtask } = await fetchSubtask(taskId, subtaskId);

                    renderSubtaskModal(subtask);
                } catch (error) {
                    displayPopup(error.message, false);
                }
            })
        })
    
    document.querySelectorAll('.js-complete-task')
        .forEach(checkbox => {
            checkbox.addEventListener('change', async () => {
                const taskId = checkbox.dataset.taskId;
                const completed = checkbox.checked;

                updateTaskCompletion(taskId, completed);
            })
        })
    
    document.querySelectorAll('.js-complete-subtask')
        .forEach(checkbox => {
            checkbox.addEventListener('change', async () => {
                const taskId = checkbox.closest('.js-task').dataset.taskId;
                const subtaskId = checkbox.dataset.subtaskId;

                const completed = checkbox.checked;

                updateSubtaskCompletion(taskId, subtaskId, completed);
            })
        })
}

async function updateTaskCompletion(taskId, completed) {
    try {
        const { task } = await fetchUpdateTaskWithSubtasks(taskId, { completed });
    
        let fetchQueries = [];
    
        // update all subtasks when task is completed
        if (task.subtasks && completed) {
            task.subtasks.forEach(subtask => {
    
                if (!subtask.completed)
                    fetchQueries.push(() => {
                        fetchUpdateSubtask(taskId, subtask._id, { completed : true });
                    });
    
            })
        }
    
        if (fetchQueries) {
            await Promise.all(fetchQueries.map(fn => fn()));
            reinit();
        }

        // if taskbar is open and all subtasks are updated, rerender the entire taskbar
        if (!taskLayout.classList.contains('is-closed') && fetchQueries.length > 0) {
            const taskInfo = await fetchTask(taskId);
            
            renderTaskbar(taskInfo.task);
        } 

    } catch (error) {
        displayPopup(error.message, false);
    }
}

async function updateSubtaskCompletion(taskId, subtaskId, completed) {
    try {
        await fetchUpdateSubtask(taskId, subtaskId, { completed });

        // if taskbar is open, update taskbar completion
        const sidebarSubtaskEl = document.querySelector(`.js-sidebar-subtask-${subtaskId}`);

        if (!taskLayout.classList.contains('is-closed') && sidebarSubtaskEl)
            sidebarSubtaskEl.classList.toggle('completed');

        // if all subtasks complete, complete the main task
        const subtaskElements = document.querySelectorAll(`.js-task-${taskId} .js-subtask`);
        
        if (subtaskElements) {
            let isAllSubtasksComplete = true;

            subtaskElements.forEach(subtask => {
                const completed = subtask.querySelector('.js-complete-subtask').checked;

                if (!completed) isAllSubtasksComplete = false;
            });
            
            const taskCheckbox = document.querySelector(`.js-task-${taskId} .js-complete-task`);

            if (isAllSubtasksComplete) {

                taskCheckbox.checked = true;
                await fetchUpdateTask(taskId, { completed : true});

            } else if (taskCheckbox.checked) {
                // if not all subtasks complete but task checkbox is check
                // uncheck and update
                taskCheckbox.checked = false;
                await fetchUpdateTask(taskId, { completed : false});
            }
        }


    } catch (error) {
        displayPopup(error.message, false);
    }
}

function findMatchingList(lists, listId) {
    return lists.filter(list => list.id === listId)[0];
}
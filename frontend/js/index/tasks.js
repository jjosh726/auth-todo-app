import { fetchSubtask } from "../api/subtask.api.js";
import { fetchTask } from "../api/task.api.js";
import { parseDate } from "../utils/dates.js";
import { displayPopup, renderSubtaskModal, renderTaskModal } from "../utils/popup.js";
import { controlTaskSidebarState, renderTaskbar } from "./taskbar.js";

const taskLayout = document.querySelector('.js-task-layout');

export function renderMain(tasks) {
    let tasksHTML = '';

    tasks.forEach(task => {
        // avoid confusing between taskId aand subtaskId
        const taskId = task.id;
        const { id, title, completed, subtasks, dueDate } = task;

        let date, overdue;

        if (dueDate) {
            let dateInfo = parseDate(dueDate);

            date = dateInfo.date;
            overdue = dateInfo.overdue;
        }

        tasksHTML += `
        <div class="task-container" data-task-id="${id}">
            <div class="task">
                <div>
                    <div class="list-col">
                        <input type="checkbox" name="" id="" ${completed ? "checked" : ""}>
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
                <div class="subtask" data-subtask-id="${subtaskId}">
                    <div>
                        <div class="list-col">
                        <input type="checkbox" name="" id="" ${completed ? "checked" : ""}>
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
}
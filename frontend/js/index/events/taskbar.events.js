import { completeSubtaskTaskbar, controlTaskSidebarState, createNewSubtask, getActiveTask, handleSaveTask, resetTaskbarForm } from "../taskbar.js";

// TASKBAR DOM EVENTS
const taskLayout = document.querySelector('.js-task-layout');
const subtasksContainer = document.querySelector('.js-new-subtasks');

const deleteTaskbarBtn = document.querySelector('.js-delete-task');
const saveTaskbarBtn = document.querySelector('.js-save-task');

document.querySelector('.js-close-task-button')
    .addEventListener('click', controlTaskSidebarState);

document.querySelector('.js-add-new-task')
    .addEventListener('click', () => {
        if (taskLayout.classList.contains('is-closed')) controlTaskSidebarState();
        resetTaskbarForm();
    });

document.querySelectorAll('.js-edit-task')
    .forEach(button => button.addEventListener('click', controlTaskSidebarState));

subtasksContainer.addEventListener('click', (e) => {
    const subtaskEl = e.target.closest('.js-sidebar-subtask');
    if (!subtaskEl) return;

    // COMPLETE SUBTASK
    if (e.target.closest('.js-subtask-bul')) {
        completeSubtaskTaskbar(subtaskEl);
        return;
    }

    // DELETE SUBTASK
    if (e.target.closest('.js-del-subtask')) {
        deleteSubtaskTaskbar(subtaskEl);
        return;
    }
});

deleteTaskbarBtn.addEventListener('click', () => {
    const task = getActiveTask();
    renderTaskModal(task);
})

saveTaskbarBtn.addEventListener('click', handleSaveTask);

// CREATE SUBTASK
document.querySelector('.js-create-new-subtask')
    .addEventListener('click', createNewSubtask);


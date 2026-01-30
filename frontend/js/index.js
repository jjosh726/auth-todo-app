import { fetchUserInfo } from "./api/auth.api.js";
import { fetchUserLists } from "./api/list.api.js";
import { fetchUserTasks } from "./api/task.api.js";
import { renderSidebar } from "./index/sidebar.js";
import { completeSubtaskTaskbar, controlTaskSidebarState, createNewSubtask, deleteSubtaskTaskbar, renderTaskbarLists, resetTaskbarForm } from "./index/taskbar.js";
import { renderMain } from "./index/tasks.js";
import { displayPopup } from "./utils/popup.js";

const userLink = document.querySelector('.js-user-link');
const loginLink = document.querySelector('.js-login-link');

const taskLayout = document.querySelector('.js-task-layout');

// GLOBAL DOM EVENTS
document.querySelector('.js-close-task-button')
    .addEventListener('click', controlTaskSidebarState);

document.querySelector('.js-add-new-task')
    .addEventListener('click', () => {
        if (taskLayout.classList.contains('is-closed')) controlTaskSidebarState();
        resetTaskbarForm();
    });

document.querySelectorAll('.js-edit-task')
    .forEach(button => button.addEventListener('click', controlTaskSidebarState));

// TASKBAR DOM EVENTS
const subtasksContainer = document.querySelector('.js-new-subtasks');

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

// CREATE SUBTASK
document.querySelector('.js-create-new-subtask')
    .addEventListener('click', createNewSubtask);

// INITIALIZATION
async function init() {
    try {
        const { user } = await fetchUserInfo();

        updateUserInfo(user);

        const [{ lists }, { tasks }] = await Promise.all([
            fetchUserLists(),
            fetchUserTasks()
        ]);

        renderSidebar(lists, tasks);
        renderTaskbarLists(lists);
        renderMain(tasks)

    } catch (error) {
        displayPopup(error.message, false);
    }
}


function updateUserInfo(user) {
    userLink.classList.toggle('is-invisible');
    loginLink.classList.toggle('is-invisible');

    userLink.innerHTML = user.username;
}

init();

export default init;
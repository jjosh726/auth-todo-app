import { fetchUserInfo } from "./api/auth.api.js";
import { fetchUserLists } from "./api/list.api.js";
import { fetchDeleteSubtask } from "./api/subtask.api.js";
import { fetchDeleteTask, fetchUserTasks } from "./api/task.api.js";
import { renderSidebar } from "./index/sidebar.js";
import { completeSubtaskTaskbar, controlTaskSidebarState, createNewSubtask,  deleteSubtaskTaskbar, getActiveTask, handleSaveTask, renderTaskbarLists, resetTaskbarForm } from "./index/taskbar.js";
import { renderMain } from "./index/tasks.js";
import { closeModal, displayPopup, renderTaskModal } from "./utils/popup.js";

// -----------------------GLOBAL DOM EVENTS-------------------

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





// MODAL DOM EVENTS
const deleteTaskBtn = document.querySelector('.js-delete-task-modal');

deleteTaskBtn.addEventListener('click', async () => {
        
        const taskId = deleteTaskBtn.dataset.taskId;
        const subtaskId = deleteTaskBtn.dataset.subtaskId;

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
    });

document.querySelector('.js-cancel-delete-modal')
    .addEventListener('click', closeModal)





// ---------------------INITIALIZATION--------------------------------
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

async function reinit() {
    try {
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




// -----------------USER INFORMATION-------------------------------
const userLink = document.querySelector('.js-user-link');
const loginLink = document.querySelector('.js-login-link');


function updateUserInfo(user) {
    userLink.classList.toggle('is-invisible');
    loginLink.classList.toggle('is-invisible');

    userLink.innerHTML = user.username;
}



// --------------MAIN FUNCTION + REINITIALIZATION EXPORT------------
init();

export default reinit;
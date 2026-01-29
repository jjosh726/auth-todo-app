import { fetchUserInfo } from "./api/auth.api.js";
import { fetchUserLists } from "./api/list.api.js";
import { fetchUserTasks } from "./api/task.api.js";
import { renderSidebar } from "./index/sidebar.js";
import { controlTaskSidebarState, renderTaskbarLists } from "./index/taskbar.js";
import { renderMain } from "./index/tasks.js";
import { displayPopup } from "./utils/popup.js";

const userLink = document.querySelector('.js-user-link');
const loginLink = document.querySelector('.js-login-link');

document.querySelector('.js-close-task-button')
    .addEventListener('click', controlTaskSidebarState);

document.querySelector('.js-add-new-task')
    .addEventListener('click', controlTaskSidebarState);

document.querySelectorAll('.js-edit-task')
    .forEach(button => button.addEventListener('click', controlTaskSidebarState));


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
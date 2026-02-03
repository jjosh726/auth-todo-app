import { fetchUserInfo } from "./api/auth.api.js";
import { fetchUserLists } from "./api/list.api.js";
import { fetchUserTasks } from "./api/task.api.js";
import { renderSidebar } from "./index/sidebar.js";
import { renderTaskbarLists } from "./index/taskbar.js";
import { renderMain } from "./index/tasks.js";
import { filterUserTasks } from "./utils/filter.js";
import { displayPopup } from "./utils/popup.js";

// ---------------------INITIALIZATION--------------------------------
async function init() {
    try {
        const { user } = await fetchUserInfo();

        updateUserInfo(user);

        if (!user) window.location.href = '/login.html';

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
        let [{ lists }, { tasks }] = await Promise.all([
            fetchUserLists(),
            fetchUserTasks()
        ]);

        renderSidebar(lists, tasks);

        tasks = filterUserTasks(tasks);
        renderMain(tasks);

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
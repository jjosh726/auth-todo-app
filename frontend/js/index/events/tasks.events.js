import { sortTaskModal } from "../../utils/popup.js";
import { controlTaskSidebarState, resetTaskbarForm } from "../taskbar.js";

const taskLayout = document.querySelector('.js-task-layout');

document.querySelector('.js-close-task-button')
    .addEventListener('click', controlTaskSidebarState);

document.querySelector('.js-add-new-task')
    .addEventListener('click', () => {
        if (taskLayout.classList.contains('is-closed')) controlTaskSidebarState();
        resetTaskbarForm();
    });

document.querySelector('.js-sort')
    .addEventListener('click', sortTaskModal);
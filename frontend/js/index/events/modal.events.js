import { closeModal, deleteTask } from "../../utils/popup.js";

// MODAL DOM EVENTS
const deleteTaskBtn = document.querySelector('.js-delete-task-modal');

deleteTaskBtn.addEventListener('click', () => {
    deleteTask(deleteTaskBtn);
});

document.querySelector('.js-cancel-delete-modal')
    .addEventListener('click', closeModal)


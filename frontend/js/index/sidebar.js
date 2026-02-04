import { filterUserTasks } from "../utils/filter.js";
import { deleteListModal } from "../utils/popup.js";

export function renderSidebar(lists, tasks) {
    let listsHTML = '';
    
    lists.forEach(list => {
        const { id, name, taskCount, color } = list;

        listsHTML += `
            <div class="list js-list-category" data-list-id="${id}" data-list-name="${name}">
                <div>
                    <div class="col">
                        <div style="background-color: ${color}"></div>
                    </div>
                    <div class="name">${name}</div>
                </div>
                <div data-list-id="${id}">
                    <svg class="edit-list js-edit-list" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>

                    <svg class="del-list js-del-list" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>

                    <div class="task-count">${taskCount}</div>
                </div>
            </div>
        `;
    })

    document.querySelector('.js-lists').innerHTML = listsHTML;

    document.querySelector('.js-all-count').innerHTML = tasks.length;

    const todaysTasks = filterUserTasks(tasks, { category : 'today' });
    document.querySelector('.js-today-count').innerHTML = todaysTasks.length;

    const completedTasks = filterUserTasks(tasks, { category : 'completed' });
    document.querySelector('.js-completed-count').innerHTML = completedTasks.length;

    document.querySelectorAll('.js-edit-list')
        .forEach(button => {
            button.addEventListener('click', () => {
                const listId = button.parentElement.dataset.listId;
            });
        });

    document.querySelectorAll('.js-del-list')
        .forEach(button => {
            button.addEventListener('click', () => {
                const listId = button.parentElement.dataset.listId;

                deleteListModal(listId);
            });
        });
}
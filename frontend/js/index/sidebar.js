import { isToday } from "../utils/dates.js";

export function renderSidebar(lists, tasks) {
    let listsHTML = '';
    
    lists.forEach(list => {
        const { id, name, taskCount } = list;

        listsHTML += `
            <div class="category" data-list-id="${id}">
                <div>
                    <div class="col">
                        <div></div>
                    </div>
                    ${name}
                </div>
                <div>
                    ${taskCount}
                </div>
            </div>
        `;
    })

    document.querySelector('.js-lists').innerHTML = listsHTML;

    document.querySelector('.js-all-count').innerHTML = tasks.length;

    const todaysTasks = tasks.filter((task) => isToday(task.dueDate));
    document.querySelector('.js-today-count').innerHTML = todaysTasks.length;

    const completedTasks = tasks.filter((task) => task.completed);
    document.querySelector('.js-completed-count').innerHTML = completedTasks.length;
}
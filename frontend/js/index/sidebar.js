import { filterUserTasks } from "../utils/filter.js";

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

    const todaysTasks = filterUserTasks(tasks, { category : 'today' });
    document.querySelector('.js-today-count').innerHTML = todaysTasks.length;

    const completedTasks = filterUserTasks(tasks, { category : 'completed' });
    document.querySelector('.js-completed-count').innerHTML = completedTasks.length;
}
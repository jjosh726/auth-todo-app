import { isToday } from "./dates.js";

let filters = {};

export function resetFilters() {
    filters = {};
}

export function addFilter(key, value) {
    filters[key] = value;
}

export function getFilters() {
    return filters;
}

export function filterUserTasks(tasks, options = {}) {
    let listId, category, sort;

    if (Object.keys(options).length > 0) {
        category = options.category;
        listId = options.listId;
        sort = options.sort;
    } else {
        category = filters.category;
        listId = filters.listId;
        sort = filters.sort;
    }

    if (category) tasks = filterByCategory(tasks, category);
    if (listId) tasks = filterByList(tasks, listId);
    if (sort) tasks = sortTasks(tasks, sort.type, sort.reverse);

    return tasks;
}

function filterByCategory(tasks, category) {
    switch (category) {
        case 'today':
            return tasks.filter(task => {
                if (!task.dueDate) return false;
                return isToday(task.dueDate);
            });
        
        case 'completed':
            return tasks.filter(task => task.completed);
        
        case 'incompleted':
            return tasks.filter(task => !task.completed);
        
        default:
            return tasks;
    } 
}

function filterByList(tasks, listId) {
    return tasks.filter(task => {
        if (!task.listId) return false;
        return task.listId === listId;
    });
}

function sortTasks(tasks, type, reverse) {
    let result = tasks;

    switch (type) {
        case 'dateCreated':
            break;

        case 'alphabetical':
            result.sort((a, b) => 
                a.title.localeCompare(b.title)
            );
            break;
        
        case 'dueDate':
            result.sort((a, b) => {
                if (a.dueDate && b.dueDate) {
                    return new Date(a.dueDate) - new Date(b.dueDate)
                }

                if (a.dueDate && !b.dueDate) return -1;
                if (!a.dueDate && b.dueDate) return 1;

                return 0;
            });
            break;
    }

    if (reverse) result.reverse();
    return result;
}
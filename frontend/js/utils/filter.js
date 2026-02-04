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
    let listId, category;

    if (Object.keys(options).length > 0) {
        category = options.category;
        listId = options.listId;
    } else {
        category = filters.category;
        listId = filters.listId;
    }
    
    let result = tasks;

    if (category) result = filterByCategory(tasks, category);
    if (listId) result = filterByList(tasks, listId);

    return result;
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
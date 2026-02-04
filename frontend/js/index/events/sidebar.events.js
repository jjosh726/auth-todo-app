import reinit from "../../index.js";
import { addFilter, resetFilters } from "../../utils/filter.js";
import { createListModal } from "../../utils/popup.js";
import { controlTaskSidebarState, resetTaskbarForm } from "../taskbar.js";

const taskLayout = document.querySelector('.js-task-layout');

document.querySelector('.js-task-categories')
    .addEventListener('click', e => {
        const category = e.target.closest('.category').dataset.category;

        resetFilters();
        addFilter('category', category);
        reinit();
    })

document.querySelector('.js-create-new-list')
    .addEventListener('click', () => {
        createListModal();
    })

document.querySelector('.js-lists')
    .addEventListener('click', (e) => {
        if (!document.querySelector('.js-lists').children.length) return;

        const listId = e.target.closest('.js-list-category').dataset.listId;

        resetFilters();
        addFilter('listId', listId);
        reinit();

        if (!taskLayout.classList.contains('is-closed')) {
            controlTaskSidebarState();
            resetTaskbarForm();
        }
    })
    
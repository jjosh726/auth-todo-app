import reinit from "../../index.js";
import { addFilter, resetFilters } from "../../utils/filter.js";

document.querySelector('.js-task-categories')
    .addEventListener('click', e => {
        const category = e.target.closest('.category').dataset.category;

        resetFilters();
        addFilter('category', category);
        reinit();
    })
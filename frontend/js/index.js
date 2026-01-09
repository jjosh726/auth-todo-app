
const taskLayout = document.querySelector('.js-task-layout');

function controlTaskSidebarState() {
    taskLayout.classList.toggle('is-closed');
}

document.querySelector('.js-close-task-button')
    .addEventListener('click', controlTaskSidebarState);

document.querySelector('.js-add-new-task')
    .addEventListener('click', controlTaskSidebarState);

document.querySelectorAll('.js-edit-task')
    .forEach(button => button.addEventListener('click', controlTaskSidebarState));

// const taskSidebar = document.querySelector('.js-task-edit-del');
// const taskList = document.querySelector('.js-task-list');

// let isOpen = true;
// let isAnimating = false;

// function controlTaskSidebarState() {
//     if (isAnimating) return;

//     isAnimating = true;

//     taskSidebar.classList.remove('slide-in', 'slide-out');
//     taskList.classList.remove('slide-in', 'slide-out');

//     if (isOpen) {
//         // close
//         taskSidebar.classList.add('slide-out');
//         taskList.classList.add('slide-out');

//         taskSidebar.addEventListener('animationend', () => {

//             isOpen = false;
//             isAnimating = false;

//             taskSidebar.style.display = 'none';
//         }, { once : true });

//     } else {
//         // open
//         taskSidebar.style.display = 'block';

//         taskSidebar.classList.add('slide-in');
//         taskList.classList.add('slide-in');

//         taskSidebar.addEventListener('animationend', () => {

//             isOpen = true;
//             isAnimating = false;
            
//         }, { once : true });
//     }
// }
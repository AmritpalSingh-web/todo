const addButton = document.querySelector('.add-btn');
const dialog = document.getElementById('add_task');
const cancelButton = document.getElementById('cancel');
const form = document.getElementById('add_task_form');
const taskList = document.getElementById('task_list');
const searchInput = document.getElementById('search_input');
const STORAGE_KEY = 'todo_tasks_v1';

function loadTasks() {
    try {
        const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        return Array.isArray(savedTasks) ? savedTasks : [];
    } catch (error) {
        return [];
    }
}

function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

const tasks = loadTasks();

function renderTasks() {
    if (!taskList) return;

    const searchText = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const filteredTasks = tasks.filter((task) => {
        if (!searchText) return true;

        return (
            task.title.toLowerCase().includes(searchText) ||
            task.description.toLowerCase().includes(searchText) ||
            task.dueDate.toLowerCase().includes(searchText)
        );
    });

    taskList.innerHTML = '';

    filteredTasks.forEach((task, index) => {
        const taskItem = document.createElement('div');
        taskItem.className = 'tasks';

        const content = document.createElement('div');
        content.className = 'content';

        const title = document.createElement('h2');
        title.textContent = task.title;

        const meta = document.createElement('div');
        meta.className = 'task-meta';
        meta.innerHTML = `
            <span>${task.description}</span>
            <span>Due: ${task.dueDate || 'No date'}</span>
        `;

        content.appendChild(title);
        content.appendChild(meta);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'task-remove';
        deleteBtn.type = 'button';
        deleteBtn.innerHTML = '<img src="delete_icon.svg" alt="Delete">';
        deleteBtn.addEventListener('click', () => {
            const realIndex = tasks.findIndex((item) => item.title === task.title && item.dueDate === task.dueDate);
            if (realIndex !== -1) {
                tasks.splice(realIndex, 1);
                saveTasks();
            }
            renderTasks();
        });

        taskItem.appendChild(content);
        taskItem.appendChild(deleteBtn);
        taskList.appendChild(taskItem);
    });
}

if (addButton && dialog) {
    addButton.addEventListener('click', () => {
        dialog.showModal();
    });
}

if (cancelButton && dialog) {
    cancelButton.addEventListener('click', () => {
        dialog.close();
    });
}

if (dialog) {
    dialog.addEventListener('click', (event) => {
        if (event.target === dialog) {
            dialog.close();
        }
    });
}

if (form && dialog) {
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const title = document.getElementById('task_title');
        const description = document.getElementById('task_description');
        const dueDate = document.getElementById('task_due');

        if (!title.value.trim()) {
            title.focus();
            return;
        }

        tasks.unshift({
            title: title.value.trim(),
            description: description.value.trim() || 'No description',
            dueDate: dueDate.value || 'No date'
        });

        saveTasks();
        form.reset();
        dialog.close();
        renderTasks();
    });
}

if (searchInput) {
    searchInput.addEventListener('input', renderTasks);
}

renderTasks();
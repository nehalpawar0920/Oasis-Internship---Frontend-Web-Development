document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const filterAll = document.getElementById('filterAll');
    const filterActive = document.getElementById('filterActive');
    const filterCompleted = document.getElementById('filterCompleted');
    const clearCompleted = document.getElementById('clearCompleted');

    taskForm.addEventListener('submit', addTask);
    taskList.addEventListener('click', taskAction);
    filterAll.addEventListener('click', filterTasks);
    filterActive.addEventListener('click', filterTasks);
    filterCompleted.addEventListener('click', filterTasks);
    clearCompleted.addEventListener('click', clearCompletedTasks);

    loadTasks();

    function loadTasks() {
        const tasks = getTasks();

        tasks.forEach(function(task) {
            createTaskItem(task.text, task.completed);
        });
    }

    function saveTasks(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function getTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        return tasks !== null ? tasks : [];
    }

    function addTask(event) {
        event.preventDefault();
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            createTaskItem(taskText);
            saveTask({ text: taskText, completed: false });
            taskInput.value = '';
        }
    }

    function createTaskItem(taskText, completed = false) {
        const li = document.createElement('li');
        const span = document.createElement('span');
        const removeButton = document.createElement('button');
        const checkbox = document.createElement('input');

        span.textContent = taskText;
        removeButton.textContent = 'Remove';
        checkbox.type = 'checkbox';
        checkbox.checked = completed;

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(removeButton);
        taskList.appendChild(li);

        if (completed) {
            li.classList.add('completed');
        }

        return li;
    }

    function saveTask(task) {
        const tasks = getTasks();
        tasks.push(task);
        saveTasks(tasks);
    }

    function removeTask(li) {
        const tasks = getTasks();
        const taskText = li.querySelector('span').textContent;
        const updatedTasks = tasks.filter(function(task) {
            return task.text !== taskText;
        });
        saveTasks(updatedTasks);
        taskList.removeChild(li);
    }

    function toggleTaskCompletion(li) {
        const tasks = getTasks();
        const taskText = li.querySelector('span').textContent;
        const updatedTasks = tasks.map(function(task) {
            if (task.text === taskText) {
                task.completed = !task.completed;
                li.classList.toggle('completed');
            }
            return task;
        });
        saveTasks(updatedTasks);
    }

    function taskAction(event) {
        const target = event.target;

        if (target.tagName === 'BUTTON') {
            const li = target.parentNode;
            if (target.textContent === 'Remove') {
                removeTask(li);
            }
        }

        if (target.tagName === 'INPUT' && target.type === 'checkbox') {
            const li = target.parentNode;
            toggleTaskCompletion(li);
        }
    }

    function filterTasks(event) {
        const target = event.target;

        if (target.id === 'filterAll') {
            taskList.classList.remove('active', 'completed');
        }

        if (target.id === 'filterActive') {
            taskList.classList.remove('completed');
            taskList.classList.add('active');
        }

        if (target.id === 'filterCompleted') {
            taskList.classList.remove('active');
            taskList.classList.add('completed');
        }
    }

    function clearCompletedTasks() {
        const completedTasks = taskList.querySelectorAll('.completed');
        completedTasks.forEach(function(li) {
            removeTask(li);
        });
    }
});

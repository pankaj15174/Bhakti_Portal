// tasks.js

const taskDescriptionInput = document.getElementById('taskDescription');
const taskDateInput = document.getElementById('taskDate');
const taskTimeInput = document.getElementById('taskTime');
const taskStatusInput = document.getElementById('taskStatus'); // New: Status dropdown
const addTaskBtn = document.getElementById('addTaskBtn');
const addTomorrowTaskBtn = document.getElementById('addTomorrowTaskBtn');

// New: References to task list columns
const createdTasksList = document.getElementById('createdTasks');
const inProgressTasksList = document.getElementById('inProgressTasks');
const doneTasksList = document.getElementById('doneTasks');

let tasks = []; // Array to store all tasks

// --- Helper Functions ---

// Function to format date for display
function formatDate(dateString) {
    if (!dateString) return '';
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Function to format time for display
function formatTime(timeString) {
    if (!timeString) return '';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true });
}

// Function to save tasks to Local Storage
function saveTasks() {
    localStorage.setItem('dailyTasks', JSON.stringify(tasks));
}

// Function to load tasks from Local Storage
function loadTasks() {
    const savedTasks = localStorage.getItem('dailyTasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
    renderTasks(); // Always render after loading
}

// Function to display/hide no tasks message in each column
function showNoTasksMessageInColumn(columnElement, hasTasks) {
    let messageElement = columnElement.querySelector('.no-tasks-message');
    if (!messageElement) {
        messageElement = document.createElement('p');
        messageElement.classList.add('no-tasks-message');
        columnElement.appendChild(messageElement); // Add it if it doesn't exist
    }
    if (hasTasks) {
        messageElement.style.display = 'none';
    } else {
        messageElement.style.display = 'block';
        if (columnElement === createdTasksList) messageElement.textContent = "No tasks in 'Created'.";
        else if (columnElement === inProgressTasksList) messageElement.textContent = "No tasks 'In Progress'.";
        else if (columnElement === doneTasksList) messageElement.textContent = "No tasks 'Done'.";
    }
}


// Function to render all tasks into their respective columns
function renderTasks() {
    // Clear current columns
    createdTasksList.innerHTML = '';
    inProgressTasksList.innerHTML = '';
    doneTasksList.innerHTML = '';

    // Separate tasks by status
    const created = [];
    const inProgress = [];
    const done = [];

    // Sort tasks by date and time (if available), then description
    tasks.sort((a, b) => {
        const hasDateA = !!a.date;
        const hasDateB = !!b.date;

        if (hasDateA && !hasDateB) return -1;
        if (!hasDateA && hasDateB) return 1;

        if (hasDateA && hasDateB) {
            const dateTimeA = new Date(`${a.date}T${a.time || '00:00'}`);
            const dateTimeB = new Date(`${b.date}T${b.time || '00:00'}`);
            return dateTimeA - dateTimeB;
        } else {
            return a.description.localeCompare(b.description);
        }
    });

    tasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');
        taskItem.dataset.id = task.id; // Store task ID
        taskItem.dataset.status = task.status; // Store task status

        let dateTimeDisplay = '';
        if (task.date && task.time) {
            dateTimeDisplay = `${formatDate(task.date)} at ${formatTime(task.time)}`;
        } else if (task.date) {
            dateTimeDisplay = `${formatDate(task.date)}`;
        } else if (task.time) {
            dateTimeDisplay = `at ${formatTime(task.time)}`;
        } else {
            dateTimeDisplay = 'No date/time set';
        }

        taskItem.innerHTML = `
            <div class="task-details">
                <div class="description">${task.description}</div>
                <div class="datetime">${dateTimeDisplay}</div>
            </div>
            <button class="delete-btn">Delete</button>
        `;

        // Append to the correct column
        if (task.status === 'created') {
            created.push(taskItem);
        } else if (task.status === 'in-progress') {
            inProgress.push(taskItem);
        } else if (task.status === 'done') {
            done.push(taskItem);
        }
    });

    created.forEach(item => createdTasksList.appendChild(item));
    inProgress.forEach(item => inProgressTasksList.appendChild(item));
    done.forEach(item => doneTasksList.appendChild(item));

    // Update 'no tasks' messages for each column
    showNoTasksMessageInColumn(createdTasksList, created.length > 0);
    showNoTasksMessageInColumn(inProgressTasksList, inProgress.length > 0);
    showNoTasksMessageInColumn(doneTasksList, done.length > 0);
}

// Function to add a new task
function addTask(description, date, time, status) { // Added status parameter
    if (!description.trim()) {
        alert('Please provide a task description.');
        return;
    }

    const newTask = {
        id: Date.now(),
        description: description.trim(),
        date: date || '',
        time: time || '',
        status: status // Save the status
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();

    // Clear description input field after adding
    taskDescriptionInput.value = '';
    // Optionally clear date/time/status inputs if you want them to reset
    // taskDateInput.value = '';
    // taskTimeInput.value = '';
    taskStatusInput.value = 'created'; // Reset status to default
}

// Function to delete a task
function deleteTask(idToDelete) {
    tasks = tasks.filter(task => task.id !== idToDelete);
    saveTasks();
    renderTasks();
}

// Function to update task status
function updateTaskStatus(id, currentStatus) {
    let newStatus;
    if (currentStatus === 'created') {
        newStatus = 'in-progress';
    } else if (currentStatus === 'in-progress') {
        newStatus = 'done';
    } else if (currentStatus === 'done') {
        // This is the popup part you asked for
        alert('This task is already Done! Well done!');
        return; // Don't change status or re-render if it's already done
    }

    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex > -1) {
        tasks[taskIndex].status = newStatus;
        saveTasks();
        renderTasks(); // Re-render to move task to new column
    }
}

// --- Event Listeners ---

// Add Task button click
addTaskBtn.addEventListener('click', () => {
    addTask(
        taskDescriptionInput.value,
        taskDateInput.value,
        taskTimeInput.value,
        taskStatusInput.value // Get status from dropdown
    );
});

// Add Task for Tomorrow button click
addTomorrowTaskBtn.addEventListener('click', () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const tomorrowDateString = tomorrow.toISOString().split('T')[0];

    taskDateInput.value = tomorrowDateString;
    // Set default status for tomorrow's task
    taskStatusInput.value = 'created';

    alert(`Date set to tomorrow (${tomorrowDateString}). Status set to 'Created'. Please enter task description and time (optional), then click "Add Task".`);
});

// Event delegation for delete and status change clicks on the task columns
document.querySelectorAll('.task-list-column').forEach(column => {
    column.addEventListener('click', (event) => {
        const taskItem = event.target.closest('.task-item');
        if (!taskItem) return; // Not a task item click

        const taskId = parseInt(taskItem.dataset.id);

        if (event.target.classList.contains('delete-btn')) {
            // Delete button was clicked
            if (confirm('Are you sure you want to delete this task?')) {
                deleteTask(taskId);
            }
        } else {
            // Task item itself was clicked (for status progression)
            const currentStatus = taskItem.dataset.status;
            updateTaskStatus(taskId, currentStatus);
        }
    });
});


// --- Initial Setup ---

// Set default date to today for convenience when page loads
const today = new Date();
taskDateInput.value = today.toISOString().split('T')[0];

// Load tasks when the page first loads
loadTasks();
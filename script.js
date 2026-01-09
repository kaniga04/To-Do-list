const addBtn = document.getElementById("addBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const totalCount = document.getElementById("totalCount");
const completedCount = document.getElementById("completedCount");
const remainingCount = document.getElementById("remainingCount");

// Load tasks from localStorage on page load
window.addEventListener("DOMContentLoaded", loadTasks);

// Add task on button click
addBtn.addEventListener("click", addTask);

// Add task on Enter key press
taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
});

function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === "") {
        taskInput.focus();
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    createTaskElement(task);
    saveTasks();
    taskInput.value = "";
    taskInput.focus();
    updateStats();
}

function createTaskElement(task) {
    const li = document.createElement("li");
    li.setAttribute("data-id", task.id);
    
    if (task.completed) {
        li.classList.add("checked");
    }

    const taskSpan = document.createElement("span");
    taskSpan.textContent = task.text;
    li.appendChild(taskSpan);

    // Toggle completed task
    li.addEventListener("click", (e) => {
        if (e.target !== deleteBtn) {
            li.classList.toggle("checked");
            updateTaskStatus(task.id);
            saveTasks();
            updateStats();
        }
    });

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "✕";
    deleteBtn.type = "button";

    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        li.style.animation = "fadeOut 0.3s ease-out forwards";
        setTimeout(() => {
            li.remove();
            deleteTask(task.id);
            saveTasks();
            updateStats();
        }, 300);
    });

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

function updateTaskStatus(taskId) {
    const li = document.querySelector(`[data-id="${taskId}"]`);
    li.classList.toggle("checked");
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll("li").forEach(li => {
        tasks.push({
            id: parseInt(li.getAttribute("data-id")),
            text: li.querySelector("span").textContent,
            completed: li.classList.contains("checked")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        tasks.forEach(task => {
            createTaskElement(task);
        });
        updateStats();
    }
}

function deleteTask(taskId) {
    const li = document.querySelector(`[data-id="${taskId}"]`);
    if (li) li.remove();
}

function updateStats() {
    const total = document.querySelectorAll("li").length;
    const completed = document.querySelectorAll("li.checked").length;
    const remaining = total - completed;

    totalCount.textContent = total;
    completedCount.textContent = completed;
    remainingCount.textContent = remaining;
}

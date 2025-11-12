// js/script.js

// 1. Seleksi Elemen DOM
const todoForm = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const dateInput = document.getElementById('date-input');
const taskList = document.getElementById('task-list');
const filterBtn = document.getElementById('filter-btn');
const deleteAllBtn = document.getElementById('delete-all-btn');

// 2. State Aplikasi
// Coba ambil tugas dari localStorage, atau gunakan array kosong jika tidak ada
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all'; // 'all', 'pending', 'completed'

// 3. Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
});

todoForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Mencegah form submit
    addTask();
});

deleteAllBtn.addEventListener('click', () => {
    // Hapus semua tugas dari array
    tasks = [];
    saveAndRender();
});

filterBtn.addEventListener('click', () => {
    toggleFilter();
});

// Event delegation untuk tombol complete dan delete
taskList.addEventListener('click', (e) => {
    const target = e.target;
    const taskId = target.closest('li')?.dataset.id;

    if (!taskId) return; // Klik di luar tombol

    if (target.classList.contains('btn-complete')) {
        toggleTaskComplete(taskId);
    } else if (target.classList.contains('btn-task-delete')) {
        deleteTask(taskId);
    }
});

// 4. Fungsi-fungsi Utama

function addTask() {
    const taskText = taskInput.value.trim();
    const taskDate = dateInput.value;

    // 2. Validasi Input Form 
    if (taskText === '' || taskDate === '') {
        alert('Please fill in both the task and the due date.');
        return;
    }

    // Buat objek tugas baru
    const newTask = {
        id: Date.now().toString(), // ID unik
        text: taskText,
        date: taskDate,
        completed: false
    };

    // Tambahkan ke array
    tasks.push(newTask);
    
    // Bersihkan input
    taskInput.value = '';
    dateInput.value = '';

    saveAndRender();
}

function renderTasks() {
    // Bersihkan daftar tugas saat ini
    taskList.innerHTML = '';

    // Filter tugas berdasarkan state filter saat ini
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'pending') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true; // 'all'
    });

    if (filteredTasks.length === 0) {
        // Tampilkan pesan "No task found" [cite: 24]
        taskList.innerHTML = '<li class="empty-message">No task found</li>';
        return;
    }

    // 3.0 Tampilkan To-Do List 
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id; // Simpan ID di elemen

        const statusText = task.completed ? 'Completed' : 'Pending';
        const completeButtonText = task.completed ? 'Undo' : 'Complete';

        li.innerHTML = `
            <div class="task-text">${task.text}</div>
            <div class="task-date">${formatDate(task.date)}</div>
            <div class="task-status">${statusText}</div>
            <div class="task-actions">
                <button class="btn btn-complete">${completeButtonText}</button>
                <button class="btn btn-task-delete">Delete</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

function toggleTaskComplete(taskId) {
    tasks = tasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    saveAndRender();
}

function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveAndRender();
}

function toggleFilter() {
    if (currentFilter === 'all') {
        currentFilter = 'pending';
        filterBtn.textContent = 'Filter (Show Pending)';
    } else if (currentFilter === 'pending') {
        currentFilter = 'completed';
        filterBtn.textContent = 'Filter (Show Completed)';
    } else {
        currentFilter = 'all';
        filterBtn.textContent = 'Filter (Show All)';
    }
    renderTasks(); // Render ulang dengan filter baru
}

// 5. Fungsi Helper

function saveAndRender() {
    // Simpan ke localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
    // Render ulang tampilan
    renderTasks();
}

function formatDate(dateString) {
    // Format tanggal dari YYYY-MM-DD ke MM/DD/YYYY
    const [year, month, day] = dateString.split('-');
    return `${month}/${day}/${year}`;
}
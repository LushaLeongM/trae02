document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const taskInput = document.getElementById('taskInput');
    const quadrantSelect = document.getElementById('quadrantSelect');
    const addTaskBtn = document.getElementById('addTask');
    const taskLists = {
        q1: document.getElementById('q1-tasks'),
        q2: document.getElementById('q2-tasks'),
        q3: document.getElementById('q3-tasks'),
        q4: document.getElementById('q4-tasks')
    };
    
    // Load tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('priorityFirstTasks')) || {
        q1: [],
        q2: [],
        q3: [],
        q4: []
    };
    
    // Render tasks
    function renderTasks() {
        // Clear all task lists
        Object.values(taskLists).forEach(list => list.innerHTML = '');
        
        // Render tasks for each quadrant
        Object.keys(tasks).forEach(quadrant => {
            tasks[quadrant].forEach((task, index) => {
                const li = document.createElement('li');
                li.className = `task-item ${task.completed ? 'completed' : ''}`;
                
                li.innerHTML = `
                    <span>${task.text}</span>
                    <div class="task-actions">
                        <button class="complete-btn" data-quadrant="${quadrant}" data-index="${index}">
                            ${task.completed ? '↩️' : '✓'}
                        </button>
                        <button class="delete-btn" data-quadrant="${quadrant}" data-index="${index}">🗑️</button>
                    </div>
                `;
                
                taskLists[quadrant].appendChild(li);
            });
        });
        
        // Save to localStorage
        localStorage.setItem('priorityFirstTasks', JSON.stringify(tasks));
    }
    
    // Add new task
    function addTask() {
        const text = taskInput.value.trim();
        const quadrant = quadrantSelect.value;
        
        if (text) {
            tasks[quadrant].push({
                text,
                completed: false,
                createdAt: new Date().toISOString()
            });
            
            taskInput.value = '';
            renderTasks();
        }
    }
    
    // Event listeners
    addTaskBtn.addEventListener('click', addTask);
    
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    // Event delegation for task actions
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('complete-btn')) {
            const quadrant = e.target.dataset.quadrant;
            const index = parseInt(e.target.dataset.index);
            
            tasks[quadrant][index].completed = !tasks[quadrant][index].completed;
            renderTasks();
        }
        
        if (e.target.classList.contains('delete-btn')) {
            const quadrant = e.target.dataset.quadrant;
            const index = parseInt(e.target.dataset.index);
            
            tasks[quadrant].splice(index, 1);
            renderTasks();
        }
    });
    
    // Initial render
    renderTasks();
})

        // Wait for DOM to be fully loaded
        document.addEventListener('DOMContentLoaded', function() {
            // Select DOM elements
            const addButton = document.getElementById('add-task-btn');
            const taskInput = document.getElementById('task-input');
            const taskList = document.getElementById('task-list');
            const totalTasks = document.getElementById('total-tasks');
            const completedTasks = document.getElementById('completed-tasks');
            
            // Load tasks from localStorage if available
            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            
            // Function to update task statistics
            function updateStats() {
                const total = tasks.length;
                const completed = tasks.filter(task => task.completed).length;
                
                totalTasks.textContent = `Total: ${total}`;
                completedTasks.textContent = `Completed: ${completed}`;
                
                // Save to localStorage
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }
            
            // Function to render tasks
            function renderTasks() {
                taskList.innerHTML = '';
                
                if (tasks.length === 0) {
                    taskList.innerHTML = `
                        <div class="empty-state">
                            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                            <p>No tasks yet. Add a task to get started!</p>
                        </div>
                    `;
                    return;
                }
                
                tasks.forEach((task, index) => {
                    const li = document.createElement('li');
                    li.className = task.completed ? 'completed' : '';
                    
                    li.innerHTML = `
                        <span class="task-text">${task.text}</span>
                        <div class="task-actions">
                            <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
                            <button class="remove-btn">Remove</button>
                        </div>
                    `;
                    
                    // Add event listener for task completion
                    const completeBtn = li.querySelector('.complete-btn');
                    completeBtn.addEventListener('click', function() {
                        tasks[index].completed = !tasks[index].completed;
                        renderTasks();
                        updateStats();
                    });
                    
                    // Add event listener for task removal
                    const removeBtn = li.querySelector('.remove-btn');
                    removeBtn.addEventListener('click', function() {
                        li.classList.add('fade-out');
                        setTimeout(() => {
                            tasks.splice(index, 1);
                            renderTasks();
                            updateStats();
                        }, 300);
                    });
                    
                    // Add event listener for task text (toggle completion)
                    const taskText = li.querySelector('.task-text');
                    taskText.addEventListener('click', function() {
                        tasks[index].completed = !tasks[index].completed;
                        renderTasks();
                        updateStats();
                    });
                    
                    taskList.appendChild(li);
                });
                
                updateStats();
            }
            
            // Function to add a new task
            function addTask() {
                const taskText = taskInput.value.trim();
                
                if (taskText === "") {
                    alert("Please enter a task!");
                    return;
                }
                
                // Add new task to the array
                tasks.push({
                    text: taskText,
                    completed: false
                });
                
                // Clear input field
                taskInput.value = "";
                
                // Re-render tasks
                renderTasks();
            }
            
            // Event listener for Add Task button
            addButton.addEventListener('click', addTask);
            
            // Event listener for Enter key in input field
            taskInput.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    addTask();
                }
            });
            
            // Initial render of tasks
            renderTasks();
        });
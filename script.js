// ---- DOM ELEMENTS ----//
const addTaskForm = document.getElementById('add-task');
const taskInput = document.getElementById('task-input');
const timeInput = document.getElementById('time-input');
const taskList = document.getElementById('task-list');

// ---- STATE ----//
let tasks = [];

// ---- LOAD SAVED TASKS ON PAGE LOAD ----//
loadFromLocalStorage();

// ---- ADD TASK ON FORM SUBMIT ----//
addTaskForm.addEventListener('submit', (e) => {
  e.preventDefault(); 

  const taskText = taskInput.value.trim();
  const deadline = timeInput.value;

  if (taskText === '') {
    alert('Please enter a task.');
    return;
  }

  // Prevent duplicate tasks
  const isDuplicate = tasks.some(task => task.text.toLowerCase() === taskText.toLowerCase());
  if (isDuplicate) {
    alert('This task already exists.');
    return;
  }

  const newTask = {
    id: Date.now(),
    text: taskText,
    deadline: deadline,
    completed: false

  };

  tasks.push(newTask);
  renderTask(newTask);

  taskInput.value = '';
  timeInput.value = '';

  saveToLocalStorage();
});

// ---- RENDER TASK ----
function renderTask(task) {
  const li = document.createElement('li');

  //---checkbox---//
const checkbox = document.createElement('input');
checkbox.type = 'checkbox';
checkbox.checked = task.completed || false;

checkbox.addEventListener('change', () => {
task.completed = checkbox.checked;
li.classList.toggle('completed' , task.completed);
saveToLocalStorage();
});

//---task text and deadline---//
const textSpan = document.createElement('span');
const deadlineDisplay = task.deadline ? task.deadline : 'No deadline';
textSpan.textContent = `${task.text} — ${deadlineDisplay}`;

 
  //--Delete button--//
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '×';
  deleteBtn.className = 'delete-btn';
  deleteBtn.addEventListener('click', () => {
    deleteTask(task.id);
  });

  // Add completed class if done
  if (task.completed) {
    li.classList.add('completed');
  }

  //Assemble checkbox,text,delete
  li.appendChild(checkbox);
  li.appendChild(textSpan);
  li.appendChild(deleteBtn);

  taskList.appendChild(li);


}

// ---- DELETE TASK ----
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  taskList.innerHTML = '';
  tasks.forEach(renderTask);
  saveToLocalStorage();
}

// ---- SAVE TO LOCALSTORAGE ----
function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ---- LOAD FROM LOCALSTORAGE ----
function loadFromLocalStorage() {
  const saved = localStorage.getItem('tasks');
  if (saved) {
    tasks = JSON.parse(saved);
    tasks.forEach(renderTask);
  }
}


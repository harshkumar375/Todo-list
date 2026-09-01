document.addEventListener("DOMContentLoaded", () => {
  const todoInput = document.getElementById("todo-input");
  const addTaskButton = document.getElementById("add-task-btn");
  const todoList = document.getElementById("todo-list");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.forEach((task) => renderTask(task));

  function createTask() {
    const taskText = todoInput.value.trim();
    if (taskText === "") return;

    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
    };

    tasks.push(newTask);
    saveTasks();
    renderTask(newTask);
    todoInput.value = "";
  }

  addTaskButton.addEventListener("click", () => {
    createTask();
  });

  document.addEventListener('keydown', (evt) => {
    const key = evt.key;
    if(key !== "Enter") return;
    createTask();
  });

  function renderTask(task) {
    const li = document.createElement("li");
    li.setAttribute("data-id", task.id);
    if (task.completed) li.classList.add("completed");
    li.innerHTML = `
    <div>
      <input type="checkbox">
      <span>${task.text}</span>
    </div>
    <button>Delete</button>
    `;

    li.addEventListener("click", (evt) => {
      if (evt.target.tagName !== "INPUT") return;
      task.completed = !task.completed;
      li.classList.toggle("completed");
      saveTasks();
    });

    li.querySelector("button").addEventListener("click", (evt) => {
      evt.stopPropagation();
      tasks = tasks.filter((t) => t.id !== task.id);
      li.remove();
      saveTasks();
    });

    todoList.appendChild(li);
  }

  const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };
});

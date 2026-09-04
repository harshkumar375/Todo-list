document.addEventListener("DOMContentLoaded", () => {
  const todoInput = document.getElementById("todo-input");
  const addTaskButton = document.getElementById("add-task-btn");
  const todoList = document.getElementById("todo-list");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => {
    renderTask(task);
  });
  var comp = 0;
  document.querySelectorAll("li").forEach((li) => {
    if (li.classList.contains("completed")) {
      li.children[0].children[0].checked = true;
      comp++;
    }
  });

  function counter() {
    document.querySelector(".comp").textContent = comp;
    document.querySelector(".total").textContent = tasks.length;
    document.querySelector(".pending").textContent = tasks.length - comp;
  }
  counter();

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

  document.addEventListener("keydown", (evt) => {
    const key = evt.key;
    if (key !== "Enter") return;
    createTask();
  });

  function renderTask(task) {
    const li = document.createElement("li");
    li.setAttribute("data-id", task.id);
    if (task.completed) {
      li.classList.add("completed");
      comp++;
    }
    li.innerHTML = `
    <div>
      <input type="checkbox" id="checkbox">
      <span>${task.text}</span>
    </div>
    <div>
      <button class="delete-btn">Delete</button>
      <button class="edit-btn">Edit</button>
    </div>
    `;

    li.addEventListener("click", (evt) => {
      if (evt.target.tagName !== "INPUT") return;
      task.completed = !task.completed;
      li.classList.toggle("completed");
      if (!task.completed) comp--;
      else comp++;
      saveTasks();
    });

    li.querySelector(".delete-btn").addEventListener("click", (evt) => {
      evt.stopPropagation();
      tasks = tasks.filter((t) => t.id !== task.id);
      if(li.classList.contains("completed")) comp--;
      li.remove();
      saveTasks();
    });

    li.querySelector(".edit-btn").addEventListener("click", (evt) => {
      evt.stopPropagation();
      const newTask = prompt("Edit task: ", task.text);
      if (newTask.trim() !== "") {
        task.text = newTask;
        li.querySelector("span").textContent = task.text;
        saveTasks();
      }
    });

    todoList.appendChild(li);
  }

  const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    counter();
  };
});

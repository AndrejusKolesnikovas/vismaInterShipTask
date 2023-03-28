"use strict";
const form = document.querySelector("#new-task-form");
const input_text = document.querySelector("#new-task-text");
const input_deadline = document.querySelector("#new-task-deadline");
const list_el = document.querySelector("#tasks-list");
const sort_el = document.querySelector("#order-by-select-input");

const demoTasks = [
  {
    id: 1679732203956,
    description: "Demo description 1",
    taskDeadline: "2023-03-25T12:28",
    isCompleted: false,
  },
  {
    id: 1679732203958,
    description: "Demo description 2",
    taskDeadline: "2023-03-25T12:38",
    isCompleted: true,
  },
  {
    id: 1679732203959,
    description: "Demo description 3",
    taskDeadline: "2023-03-25T12:28",
    isCompleted: false,
  },
];

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

window.addEventListener("load", () => {
  if (!localStorage.getItem("tasks")) {
    tasks.push(demoTasks[0]);
    tasks.push(demoTasks[1]);
    tasks.push(demoTasks[2]);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
});

if (localStorage.getItem("tasks")) {
  tasks.map((task) => {
    createTask(task);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const task_description = input_text.value;
  const task_deadline = input_deadline.value;

  if (!task_description) {
    alert("Please fill out the task");
    return;
  }

  const task = {
    id: new Date().getTime(),
    description: task_description,
    taskDeadline: task_deadline,
    isCompleted: false,
  };

  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  createTask(task);

  form.reset();
});

list_el.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete_task")) {
    const taskId = e.target.closest(".task").id;
    removeTask(taskId);
  }
});

sort_el.addEventListener("change", (e) => {
  const sortedData = sortBy(sort_el.value);
  createTask(sortedData);
});

list_el.addEventListener("input", (e) => {
  const taskId = e.target.closest(".task").id;

  updateTaskStatus(taskId);
  location.reload();
});

function createTask(task) {
  const task_el = document.createElement("div");
  task_el.classList.add("task");
  task_el.setAttribute("id", task["id"]);
  list_el.appendChild(task_el);

  const task_description_el = document.createElement("p");
  task_description_el.classList.add("description_notCompleted");
  task_description_el.innerText = task["description"];
  task_el.appendChild(task_description_el);

  const left_box_el = document.createElement("div");
  left_box_el.classList.add("left_box");

  task_el.appendChild(left_box_el);

  const deadline_el = document.createElement("p");
  const now = new Date();
  const futureDate = new Date(`${task["taskDeadline"]}`);
  const timeleft = futureDate - now;
  const days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

  const deadline =
    days + " days " + hours + " h " + minutes + " min " + seconds + " s left";

  deadline_el.innerText = deadline;

  left_box_el.appendChild(deadline_el);

  const delete_button_el = document.createElement("button");
  delete_button_el;
  delete_button_el.classList.add("delete_task");
  delete_button_el.setAttribute("type", "button");
  delete_button_el.innerText = "Delete";

  left_box_el.appendChild(delete_button_el);

  const task_status_box_el = document.createElement("div");
  task_status_box_el.classList.add("taskStatusBox");

  left_box_el.appendChild(task_status_box_el);

  const legend_el = document.createElement("legend");
  legend_el.innerText = "Completed";

  task_status_box_el.appendChild(legend_el);

  const input_task_status_el = document.createElement("input");
  input_task_status_el.setAttribute("type", "checkbox");
  input_task_status_el.setAttribute("id", `complete-${task["id"]}`);

  task_status_box_el.appendChild(input_task_status_el);
}

function removeTask(taskId) {
  tasks = tasks.filter((task) => task.id !== parseInt(taskId));

  if (window.confirm("Are You sure to delete this?")) {
    localStorage.setItem("tasks", JSON.stringify(tasks));

    document.getElementById(taskId).remove();
  }
}

function updateTaskStatus(taskId) {
  const task = tasks.find((task) => task.id === parseInt(taskId));

  if (task.isCompleted === false) {
    task.isCompleted = true;
  } else {
    task.isCompleted = false;
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function showTaskStatus() {
  const task = tasks.map((task) => {
    if (task.isCompleted !== false) {
      document
        .getElementById(task.id)
        .firstChild.removeAttribute("description_notCompleted");
      document
        .getElementById(task.id)
        .firstChild.classList.add("description_isCompleted");
      document
        .getElementById(`complete-${task.id}`)
        .setAttribute("checked", "checked");
    } else {
      document
        .getElementById(task.id)
        .firstChild.removeAttribute("description_isCompleted");
      document
        .getElementById(task.id)
        .firstChild.classList.add("description_notCompleted");
      document.getElementById(task.id).firstChild.removeAttribute("cheked");
    }
  });
}

showTaskStatus();

function sortBy(sortBy) {
  if (sortBy === "deadline") {
    return tasks.sort((a, b) => a.taskDeadline - b.taskDeadline);
  } else if (sortBy === "completed") {
    return tasks.sort((a, b) => a.isCompleted - b.isCompleted);
  } else {
    return tasks.sort((a, b) => a.id - b.id);
  }
}

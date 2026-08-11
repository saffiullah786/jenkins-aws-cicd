const form = document.getElementById("task-form");
const input = document.getElementById("task-title");
const list = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const completedCount = document.getElementById("completed-count");
const health = document.getElementById("health");

async function loadTasks() {
  const response = await fetch("/api/tasks");
  const tasks = await response.json();

  list.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = `task ${task.completed ? "done" : ""}`;

    li.innerHTML = `
      <input type="checkbox" ${task.completed ? "checked" : ""}>
      <span class="task-title"></span>
      <button class="delete" type="button">Delete</button>
    `;

    li.querySelector(".task-title").textContent = task.title;

    li.querySelector("input").addEventListener("change", async event => {
      await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: event.target.checked })
      });
      loadTasks();
    });

    li.querySelector(".delete").addEventListener("click", async () => {
      await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
      loadTasks();
    });

    list.appendChild(li);
  });

  taskCount.textContent = `${tasks.length} task${tasks.length === 1 ? "" : "s"}`;
  completedCount.textContent =
    `${tasks.filter(t => t.completed).length} completed`;
}

async function checkHealth() {
  try {
    const response = await fetch("/api/health");
    if (response.ok) {
      health.textContent = "● Online";
      health.title = "Application API is healthy";
    }
  } catch {
    health.textContent = "● Offline";
  }
}

form.addEventListener("submit", async event => {
  event.preventDefault();

  const title = input.value.trim();
  if (!title) return;

  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title })
  });

  if (response.ok) {
    input.value = "";
    loadTasks();
  }
});

loadTasks();
checkHealth();

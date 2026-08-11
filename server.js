const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

let nextId = 3;
const tasks = [
  { id: 1, title: "Learn Jenkins", completed: true },
  { id: 2, title: "Deploy application to AWS EC2", completed: false }
];

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "devops-task-manager" });
});

app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/api/tasks", (req, res) => {
  const title = String(req.body.title || "").trim();

  if (!title) {
    return res.status(400).json({ error: "Task title is required" });
  }

  const task = { id: nextId++, title, completed: false };
  tasks.push(task);
  res.status(201).json(task);
});

app.patch("/api/tasks/:id", (req, res) => {
  const task = tasks.find(t => t.id === Number(req.params.id));

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  if (typeof req.body.completed === "boolean") {
    task.completed = req.body.completed;
  }

  res.json(task);
});

app.delete("/api/tasks/:id", (req, res) => {
  const index = tasks.findIndex(t => t.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks.splice(index, 1);
  res.status(204).end();
});

if (require.main === module) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DevOps Task Manager running on port ${PORT}`);
  });
}

module.exports = app;

const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const app = require("../server");

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, "127.0.0.1", () => {
      const port = server.address().port;
      const data = body ? JSON.stringify(body) : null;

      const req = http.request({
        hostname: "127.0.0.1",
        port,
        path,
        method,
        headers: data ? {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data)
        } : {}
      }, res => {
        let chunks = "";
        res.on("data", chunk => chunks += chunk);
        res.on("end", () => {
          server.close();
          resolve({
            status: res.statusCode,
            body: chunks ? JSON.parse(chunks) : null
          });
        });
      });

      req.on("error", err => {
        server.close();
        reject(err);
      });

      if (data) req.write(data);
      req.end();
    });
  });
}

test("health endpoint returns OK", async () => {
  const response = await request("GET", "/api/health");
  assert.equal(response.status, 200);
  assert.equal(response.body.status, "ok");
});

test("can create a task", async () => {
  const response = await request("POST", "/api/tasks", {
    title: "Deploy with Jenkins"
  });

  assert.equal(response.status, 201);
  assert.equal(response.body.title, "Deploy with Jenkins");
  assert.equal(response.body.completed, false);
});

# DevOps Task Managers

A real working Node.js + Express task management application created for a Jenkins + GitHub + AWS EC2 CI/CD project.

## Features

- View tasks
- Add tasks
- Mark tasks complete/incomplete
- Delete tasks
- Health-check API
- Automated Node.js tests

## Run locally

Requirements:

- Node.js 18+

Install dependencies:

```bash
npm install
```

Run tests:

```bash
npm test
```

Start the application:

```bash
npm start
```

Open:

```text
http://localhost:3000
```

## CI/CD project

The repository contains a `Jenkinsfile` that currently performs:

1. Checkout
2. Dependency installation with `npm ci`
3. Automated tests
4. Node.js syntax validation
5. Deployment placeholder

The deployment stage will be configured later for AWS EC2.

## Planned architecture

GitHub → GitHub Webhook → Jenkins → AWS EC2 → Nginx/Node.js

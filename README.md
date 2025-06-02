# SENTRY: Smart Warehouse Monitoring System

This project is designed to monitor employee and item movement within a warehouse using **face recognition** and **weight sensors**. It aims to improve security, ensure accurate inventory records, and detect potential theft or data inconsistencies.

## Key Features
- Automatic employee detection using face recognition
- Monitoring item check-in and check-out
- Weight tracking via shelf-mounted sensors
- Notifications for missing items or suspicious activity

## Team Members
- **[@taufanAli65](https://github.com/taufanAli65)** – Team Leader, Backend Developer, Mobile Developer  
- **[@abdisetiakawan](https://github.com/abdisetiakawan)** – Backend Developer, Web Frontend Developer  
- **[@DwiJullian](https://github.com/DwiJullian)** – Machine Learning Engineer  
- **[@RahadianCondro](https://github.com/RahadianCondro)** – IoT Engineer  
- **[@sazaghi](https://github.com/sazaghi)** – Web Frontend Developer, Mobile Developer  
- **[@astisulistio](https://github.com/astisulistio)** – UI/UX Developer

## Technologies Used
- Python / Node.js (Backend)
- Vue.js (Web Frontend)
- Flutter (Mobile Apps)
- MongoDB (Database)
- Etc.

## System Overview
Employees are recognized through a face recognition system when entering or exiting the warehouse. Items are scanned during both check-in and check-out, and shelf sensors track weight changes. The system compares scanned data with real-time sensor input to ensure consistency. If any mismatch is detected, the system sends a notification and logs the suspicious activity.

## System Flowchart

![System Flowchart](docs/flowchart.jpg)

## Contribution Guidelines

### Commit Message Rules
- Use [Conventional Commits](https://www.conventionalcommits.org/) format:
  - `feat`: for new features
  - `fix`: for bug fixes
  - `docs`: for documentation changes
  - `style`: for formatting, missing semi colons, etc.
  - `refactor`: for code changes that neither fixes a bug nor adds a feature
  - `test`: for adding or updating tests
  - `chore`: for maintenance tasks
- Example:  
  ```
  feat: add face recognition module
  docs: update system overview and flowchart
  fix: correct sensor data parsing bug
  ```

### When to Commit
- Commit after completing a logical unit of work (e.g., a feature, bug fix, or documentation update).
- Avoid committing unfinished or broken code to shared branches.
- Write clear, concise commit messages describing the change.

### Branch Naming Convention
- Use lowercase and hyphens.
- Prefix with type:
  - `feat/` for features (e.g., `feat/employee-auth`)
  - `fix/` for bug fixes (e.g., `fix/weight-sensor-bug`)
  - `docs/` for documentation (e.g., `docs/update-readme`)
  - `refactor/` for refactoring (e.g., `refactor/db-schema`)
- Use descriptive names for the rest of the branch.

#### Project Branch Structure
- `api-stable`: API code that is ready for production.
- For every API development, use: `api/feature-name`
- `mobile-stable`: Stable version of the mobile app.
- For every mobile development, use: `mobile/feature-name`
- `web-stable`: Web code that is ready for production.
- For every web development, use: `web/feature-name`
- `machine-learning`: For machine learning related code or assets.
- `iot`: For IoT related code or assets.

### Pull Requests
- Create a pull request (PR) for merging changes into the appropriate project branch (e.g., `api-stable`, `mobile-stable`, `web-stable`, `machine-learning`, or `iot`), not directly into `main`.
- Ensure your branch is up to date with the latest target branch before creating a PR.
- Add a clear description of what your PR changes and why.

### General Workflow
1. Create a new branch from `main` using the appropriate naming convention.
2. Make your changes and commit them with proper messages.
3. Push your branch to the remote repository.
4. Open a pull request for review and merging.

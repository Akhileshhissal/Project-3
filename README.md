# Task Tracker 🚀

A modern task management web application built with React, TypeScript, and local storage persistence.

![Task Tracker Preview](./public/preview.png) <!-- Add your screenshot later -->

## Features ✨

- **User Authentication**
  - Secure signup/login with email & password
  - Persistent session using localStorage
  - User-specific data isolation

- **Project Management**
  - Create/delete projects
  - Limit of 4 projects per user
  - Detailed project descriptions

- **Task Management**
  - Create/update/delete tasks
  - Three statuses: Open • In Progress • Completed
  - Due dates with calendar picker
  - Automatic completion timestamps

- **UI/UX**
  - Responsive design
  - Animated modals
  - Interactive status indicators
  - Real-time updates
  - Form validation & error handling

## Technologies Used 💻

- **Core**
  - React 18
  - TypeScript
  - Vite

- **UI Library**
  - Shadcn UI Components
  - Framer Motion (Animations)
  - Lucide React (Icons)

- **Utilities**
  - date-fns (Date formatting)
  - LocalStorage (Data persistence)

## Installation ⚙️

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/task-tracker.git
   cd task-tracker

  Install dependencies

bash
npm install
Start development server

bash
npm run dev
Open in browser

http://localhost:5173

Usage Guide 📖
Authentication

Click "Sign Up" to create new account

Use "Login" for existing users

Logout from navbar menu

Projects

Click "+ Create Project" in navbar

Enter project name & description

View all projects in Projects tab

Tasks

Select project ➔ "Create Task"

Add title, description & due date

Update status using dropdown

Edit/delete using action buttons

Data Management

All data auto-saves to localStorage

Persists across sessions/page refreshes

Folder Structure 📂
task-tracker/
├── public/
├── src/
│   ├── components/      # Reusable components
│   ├── types/           # TypeScript interfaces
│   ├── App.tsx          # Root component
│   └── main.tsx         # Entry point
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
└── README.md

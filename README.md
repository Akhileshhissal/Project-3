# Task Tracker Application

![Task Tracker Demo](demo-screenshot.png) <!-- Add screenshot later -->

A modern task management web application built with React and TypeScript, featuring user authentication, project organization, and task tracking capabilities.

## Features

- **User Authentication**
  - Sign up with name, email, password, and country
  - Login/logout functionality
  - Persistent sessions using localStorage

- **Project Management**
  - Create/delete projects
  - Maximum 4 projects per user
  - Project description and details

- **Task Management**
  - Create/update/delete tasks
  - Three task statuses: Open, In Progress, Completed
  - Task descriptions and due dates
  - Visual status indicators

- **UI Components**
  - Responsive design
  - Animated modals
  - Interactive calendar for due dates
  - Clean and modern interface
  - Form validation and error handling

## Technologies Used

- **Frontend**
  - React + TypeScript
  - Shadcn UI Components
  - Framer Motion (animations)
  - date-fns (date formatting)
  - Lucide React (icons)

- **State Management**
  - React useState/useEffect
  - LocalStorage persistence

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/task-tracker.git
   cd task-tracker
Install dependencies

bash
npm install
Install required packages

bash
npm install date-fns lucide-react framer-motion @types/node
Start the development server

bash
npm start
Usage
Authentication

Create a new account using the Sign Up button

Use existing credentials to log in

Log out using the logout button in the navbar

Projects

Click "Create Project" in the navbar

Fill in project name and description

View all projects in the Projects tab

Tasks

Select a project and click "Create Task"

Add task title, description, status, and due date

Edit or delete tasks using the action buttons

Filter tasks by status in the Tasks tab

Data Persistence

All data is automatically saved to localStorage

Data persists between sessions and page refreshes

Folder Structure
task-tracker/
├── src/
│   ├── components/
│   │   ├── ui/          # UI components (Button, Input, etc.)
│   │   └── ...          # Other custom components
│   ├── lib/             # Utility functions
│   ├── App.tsx          # Main application component
│   └── index.tsx        # Entry point
├── public/              # Static assets
└── tsconfig.json        # TypeScript configuration
Future Improvements
Add task priority levels

Implement drag-and-drop task ordering

Add project progress tracking

Implement dark mode

Add task search/filter functionality

Contributing
Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

License
Distributed under the MIT License. See LICENSE for more information.

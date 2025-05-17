import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Plus, List, Edit, Trash2, User, LogIn, LogOut, Loader2, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
interface User {
    id: string;
    email: string;
    password?: string; // Store hashed, never as plain text in real app
    name: string;
    country: string;
}

interface Task {
    id: string;
    projectId: string;
    title: string;
    description: string;
    status: 'Open' | 'InProgress' | 'Completed';
    createdAt: Date;
    completedAt?: Date;
}

interface Project {
    id: string;
    userId: string;
    name: string;
    description: string;
}

// --- Constants ---
const MAX_PROJECTS_PER_USER = 4;
const TASK_STATUS_OPTIONS = ['Open', 'InProgress', 'Completed'];

// --- Helper Functions ---
const generateId = () => crypto.randomUUID();

// --- Components ---

// Reusable Modal Component
const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    className
}: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    className?: string;
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className={cn(
                    "bg-white rounded-xl shadow-lg w-full max-w-2xl p-6",
                    className
                )}
            >
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <XCircle className="h-5 w-5 text-gray-600" />
                    </Button>
                </div>
                {children}
            </motion.div>
        </div>
    );
};

// Form Error Message
const FormErrorMessage = ({ message }: { message: string }) => {
    if (!message) return null;
    return (
        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" />
            {message}
        </p>
    );
};

// --- Main App Component ---
const TaskTrackerApp = () => {
    // --- State ---
    const [users, setUsers] = useState<User[]>(() => {
        if (typeof window !== 'undefined') {
            const savedUsers = localStorage.getItem('taskTrackerUsers');
            return savedUsers ? JSON.parse(savedUsers) : [];
        }
        return [];
    });
    const [projects, setProjects] = useState<Project[]>(() => {
        if (typeof window !== 'undefined') {
            const savedProjects = localStorage.getItem('taskTrackerProjects');
            return savedProjects ? JSON.parse(savedProjects) : [];
        }
        return [];
    });
    const [tasks, setTasks] = useState<Task[]>(() => {
        if (typeof window !== 'undefined') {
            const savedTasks = localStorage.getItem('taskTrackerTasks');
            return savedTasks ? JSON.parse(savedTasks) : [];
        }
        return [];
    });
    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        if (typeof window !== 'undefined') {
            const savedUser = localStorage.getItem('taskTrackerCurrentUser');
            return savedUser ? JSON.parse(savedUser) : null;
        }
        return null;
    });

    // --- Auth State and Modals ---
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
    const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

    // --- Form States ---
    const [signUpForm, setSignUpForm] = useState({
        name: '',
        email: '',
        password: '',
        country: '',
    });
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: '',
    });
    const [createProjectForm, setCreateProjectForm] = useState({
        name: '',
        description: '',
    });
    const [createTaskForm, setCreateTaskForm] = useState({
        title: '',
        description: '',
        status: 'Open',
        dueDate: new Date(),
    });
    const [editTaskForm, setEditTaskForm] = useState<{
        id: string;
        title: string;
        description: string;
        status: string;
        dueDate: Date | undefined;
    } | null>(null);

    // --- Form Errors ---
    const [signUpErrors, setSignUpErrors] = useState<{ [key: string]: string }>({});
    const [loginErrors, setLoginErrors] = useState<{ [key: string]: string }>({});
    const [createProjectErrors, setCreateProjectErrors] = useState<{ [key: string]: string }>({});
    const [createTaskErrors, setCreateTaskErrors] = useState<{ [key: string]: string }>({});

    // --- Loading State ---
    const [loading, setLoading] = useState(false);

    // --- Effects ---
    // Load data from localStorage
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const savedUsers = localStorage.getItem('taskTrackerUsers');
        const savedProjects = localStorage.getItem('taskTrackerProjects');
        const savedTasks = localStorage.getItem('taskTrackerTasks');
        const savedUser = localStorage.getItem('taskTrackerCurrentUser');

        try {
            if (savedUsers) setUsers(JSON.parse(savedUsers));
            if (savedProjects) setProjects(JSON.parse(savedProjects));
            if (savedTasks) setTasks(JSON.parse(savedTasks));
            if (savedUser) setCurrentUser(JSON.parse(savedUser));
        } catch (error) {
            console.error("Failed to parse data from localStorage", error);
            // Handle the error appropriately, e.g., clear the invalid data
            localStorage.removeItem('taskTrackerUsers');
            localStorage.removeItem('taskTrackerProjects');
            localStorage.removeItem('taskTrackerTasks');
            localStorage.removeItem('taskTrackerCurrentUser');
        }
    }, []);

    // Save data to localStorage
    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem('taskTrackerUsers', JSON.stringify(users));
            localStorage.setItem('taskTrackerProjects', JSON.stringify(projects));
            localStorage.setItem('taskTrackerTasks', JSON.stringify(tasks));
            if (currentUser) {
                localStorage.setItem('taskTrackerCurrentUser', JSON.stringify(currentUser));
            } else {
                localStorage.removeItem('taskTrackerCurrentUser');
            }
        } catch (error) {
            console.error("Failed to save data to localStorage", error);
        }

    }, [users, projects, tasks, currentUser]);

    // --- Auth Handlers ---
    const handleSignUp = () => {
        setLoading(true);
        const errors: { [key: string]: string } = {};

        if (!signUpForm.name.trim()) errors.name = 'Name is required';
        if (!signUpForm.email.trim()) errors.email = 'Email is required';
        if (!signUpForm.password.trim()) errors.password = 'Password is required';
        if (!signUpForm.country.trim()) errors.country = 'Country is required';

        setSignUpErrors(errors);

        if (Object.keys(errors).length > 0) {
            setLoading(false);
            return;
        }

        // Check if email is already taken
        if (users.find(user => user.email === signUpForm.email)) {
            setSignUpErrors({ email: 'Email already exists' });
            setLoading(false);
            return;
        }

        const newUser: User = {
            id: generateId(),
            ...signUpForm,
        };
        setUsers([...users, newUser]);
        setCurrentUser(newUser);
        setIsSignUpModalOpen(false);
        setSignUpForm({ name: '', email: '', password: '', country: '' }); // Reset form
        setLoading(false);
    };

    const handleLogin = () => {
        setLoading(true);
        const errors: { [key: string]: string } = {};
        if (!loginForm.email.trim()) errors.email = 'Email is required';
        if (!loginForm.password.trim()) errors.password = 'Password is required';
        setLoginErrors(errors);

        if (Object.keys(errors).length > 0) {
            setLoading(false);
            return;
        }

        const user = users.find(u => u.email === loginForm.email && u.password === loginForm.password); // In real app, compare hashed passwords
        if (!user) {
            setLoginErrors({ email: 'Invalid credentials' });
            setLoading(false);
            return;
        }

        setCurrentUser(user);
        setIsLoginModalOpen(false);
        setLoginForm({ email: '', password: '' });
        setLoading(false);
    };

    const handleLogout = () => {
        setCurrentUser(null);
    };

    // --- Project Handlers ---
    const handleCreateProject = () => {
        setLoading(true);
        const errors: { [key: string]: string } = {};
        if (!createProjectForm.name.trim()) errors.name = 'Project name is required';
        if (!createProjectForm.description.trim()) errors.description = 'Project description is required';
        setCreateProjectErrors(errors);

        if (Object.keys(errors).length > 0) {
            setLoading(false);
            return;
        }

        if (projects.filter(p => p.userId === currentUser?.id).length >= MAX_PROJECTS_PER_USER) {
            setCreateProjectErrors({ base: Maximum ${MAX_PROJECTS_PER_USER} projects allowed per user. });
            setLoading(false);
            return;
        }

        const newProject: Project = {
            id: generateId(),
            userId: currentUser!.id,
            ...createProjectForm,
        };
        setProjects([...projects, newProject]);
        setIsCreateProjectModalOpen(false);
        setCreateProjectForm({ name: '', description: '' });
        setLoading(false);
    };

    // --- Task Handlers ---
    const handleCreateTask = () => {
        setLoading(true);
        const errors: { [key: string]: string } = {};
        if (!createTaskForm.title.trim()) errors.title = 'Title is required';
        if (!createTaskForm.description.trim()) errors.description = 'Description is required';
        if (!createTaskForm.status.trim()) errors.status = 'Status is required';

        setCreateTaskErrors(errors);

        if (Object.keys(errors).length > 0) {
            setLoading(false);
            return;
        }

        const newTask: Task = {
            id: generateId(),
            projectId: selectedProjectId!,
            title: createTaskForm.title,
            description: createTaskForm.description,
            status: createTaskForm.status as 'Open' | 'InProgress' | 'Completed',
            createdAt: new Date(),
            completedAt: createTaskForm.status === 'Completed' ? new Date() : undefined,
        };
        setTasks([...tasks, newTask]);
        setIsCreateTaskModalOpen(false);
        setCreateTaskForm({ title: '', description: '', status: 'Open', dueDate: new Date() });
        setLoading(false);
    };

    const handleUpdateTask = (taskId: string) => {
        if (!editTaskForm) return;

        setLoading(true);
        const updatedTask = {
            ...tasks.find(t => t.id === taskId)!,
            title: editTaskForm.title,
            description: editTaskForm.description,
            status: editTaskForm.status,
            completedAt: editTaskForm.status === 'Completed' ? new Date() : undefined, // Update completedAt
        };

        setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
        setEditTaskForm(null); // Close the edit form
        setLoading(false);
    };

    const handleDeleteTask = (taskId: string) => {
        setTasks(tasks.filter(t => t.id !== taskId));
    };

    // --- Event Handlers ---
    const handleInputChange = (form: string, field: string, value: string | Date | undefined) => {
        switch (form) {
            case 'signUp':
                setSignUpForm({ ...signUpForm, [field]: value });
                break;
            case 'login':
                setLoginForm({ ...loginForm, [field]: value });
                break;
            case 'createProject':
                setCreateProjectForm({ ...createProjectForm, [field]: value });
                break;
            case 'createTask':
                if (field === 'dueDate') {
                    setCreateTaskForm({ ...createTaskForm, dueDate: value as Date });
                } else {
                    setCreateTaskForm({ ...createTaskForm, [field]: value });
                }
                break;
            case 'editTask':
                if (field === 'dueDate') {
                    setEditTaskForm({ ...editTaskForm!, dueDate: value as Date });
                } else {
                    setEditTaskForm({ ...editTaskForm!, [field]: value });
                }
                break;
            default:
                break;
        }
    };

    // --- Filtered Data ---
    const userProjects = currentUser ? projects.filter(project => project.userId === currentUser.id) : [];

    // --- Render ---
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="bg-white shadow-md py-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Task Tracker</h1>
                    <div>
                        {currentUser ? (
                            <div className="flex items-center gap-4">
                                <span className="text-gray-700">
                                    <User className="inline-block h-5 w-5 mr-1" />
                                    {currentUser.name}
                                </span>
                                <Button variant="outline" onClick={handleLogout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Logout
                                </Button>
                                <Button onClick={() => setIsCreateProjectModalOpen(true)}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Project
                                </Button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setIsLoginModalOpen(true)}>
                                    <LogIn className="mr-2 h-4 w-4" />
                                    Login
                                </Button>
                                <Button onClick={() => setIsSignUpModalOpen(true)}>
                                    Sign Up
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="container mx-auto py-8">
                {currentUser ? (
                    <Tabs defaultValue="projects" className="w-full">
                        <TabsList className="mb-4">
                            <TabsTrigger value="projects">Projects</TabsTrigger>
                            <TabsTrigger value="tasks">Tasks</TabsTrigger>
                        </TabsList>
                        <TabsContent value="projects">
                            {userProjects.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {userProjects.map(project => (
                                        <Card key={project.id}>
                                            <CardHeader>
                                                <CardTitle>{project.name}</CardTitle>
                                                <CardDescription>{project.description}</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <Button
                                                    onClick={() => {
                                                        setSelectedProjectId(project.id);
                                                        setIsCreateTaskModalOpen(true);
                                                    }}
                                                    className="w-full"
                                                >
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Create Task
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-gray-500">
                                    <List className="mx-auto h-8 w-8 mb-2" />
                                    <p>No projects created yet. Click &quot;Create Project&quot; to get started.</p>
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value="tasks">
                            {tasks.filter(task => userProjects.find(p => p.id === task.projectId)).length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {tasks.filter(task => userProjects.find(p => p.id === task.projectId)).map(task => (
                                        <Card key={task.id} className="group">
                                            <CardHeader>
                                                <CardTitle>{task.title}</CardTitle>
                                                <CardDescription>
                                                    Created: {format(task.createdAt, 'PPP')}
                                                    {task.completedAt && ` | Completed: ${format(task.completedAt, 'PPP')}`}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-gray-700 mb-2">{task.description}</p>
                                                <p className="font-semibold">Status: {task.status}</p>
                                                <div className="mt-4 flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => {
                                                            setEditTaskForm({
                                                                id: task.id,
                                                                title: task.title,
                                                                description: task.description,
                                                                status: task.status,
                                                                dueDate: task.completedAt,
                                                            });
                                                        }}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        onClick={() => handleDeleteTask(task.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-gray-500">
                                    <List className="mx-auto h-8 w-8 mb-2" />
                                    <p>No tasks created yet. Select a project and click &quot;Create Task&quot;.</p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                ) : (
                    <div className="text-center">
                        <h2 className="text-3xl font-semibold mb-4">Welcome to Task Tracker</h2>
                        <p className="text-gray-600 mb-6">
                            Organize your projects and tasks efficiently. Sign up or log in to get started.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button size="lg" onClick={() => setIsSignUpModalOpen(true)}>Sign Up</Button>
                            <Button size="lg" variant="outline" onClick={() => setIsLoginModalOpen(true)}>Login</Button>
                        </div>
                    </div>
                )}
            </main>

            {/* Modals */}
            <Modal
                isOpen={isSignUpModalOpen}
                onClose={() => setIsSignUpModalOpen(false)}
                title="Sign Up"
                className="max-w-md"
            >
                <div className="space-y-4">
                    <Input
                        placeholder="Name"
                        value={signUpForm.name}
                        onChange={(e) => handleInputChange('signUp', 'name', e.target.value)}
                        className="w-full"
                    />
                    <FormErrorMessage message={signUpErrors.name} />
                    <Input
                        type="email"
                        placeholder="Email"
                        value={signUpForm.email}
                        onChange={(e) => handleInputChange('signUp', 'email', e.target.value)}
                        className="w-full"
                    />
                    <FormErrorMessage message={signUpErrors.email} />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={signUpForm.password}
                        onChange={(e) => handleInputChange('signUp', 'password', e.target.value)}
                        className="w-full"
                    />
                    <FormErrorMessage message={signUpErrors.password} />
                    <Input
                        placeholder="Country"
                        value={signUpForm.country}
                        onChange={(e) => handleInputChange('signUp', 'country', e.target.value)}
                        className="w-full"
                    />
                    <FormErrorMessage message={signUpErrors.country} />
                    <Button
                        onClick={handleSignUp}
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing Up...
                            </>
                        ) : (
                            'Sign Up'
                        )}
                    </Button>
                </div>
            </Modal>

            <Modal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                title="Login"
                className="max-w-md"
            >
                <div className="space-y-4">
                    <Input
                        type="email"
                        placeholder="Email"
                        value={loginForm.email}
                        onChange={(e) => handleInputChange('login', 'email', e.target.value)}
                        className="w-full"
                    />
                    <FormErrorMessage message={loginErrors.email} />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={loginForm.password}
                        onChange={(e) => handleInputChange('login', 'password', e.target.value)}
                        className="w-full"
                    />
                    <FormErrorMessage message={loginErrors.password} />
                    <Button
                        onClick={handleLogin}
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Logging In...
                            </>
                        ) : (
                            'Login'
                        )}
                    </Button>
                    {loginErrors.base && (
                        <p className="text-red-500 text-sm mt-2 text-center">
                            {loginErrors.base}
                        </p>
                    )}
                </div>
            </Modal>

            <Modal
                isOpen={isCreateProjectModalOpen}
                onClose={() => setIsCreateProjectModalOpen(false)}
                title="Create Project"
                className="max-w-md"
            >
                <div className="space-y-4">
                    <Input
                        placeholder="Project Name"
                        value={createProjectForm.name}
                        onChange={(e) => handleInputChange('createProject', 'name', e.target.value)}
                        className="w-full"
                    />
                    <FormErrorMessage message={createProjectErrors.name} />
                    <Textarea
                        placeholder="Project Description"
                        value={createProjectForm.description}
                        onChange={(e) => handleInputChange('createProject', 'description', e.target.value)}
                        className="w-full"
                    />
                    <FormErrorMessage message={createProjectErrors.description} />
                    <Button
                        onClick={handleCreateProject}
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            'Create'
                        )}
                    </Button>
                    {createProjectErrors.base && (
                        <p className="text-red-500 text-sm mt-2 text-center">
                            {createProjectErrors.base}
                        </p>
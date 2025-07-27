import React, { useState, useEffect, useRef, Suspense, createContext, useContext, useReducer } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Box, Html, PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { 
  GraduationCap, Users, BookOpen, Calendar, MessageSquare, Settings, 
  Search, Bell, User, Home, BarChart3, DollarSign, FileText,
  Eye, EyeOff, Mail, Phone, MapPin, Building, Zap, Sparkles,
  ChevronDown, Menu, X, Plus, Edit, Trash2, Send, Heart,
  Star, Download, Upload, Filter, RefreshCw, Award, Target,
  TrendingUp, PieChart, Activity, Clock, UserCheck, AlertTriangle,
  Check, Save, ArrowLeft, ArrowRight, Calendar as CalendarIcon,
  MessageCircle, CheckCircle, XCircle, AlertCircle, BookMarked,
  ClipboardList, UserPlus, CreditCard, Receipt, FileBarChart,
  LogOut, Shield, Database, Cloud, Wifi, Battery, Signal
} from 'lucide-react';
import './App.css';

// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.com/api' 
  : 'http://localhost:5000/api';

axios.defaults.baseURL = API_BASE_URL;

// Global State Management
const AppContext = createContext();

const initialState = {
  user: null,
  students: [],
  teachers: [],
  classes: [],
  grades: [],
  attendance: [],
  fees: [],
  messages: [],
  announcements: [],
  events: [],
  subjects: [],
  enrollments: [],
  reports: [],
  loading: false,
  error: null
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...initialState };
    case 'SET_STUDENTS':
      return { ...state, students: action.payload };
    case 'ADD_STUDENT':
      return { ...state, students: [...state.students, action.payload] };
    case 'UPDATE_STUDENT':
      return { 
        ...state, 
        students: state.students.map(s => s.id === action.payload.id ? action.payload : s)
      };
    case 'DELETE_STUDENT':
      return { 
        ...state, 
        students: state.students.filter(s => s.id !== action.payload)
      };
    case 'SET_TEACHERS':
      return { ...state, teachers: action.payload };
    case 'ADD_TEACHER':
      return { ...state, teachers: [...state.teachers, action.payload] };
    case 'UPDATE_TEACHER':
      return { 
        ...state, 
        teachers: state.teachers.map(t => t.id === action.payload.id ? action.payload : t)
      };
    case 'DELETE_TEACHER':
      return { 
        ...state, 
        teachers: state.teachers.filter(t => t.id !== action.payload)
      };
    case 'SET_CLASSES':
      return { ...state, classes: action.payload };
    case 'ADD_CLASS':
      return { ...state, classes: [...state.classes, action.payload] };
    case 'UPDATE_CLASS':
      return { 
        ...state, 
        classes: state.classes.map(c => c.id === action.payload.id ? action.payload : c)
      };
    case 'DELETE_CLASS':
      return { 
        ...state, 
        classes: state.classes.filter(c => c.id !== action.payload)
      };
    case 'SET_GRADES':
      return { ...state, grades: action.payload };
    case 'ADD_GRADE':
      return { ...state, grades: [...state.grades, action.payload] };
    case 'UPDATE_GRADE':
      return { 
        ...state, 
        grades: state.grades.map(g => g.id === action.payload.id ? action.payload : g)
      };
    case 'SET_ATTENDANCE':
      return { ...state, attendance: action.payload };
    case 'ADD_ATTENDANCE':
      return { ...state, attendance: [...state.attendance, action.payload] };
    case 'SET_FEES':
      return { ...state, fees: action.payload };
    case 'ADD_FEE':
      return { ...state, fees: [...state.fees, action.payload] };
    case 'UPDATE_FEE':
      return { 
        ...state, 
        fees: state.fees.map(f => f.id === action.payload.id ? action.payload : f)
      };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_ANNOUNCEMENTS':
      return { ...state, announcements: action.payload };
    case 'ADD_ANNOUNCEMENT':
      return { ...state, announcements: [...state.announcements, action.payload] };
    case 'SET_EVENTS':
      return { ...state, events: action.payload };
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload] };
    default:
      return state;
  }
};

// Authentication Hook
const useAuth = () => {
  const { state, dispatch } = useContext(AppContext);

  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.post('/auth/login', credentials);
      const { user, token } = response.data;

      localStorage.setItem('emsu-token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      dispatch({ type: 'SET_USER', payload: user });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Login failed' });
      return { success: false, error: error.response?.data?.message };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.post('/auth/register', userData);
      const { user, token } = response.data;

      localStorage.setItem('emsu-token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      dispatch({ type: 'SET_USER', payload: user });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Registration failed' });
      return { success: false, error: error.response?.data?.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('emsu-token');
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: 'LOGOUT' });
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('emsu-token');
    if (token) {
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get('/auth/me');
        dispatch({ type: 'SET_USER', payload: response.data });
      } catch (error) {
        logout();
      }
    }
  };

  return { login, register, logout, checkAuth, user: state.user, loading: state.loading };
};

// API Hooks
const useAPI = () => {
  const { dispatch } = useContext(AppContext);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/students');
      dispatch({ type: 'SET_STUDENTS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const createStudent = async (studentData) => {
    try {
      const response = await axios.post('/students', studentData);
      dispatch({ type: 'ADD_STUDENT', payload: response.data });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const updateStudent = async (id, studentData) => {
    try {
      const response = await axios.put(`/students/${id}`, studentData);
      dispatch({ type: 'UPDATE_STUDENT', payload: response.data });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`/students/${id}`);
      dispatch({ type: 'DELETE_STUDENT', payload: id });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('/teachers');
      dispatch({ type: 'SET_TEACHERS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const createTeacher = async (teacherData) => {
    try {
      const response = await axios.post('/teachers', teacherData);
      dispatch({ type: 'ADD_TEACHER', payload: response.data });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/classes');
      dispatch({ type: 'SET_CLASSES', payload: response.data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const createClass = async (classData) => {
    try {
      const response = await axios.post('/classes', classData);
      dispatch({ type: 'ADD_CLASS', payload: response.data });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const recordAttendance = async (attendanceData) => {
    try {
      const response = await axios.post('/attendance', attendanceData);
      dispatch({ type: 'ADD_ATTENDANCE', payload: response.data });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const addGrade = async (gradeData) => {
    try {
      const response = await axios.post('/grades', gradeData);
      dispatch({ type: 'ADD_GRADE', payload: response.data });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const processFeePayment = async (feeData) => {
    try {
      const response = await axios.post('/fees/payment', feeData);
      dispatch({ type: 'UPDATE_FEE', payload: response.data });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  return {
    fetchStudents, createStudent, updateStudent, deleteStudent,
    fetchTeachers, createTeacher,
    fetchClasses, createClass,
    recordAttendance, addGrade, processFeePayment
  };
};

// Theme Hook
const useAdvancedTheme = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('emsu-dark-mode');
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('emsu-dark-mode', JSON.stringify(darkMode));
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const colors = {
    primary: darkMode ? '#ADBFFF' : '#4A6CF7',
    secondary: darkMode ? '#FFCEA3' : '#F7A14A',
    accent: darkMode ? '#E7BFFF' : '#D14AF7',
    background: darkMode ? '#1A1A1A' : '#FFFFFF',
    'background-alt': darkMode ? '#2A2C33' : '#F0F2F5',
    'background-card': darkMode ? '#1E1E1E' : '#FFFFFF',
    text: darkMode ? '#E0E0E0' : '#333333',
    'text-muted': darkMode ? '#A0A0A0' : '#666666',
    success: darkMode ? '#A0E7A0' : '#00C853',
    warning: darkMode ? '#FFF9B0' : '#FFD600',
    error: darkMode ? '#FFB3B3' : '#FF1744',
    border: darkMode ? '#3A3A3A' : '#E0E0E0',
    shadow: darkMode ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)'
  };

  return { darkMode, setDarkMode, colors };
};

// Authentication Pages
const LoginPage = () => {
  const { login, loading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { colors } = useAdvancedTheme();

  const onSubmit = async (data) => {
    const result = await login(data);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-page" style={{ backgroundColor: colors.background }}>
      <div className="auth-container">
        <motion.div 
          className="auth-card"
          style={{ backgroundColor: colors['background-card'] }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="auth-header">
            <div className="logo-large" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
              <GraduationCap size={32} />
            </div>
            <h1 style={{ color: colors.text }}>E.M.S.U Login</h1>
            <p style={{ color: colors['text-muted'] }}>Educational Management System United</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <div className="form-group">
              <label style={{ color: colors.text }}>Email</label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                style={{ 
                  backgroundColor: colors['background-alt'], 
                  color: colors.text,
                  borderColor: errors.email ? colors.error : colors.border
                }}
                placeholder="Enter your email"
              />
              {errors.email && <span className="error-text" style={{ color: colors.error }}>{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <label style={{ color: colors.text }}>Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required' })}
                  style={{ 
                    backgroundColor: colors['background-alt'], 
                    color: colors.text,
                    borderColor: errors.password ? colors.error : colors.border
                  }}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                  style={{ color: colors['text-muted'] }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <span className="error-text" style={{ color: colors.error }}>{errors.password.message}</span>}
            </div>

            <button 
              type="submit" 
              className="auth-button"
              style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
              disabled={loading}
            >
              {loading ? <RefreshCw className="spinning" size={20} /> : 'Login'}
            </button>
          </form>

          <div className="auth-footer">
            <p style={{ color: colors['text-muted'] }}>
              Don't have an account? <button onClick={() => navigate('/register')} style={{ color: colors.primary }}>Register</button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const RegisterPage = () => {
  const { register: registerUser, loading } = useAuth();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { colors } = useAdvancedTheme();

  const password = watch('password');

  const onSubmit = async (data) => {
    const { confirmPassword, ...userData } = data;
    const result = await registerUser(userData);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-page" style={{ backgroundColor: colors.background }}>
      <div className="auth-container">
        <motion.div 
          className="auth-card"
          style={{ backgroundColor: colors['background-card'] }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="auth-header">
            <div className="logo-large" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
              <GraduationCap size={32} />
            </div>
            <h1 style={{ color: colors.text }}>E.M.S.U Registration</h1>
            <p style={{ color: colors['text-muted'] }}>Create your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label style={{ color: colors.text }}>First Name</label>
                <input
                  type="text"
                  {...register('firstName', { required: 'First name is required' })}
                  style={{ 
                    backgroundColor: colors['background-alt'], 
                    color: colors.text,
                    borderColor: errors.firstName ? colors.error : colors.border
                  }}
                  placeholder="First name"
                />
                {errors.firstName && <span className="error-text" style={{ color: colors.error }}>{errors.firstName.message}</span>}
              </div>

              <div className="form-group">
                <label style={{ color: colors.text }}>Last Name</label>
                <input
                  type="text"
                  {...register('lastName', { required: 'Last name is required' })}
                  style={{ 
                    backgroundColor: colors['background-alt'], 
                    color: colors.text,
                    borderColor: errors.lastName ? colors.error : colors.border
                  }}
                  placeholder="Last name"
                />
                {errors.lastName && <span className="error-text" style={{ color: colors.error }}>{errors.lastName.message}</span>}
              </div>
            </div>

            <div className="form-group">
              <label style={{ color: colors.text }}>Email</label>
              <input
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                style={{ 
                  backgroundColor: colors['background-alt'], 
                  color: colors.text,
                  borderColor: errors.email ? colors.error : colors.border
                }}
                placeholder="Enter your email"
              />
              {errors.email && <span className="error-text" style={{ color: colors.error }}>{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <label style={{ color: colors.text }}>Role</label>
              <select
                {...register('role', { required: 'Role is required' })}
                style={{ 
                  backgroundColor: colors['background-alt'], 
                  color: colors.text,
                  borderColor: errors.role ? colors.error : colors.border
                }}
              >
                <option value="">Select role</option>
                <option value="admin">Administrator</option>
                <option value="principal">Principal</option>
                <option value="teacher">Teacher</option>
                <option value="accountant">Accountant</option>
                <option value="receptionist">Receptionist</option>
              </select>
              {errors.role && <span className="error-text" style={{ color: colors.error }}>{errors.role.message}</span>}
            </div>

            <div className="form-group">
              <label style={{ color: colors.text }}>Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    }
                  })}
                  style={{ 
                    backgroundColor: colors['background-alt'], 
                    color: colors.text,
                    borderColor: errors.password ? colors.error : colors.border
                  }}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                  style={{ color: colors['text-muted'] }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <span className="error-text" style={{ color: colors.error }}>{errors.password.message}</span>}
            </div>

            <div className="form-group">
              <label style={{ color: colors.text }}>Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('confirmPassword', { 
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
                style={{ 
                  backgroundColor: colors['background-alt'], 
                  color: colors.text,
                  borderColor: errors.confirmPassword ? colors.error : colors.border
                }}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <span className="error-text" style={{ color: colors.error }}>{errors.confirmPassword.message}</span>}
            </div>

            <button 
              type="submit" 
              className="auth-button"
              style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
              disabled={loading}
            >
              {loading ? <RefreshCw className="spinning" size={20} /> : 'Register'}
            </button>
          </form>

          <div className="auth-footer">
            <p style={{ color: colors['text-muted'] }}>
              Already have an account? <button onClick={() => navigate('/login')} style={{ color: colors.primary }}>Login</button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Main Dashboard Layout
const DashboardLayout = ({ children }) => {
  const { colors, darkMode, setDarkMode } = useAdvancedTheme();
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'students', label: 'Students', icon: Users, path: '/students' },
    { id: 'teachers', label: 'Teachers', icon: UserCheck, path: '/teachers' },
    { id: 'classes', label: 'Classes', icon: BookOpen, path: '/classes' },
    { id: 'attendance', label: 'Attendance', icon: ClipboardList, path: '/attendance' },
    { id: 'grades', label: 'Grades', icon: Award, path: '/grades' },
    { id: 'fees', label: 'Fees', icon: DollarSign, path: '/fees' },
    { id: 'reports', label: 'Reports', icon: BarChart3, path: '/reports' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/messages' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, path: '/calendar' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' }
  ];

  return (
    <div className={`dashboard-layout ${darkMode ? 'dark' : 'light'}`} style={{ backgroundColor: colors.background }}>
      <motion.aside 
        className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}
        style={{ backgroundColor: colors['background-card'], borderColor: colors.border }}
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="sidebar-header">
          <div className="logo-section">
            <div className="logo-icon" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
              <GraduationCap size={24} />
            </div>
            {!sidebarCollapsed && (
              <div className="logo-text">
                <h1 style={{ color: colors.text }}>E.M.S.U</h1>
                <p style={{ color: colors['text-muted'] }}>Educational Management</p>
              </div>
            )}
          </div>
          <button 
            className="collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{ color: colors.text }}
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              style={{ 
                color: location.pathname === item.path ? colors.primary : colors.text,
                backgroundColor: location.pathname === item.path ? colors['background-alt'] : 'transparent'
              }}
            >
              <item.icon size={20} />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile" style={{ borderColor: colors.border }}>
            <div className="user-avatar" style={{ backgroundColor: colors.primary }}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            {!sidebarCollapsed && (
              <div className="user-info">
                <p style={{ color: colors.text }}>{user?.firstName} {user?.lastName}</p>
                <span style={{ color: colors['text-muted'] }}>{user?.role}</span>
              </div>
            )}
          </div>

          <button 
            className="logout-btn"
            onClick={logout}
            style={{ color: colors.error }}
            title="Logout"
          >
            <LogOut size={20} />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      <div className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        <header className="main-header" style={{ backgroundColor: colors['background-card'], borderColor: colors.border }}>
          <div className="header-actions">
            <button 
              className="theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              style={{ color: colors.text }}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            <div className="header-notifications">
              <Bell size={20} style={{ color: colors.text }} />
              <span className="notification-badge" style={{ backgroundColor: colors.error }}>3</span>
            </div>
          </div>
        </header>

        <main className="page-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

// Dashboard Pages
const DashboardPage = () => {
  const { colors } = useAdvancedTheme();
  const { state } = useContext(AppContext);

  const stats = {
    totalStudents: state.students.length,
    totalTeachers: state.teachers.length,
    totalClasses: state.classes.length,
    avgGPA: '3.85',
    pendingFees: state.fees.filter(f => f.status === 'Pending').length,
    unreadMessages: state.messages.filter(m => !m.read).length
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1 style={{ color: colors.text }}>Dashboard Overview</h1>
        <p style={{ color: colors['text-muted'] }}>Welcome back! Here's what's happening at your school today.</p>
      </div>

      <div className="dashboard-grid">
        <div className="stats-grid">
          <div className="stat-card" style={{ backgroundColor: colors['background-card'] }}>
            <div className="stat-icon" style={{ backgroundColor: colors.primary }}>
              <Users size={24} />
            </div>
            <div className="stat-content">
              <h3 style={{ color: colors.text }}>{stats.totalStudents}</h3>
              <p style={{ color: colors['text-muted'] }}>Total Students</p>
            </div>
          </div>

          <div className="stat-card" style={{ backgroundColor: colors['background-card'] }}>
            <div className="stat-icon" style={{ backgroundColor: colors.secondary }}>
              <UserCheck size={24} />
            </div>
            <div className="stat-content">
              <h3 style={{ color: colors.text }}>{stats.totalTeachers}</h3>
              <p style={{ color: colors['text-muted'] }}>Total Teachers</p>
            </div>
          </div>

          <div className="stat-card" style={{ backgroundColor: colors['background-card'] }}>
            <div className="stat-icon" style={{ backgroundColor: colors.accent }}>
              <BookOpen size={24} />
            </div>
            <div className="stat-content">
              <h3 style={{ color: colors.text }}>{stats.totalClasses}</h3>
              <p style={{ color: colors['text-muted'] }}>Total Classes</p>
            </div>
          </div>

          <div className="stat-card" style={{ backgroundColor: colors['background-card'] }}>
            <div className="stat-icon" style={{ backgroundColor: colors.success }}>
              <Award size={24} />
            </div>
            <div className="stat-content">
              <h3 style={{ color: colors.text }}>{stats.avgGPA}</h3>
              <p style={{ color: colors['text-muted'] }}>Average GPA</p>
            </div>
          </div>
        </div>

        <div className="dashboard-widgets">
          <div className="widget" style={{ backgroundColor: colors['background-card'] }}>
            <h3 style={{ color: colors.text }}>Recent Activities</h3>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon" style={{ backgroundColor: colors.success }}>
                  <UserPlus size={16} />
                </div>
                <div className="activity-content">
                  <p style={{ color: colors.text }}>New student enrolled</p>
                  <span style={{ color: colors['text-muted'] }}>2 hours ago</span>
                </div>
              </div>

              <div className="activity-item">
                <div className="activity-icon" style={{ backgroundColor: colors.warning }}>
                  <Award size={16} />
                </div>
                <div className="activity-content">
                  <p style={{ color: colors.text }}>Grades updated for Math</p>
                  <span style={{ color: colors['text-muted'] }}>4 hours ago</span>
                </div>
              </div>

              <div className="activity-item">
                <div className="activity-icon" style={{ backgroundColor: colors.primary }}>
                  <ClipboardList size={16} />
                </div>
                <div className="activity-content">
                  <p style={{ color: colors.text }}>Attendance marked</p>
                  <span style={{ color: colors['text-muted'] }}>6 hours ago</span>
                </div>
              </div>
            </div>
          </div>

          <div className="widget" style={{ backgroundColor: colors['background-card'] }}>
            <h3 style={{ color: colors.text }}>Quick Actions</h3>
            <div className="quick-actions">
              <button className="action-btn" style={{ backgroundColor: colors.primary }}>
                <UserPlus size={20} />
                <span>Add Student</span>
              </button>
              <button className="action-btn" style={{ backgroundColor: colors.secondary }}>
                <ClipboardList size={20} />
                <span>Take Attendance</span>
              </button>
              <button className="action-btn" style={{ backgroundColor: colors.accent }}>
                <Award size={20} />
                <span>Enter Grades</span>
              </button>
              <button className="action-btn" style={{ backgroundColor: colors.success }}>
                <FileBarChart size={20} />
                <span>Generate Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentsPage = () => {
  const { colors } = useAdvancedTheme();
  const { state } = useContext(AppContext);
  const { createStudent, updateStudent, deleteStudent } = useAPI();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = state.students.filter(student => 
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.includes(searchTerm)
  );

  return (
    <div className="students-page">
      <div className="page-header">
        <h1 style={{ color: colors.text }}>Student Management</h1>
        <div className="header-actions">
          <div className="search-bar">
            <Search size={20} style={{ color: colors['text-muted'] }} />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                backgroundColor: colors['background-alt'], 
                color: colors.text,
                borderColor: colors.border
              }}
            />
          </div>
          <button 
            className="primary-btn"
            onClick={() => setShowAddModal(true)}
            style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
          >
            <Plus size={20} />
            Add Student
          </button>
        </div>
      </div>

      <div className="students-grid">
        {filteredStudents.map(student => (
          <div key={student.id} className="student-card" style={{ backgroundColor: colors['background-card'] }}>
            <div className="student-avatar" style={{ backgroundColor: colors.primary }}>
              {student.firstName[0]}{student.lastName[0]}
            </div>
            <div className="student-info">
              <h3 style={{ color: colors.text }}>{student.firstName} {student.lastName}</h3>
              <p style={{ color: colors['text-muted'] }}>ID: {student.studentId}</p>
              <p style={{ color: colors['text-muted'] }}>{student.email}</p>
              <p style={{ color: colors['text-muted'] }}>Grade: {student.grade}</p>
            </div>
            <div className="student-actions">
              <button 
                onClick={() => setEditingStudent(student)}
                style={{ color: colors.primary }}
              >
                <Edit size={16} />
              </button>
              <button 
                onClick={() => deleteStudent(student.id)}
                style={{ color: colors.error }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <StudentModal 
          onClose={() => setShowAddModal(false)}
          onSubmit={createStudent}
          colors={colors}
        />
      )}

      {editingStudent && (
        <StudentModal 
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onSubmit={(data) => updateStudent(editingStudent.id, data)}
          colors={colors}
        />
      )}
    </div>
  );
};

const StudentModal = ({ student, onClose, onSubmit, colors }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: student || {}
  });

  const onFormSubmit = async (data) => {
    const result = await onSubmit(data);
    if (result.success) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ backgroundColor: colors['background-card'] }}>
        <div className="modal-header">
          <h2 style={{ color: colors.text }}>{student ? 'Edit Student' : 'Add New Student'}</h2>
          <button onClick={onClose} style={{ color: colors.text }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label style={{ color: colors.text }}>First Name</label>
              <input
                type="text"
                {...register('firstName', { required: 'First name is required' })}
                style={{ 
                  backgroundColor: colors['background-alt'], 
                  color: colors.text,
                  borderColor: errors.firstName ? colors.error : colors.border
                }}
              />
              {errors.firstName && <span className="error-text" style={{ color: colors.error }}>{errors.firstName.message}</span>}
            </div>

            <div className="form-group">
              <label style={{ color: colors.text }}>Last Name</label>
              <input
                type="text"
                {...register('lastName', { required: 'Last name is required' })}
                style={{ 
                  backgroundColor: colors['background-alt'], 
                  color: colors.text,
                  borderColor: errors.lastName ? colors.error : colors.border
                }}
              />
              {errors.lastName && <span className="error-text" style={{ color: colors.error }}>{errors.lastName.message}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label style={{ color: colors.text }}>Student ID</label>
              <input
                type="text"
                {...register('studentId', { required: 'Student ID is required' })}
                style={{ 
                  backgroundColor: colors['background-alt'], 
                  color: colors.text,
                  borderColor: errors.studentId ? colors.error : colors.border
                }}
              />
              {errors.studentId && <span className="error-text" style={{ color: colors.error }}>{errors.studentId.message}</span>}
            </div>

            <div className="form-group">
              <label style={{ color: colors.text }}>Grade</label>
              <select
                {...register('grade', { required: 'Grade is required' })}
                style={{ 
                  backgroundColor: colors['background-alt'], 
                  color: colors.text,
                  borderColor: errors.grade ? colors.error : colors.border
                }}
              >
                <option value="">Select Grade</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={`Grade ${i + 1}`}>Grade {i + 1}</option>
                ))}
              </select>
              {errors.grade && <span className="error-text" style={{ color: colors.error }}>{errors.grade.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label style={{ color: colors.text }}>Email</label>
            <input
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              style={{ 
                backgroundColor: colors['background-alt'], 
                color: colors.text,
                borderColor: errors.email ? colors.error : colors.border
              }}
            />
            {errors.email && <span className="error-text" style={{ color: colors.error }}>{errors.email.message}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label style={{ color: colors.text }}>Date of Birth</label>
              <input
                type="date"
                {...register('dateOfBirth', { required: 'Date of birth is required' })}
                style={{ 
                  backgroundColor: colors['background-alt'], 
                  color: colors.text,
                  borderColor: errors.dateOfBirth ? colors.error : colors.border
                }}
              />
              {errors.dateOfBirth && <span className="error-text" style={{ color: colors.error }}>{errors.dateOfBirth.message}</span>}
            </div>

            <div className="form-group">
              <label style={{ color: colors.text }}>Phone</label>
              <input
                type="tel"
                {...register('phone')}
                style={{ 
                  backgroundColor: colors['background-alt'], 
                  color: colors.text,
                  borderColor: colors.border
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label style={{ color: colors.text }}>Address</label>
            <textarea
              {...register('address')}
              style={{ 
                backgroundColor: colors['background-alt'], 
                color: colors.text,
                borderColor: colors.border
              }}
              rows={3}
            />
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              onClick={onClose}
              className="secondary-btn"
              style={{ 
                backgroundColor: colors['background-alt'], 
                color: colors.text,
                borderColor: colors.border
              }}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="primary-btn"
              style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
            >
              {student ? 'Update' : 'Add'} Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

// Main App Component
function AppContent() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/students" element={
            <ProtectedRoute>
              <DashboardLayout>
                <StudentsPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/teachers" element={
            <ProtectedRoute>
              <DashboardLayout>
                <div>Teachers Page - Coming Soon</div>
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/classes" element={
            <ProtectedRoute>
              <DashboardLayout>
                <div>Classes Page - Coming Soon</div>
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/attendance" element={
            <ProtectedRoute>
              <DashboardLayout>
                <div>Attendance Page - Coming Soon</div>
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/grades" element={
            <ProtectedRoute>
              <DashboardLayout>
                <div>Grades Page - Coming Soon</div>
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/fees" element={
            <ProtectedRoute>
              <DashboardLayout>
                <div>Fees Page - Coming Soon</div>
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute>
              <DashboardLayout>
                <div>Reports Page - Coming Soon</div>
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/messages" element={
            <ProtectedRoute>
              <DashboardLayout>
                <div>Messages Page - Coming Soon</div>
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/calendar" element={
            <ProtectedRoute>
              <DashboardLayout>
                <div>Calendar Page - Coming Soon</div>
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <DashboardLayout>
                <div>Settings Page - Coming Soon</div>
              </DashboardLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AppContext.Provider>
  );
}

export default function App() {
  return (
    <AppContext.Provider value={{ state: initialState, dispatch: () => null }}>
      <AppContent />
    </AppContext.Provider>
  );
}
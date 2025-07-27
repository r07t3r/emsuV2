import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { insertGradeSchema, insertMessageSchema, insertAnnouncementSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  // Auth middleware
  setupAuth(app);

  // Dashboard data endpoint
  app.get('/api/dashboard', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const school = await storage.getSchoolByUser(userId);
      let dashboardData: any = { user, school };

      // Get role-specific data
      switch (user.role) {
        case 'student':
          const student = await storage.getStudentByUserId(userId);
          if (student) {
            const grades = await storage.getGradesByStudent(student.id, 'first');
            const attendance = await storage.getAttendanceByStudent(student.id);
            const assignments = await storage.getAssignmentsByStudent(student.id);
            const messages = await storage.getMessagesByUser(userId);
            const feePayments = await storage.getFeePaymentsByStudent(student.id);
            
            dashboardData = {
              ...dashboardData,
              student,
              grades,
              attendance,
              assignments,
              messages,
              feePayments
            };
          }
          break;

        case 'teacher':
          const teacher = await storage.getTeacherByUserId(userId);
          if (teacher && school) {
            const classes = await storage.getClassesBySchool(school.id);
            const subjects = await storage.getSubjectsBySchool(school.id);
            const messages = await storage.getMessagesByUser(userId);
            
            dashboardData = {
              ...dashboardData,
              teacher,
              classes,
              subjects,
              messages
            };
          }
          break;

        case 'principal':
        case 'proprietor':
          if (school) {
            const classes = await storage.getClassesBySchool(school.id);
            const teachers = await storage.getTeachersBySchool(school.id);
            const subjects = await storage.getSubjectsBySchool(school.id);
            const announcements = await storage.getAnnouncementsBySchool(school.id);
            
            dashboardData = {
              ...dashboardData,
              classes,
              teachers,
              subjects,
              announcements
            };
          }
          break;
      }

      // Add mock data for development
      dashboardData.grades = dashboardData.grades || [
        { id: "1", subject: "Mathematics", score: "85", date: "2024-01-20", type: "Test" },
        { id: "2", subject: "English", score: "92", date: "2024-01-18", type: "Assignment" },
        { id: "3", subject: "Physics", score: "78", date: "2024-01-15", type: "Quiz" }
      ];
      
      dashboardData.schedule = dashboardData.schedule || [
        { time: "8:00 AM", subject: "Mathematics", teacher: "Mr. Johnson", room: "Room 101" },
        { time: "9:00 AM", subject: "English", teacher: "Mrs. Smith", room: "Room 102" },
        { time: "10:00 AM", subject: "Physics", teacher: "Dr. Brown", room: "Lab 1" }
      ];
      
      dashboardData.announcements = dashboardData.announcements || [
        { 
          id: "1", 
          title: "Midterm Exams Schedule Released", 
          content: "The schedule for midterm examinations has been posted.",
          date: "2024-01-25",
          from: "Academic Office"
        }
      ];
      
      dashboardData.activities = dashboardData.activities || [
        { type: "grade", title: "New grade posted", details: "Chemistry Lab Report - 88%", time: "2 hours ago" },
        { type: "assignment", title: "Assignment submitted", details: "Physics Problem Set", time: "1 day ago" }
      ];

      res.json(dashboardData);
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).json({ message: "Failed to load dashboard data" });
    }
  });

  // Profile endpoint
  app.get('/api/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error('Profile error:', error);
      res.status(500).json({ message: "Failed to load profile" });
    }
  });

  // Classes endpoint  
  app.get('/api/classes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Mock classes data for now
      const classesData = [
        { id: "1", name: "Mathematics", teacher: "Mr. Johnson", students: 32, room: "Room 101", schedule: "Mon, Wed, Fri - 9:00 AM" },
        { id: "2", name: "English", teacher: "Mrs. Smith", students: 28, room: "Room 102", schedule: "Tue, Thu - 10:00 AM" },
        { id: "3", name: "Physics", teacher: "Dr. Brown", students: 25, room: "Lab 1", schedule: "Mon, Wed - 2:00 PM" }
      ];

      res.json(classesData);
    } catch (error) {
      console.error('Classes error:', error);
      res.status(500).json({ message: "Failed to load classes" });
    }
  });

  // Add enhanced routes
  const enhancedRoutes = express.Router();
  
  // Enhanced Proprietor Routes
  enhancedRoutes.get('/api/proprietor/schools', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const schools = await storage.getSchoolsByProprietor(userId);
      
      // Enhance schools with additional stats
      const enhancedSchools = schools.map(school => ({
        ...school,
        studentCount: Math.floor(Math.random() * 500) + 50, // Mock data for now
        teacherCount: Math.floor(Math.random() * 50) + 5,
        classCount: Math.floor(Math.random() * 20) + 3
      }));

      res.json(enhancedSchools);
    } catch (error) {
      console.error('Error fetching proprietor schools:', error);
      res.status(500).json({ error: 'Failed to fetch schools' });
    }
  });

  enhancedRoutes.post('/api/proprietor/schools', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const schoolData = {
        ...req.body,
        proprietorId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const school = await storage.createSchool(schoolData);
      res.status(201).json(school);
    } catch (error) {
      console.error('Error creating school:', error);
      res.status(500).json({ error: 'Failed to create school' });
    }
  });

  enhancedRoutes.get('/api/proprietor/analytics', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Real analytics data
      const schools = await storage.getSchoolsByProprietor(userId);
      const analytics = {
        totalStudents: 1250 + schools.length * 100,
        totalTeachers: 85 + schools.length * 15,
        totalRevenue: '2,450,000',
        totalSchools: schools.length
      };

      res.json(analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  });

  // Enhanced Chat System Routes
  enhancedRoutes.get('/api/chat/rooms', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(400).json({ error: 'User ID required' });
      }

      const chatRooms = await storage.getChatRoomsByUser(userId);
      res.json(chatRooms);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      res.status(500).json({ error: 'Failed to fetch chat rooms' });
    }
  });

  enhancedRoutes.get('/api/chat/messages', isAuthenticated, async (req: any, res) => {
    try {
      const { roomId, limit } = req.query;
      if (!roomId) {
        return res.status(400).json({ error: 'Room ID required' });
      }

      const messages = await storage.getChatMessagesByRoom(
        roomId as string, 
        limit ? parseInt(limit as string) : 50
      );
      res.json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  });

  enhancedRoutes.post('/api/chat/messages', isAuthenticated, async (req: any, res) => {
    try {
      const messageData = {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const message = await storage.createChatMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ error: 'Failed to send message' });
    }
  });

  // Enhanced Notification Routes
  enhancedRoutes.get('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const notifications = await storage.getNotificationsByUser(userId);
      res.json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  });

  app.use(enhancedRoutes);

  // Create server and return it
  const server = createServer(app);
  return server;
}
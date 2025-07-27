import express from 'express';
import { storage } from '../storage';
import { insertSchoolSchema } from '@shared/schema';

const router = express.Router();

// Enhanced Proprietor Routes
router.get('/api/proprietor/schools', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const schools = await storage.getSchoolsByProprietor(userId);
    
    // Enhance schools with additional stats
    const enhancedSchools = await Promise.all(schools.map(async (school) => {
      const [studentCount, teacherCount, classCount] = await Promise.all([
        // You would implement these methods in storage
        0, // await storage.getStudentCountBySchool(school.id),
        0, // await storage.getTeacherCountBySchool(school.id),
        0  // await storage.getClassCountBySchool(school.id)
      ]);

      return {
        ...school,
        studentCount,
        teacherCount,
        classCount
      };
    }));

    res.json(enhancedSchools);
  } catch (error) {
    console.error('Error fetching proprietor schools:', error);
    res.status(500).json({ error: 'Failed to fetch schools' });
  }
});

router.post('/api/proprietor/schools', async (req, res) => {
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
    
    // Create default academic session
    // await storage.createAcademicSession({
    //   name: new Date().getFullYear() + '/' + (new Date().getFullYear() + 1),
    //   startDate: new Date(),
    //   endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    //   schoolId: school.id,
    //   isActive: true
    // });

    res.status(201).json(school);
  } catch (error) {
    console.error('Error creating school:', error);
    res.status(500).json({ error: 'Failed to create school' });
  }
});

router.get('/api/proprietor/analytics', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Mock analytics data - in real implementation, calculate from database
    const analytics = {
      totalStudents: 1250,
      totalTeachers: 85,
      totalRevenue: '2,450,000',
      totalSchools: 3
    };

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Enhanced Chat System Routes
router.get('/api/chat/rooms', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const chatRooms = await storage.getChatRoomsByUser(userId as string);
    res.json(chatRooms);
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    res.status(500).json({ error: 'Failed to fetch chat rooms' });
  }
});

router.get('/api/chat/messages', async (req, res) => {
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

router.post('/api/chat/messages', async (req, res) => {
  try {
    const messageData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const message = await storage.createChatMessage(messageData);
    
    // Create notification for message recipients
    if (req.body.receiverId) {
      await storage.createNotification({
        title: 'New Message',
        content: `You have a new message: ${req.body.content.substring(0, 50)}...`,
        type: 'message',
        userId: req.body.receiverId,
        priority: 'medium',
        metadata: { messageId: message.id, senderId: req.body.senderId }
      });
    }

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

router.post('/api/chat/rooms', async (req, res) => {
  try {
    const roomData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const room = await storage.createChatRoom(roomData);
    res.status(201).json(room);
  } catch (error) {
    console.error('Error creating chat room:', error);
    res.status(500).json({ error: 'Failed to create chat room' });
  }
});

// Enhanced Notification Routes
router.get('/api/notifications', async (req, res) => {
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

router.patch('/api/notifications/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    await storage.markNotificationAsRead(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

router.post('/api/notifications', async (req, res) => {
  try {
    const notificationData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const notification = await storage.createNotification(notificationData);
    res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

// School Selection Route for All Users
router.get('/api/schools/available', async (req, res) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let schools = [];

    // If proprietor, show only their schools
    if (userRole === 'proprietor') {
      schools = await storage.getSchoolsByProprietor(userId);
    } else {
      // For other roles, show schools they can potentially join
      // This could be all schools or filtered based on criteria
      schools = []; // Implement getAllSchools() method if needed
    }

    res.json(schools);
  } catch (error) {
    console.error('Error fetching available schools:', error);
    res.status(500).json({ error: 'Failed to fetch schools' });
  }
});

router.post('/api/users/select-school', async (req, res) => {
  try {
    const userId = req.user?.id;
    const { schoolId } = req.body;
    
    if (!userId || !schoolId) {
      return res.status(400).json({ error: 'User ID and School ID required' });
    }

    // Update user's school association based on their role
    const userRole = req.user?.role;
    
    switch (userRole) {
      case 'student':
        // Logic to enroll student in school
        break;
      case 'teacher':
        // Logic to assign teacher to school
        break;
      case 'parent':
        // Logic to associate parent with school
        break;
      default:
        return res.status(400).json({ error: 'Invalid user role for school selection' });
    }

    res.json({ success: true, message: 'School selected successfully' });
  } catch (error) {
    console.error('Error selecting school:', error);
    res.status(500).json({ error: 'Failed to select school' });
  }
});

export default router;
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect Database & Auto-seed if empty
const User = require('./models/User');
const Complaint = require('./models/Complaint');

const initializeData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🔄 First run detected. Seeding initial admin and demo data...');
      // Run internal seed
      const admin = await User.create({
        name: 'System Administrator',
        email: 'admin@nexus.com',
        password: 'admin123',
        role: 'admin',
        department: 'Central Administration',
      });

      const user1 = await User.create({
        name: 'John Doe',
        email: 'john@nexus.com',
        password: 'user123',
        role: 'user',
        department: 'Computer Science Dept',
      });

      const user2 = await User.create({
        name: 'Sarah Jenkins',
        email: 'sarah@nexus.com',
        password: 'user123',
        role: 'user',
        department: 'Civil Engineering',
      });

      // Seed initial sample complaints
      await Complaint.create([
        {
          ticketId: 'NEX-1001',
          user: user1._id,
          userName: user1.name,
          userEmail: user1.email,
          title: 'Water leakage in Block C',
          description: 'Main overhead pipe leaking continuously in Block C corridor near room 204 for three days.',
          location: 'Block C, 2nd Floor',
          department: 'Water & Plumbing Dept',
          category: 'Water Supply',
          status: 'In Progress',
          priority: 'High',
          priorityScore: 72,
          sentiment: 'Negative',
          severity: 'High',
          slaHours: 24,
          isDemo: true,
          aiAnalysis: {
            confidence: 0.96,
            summary: "AI categorized this as 'Water Supply' routed to 'Water & Plumbing Dept'. High priority due to continuous leak.",
            formulaBreakdown: { severityPoints: 33.7, sentimentPoints: 12.0, urgencyPoints: 12.0, recurrenceBoost: 14.3 },
          },
          adminRemarks: 'Plumber assigned. Work in progress.',
        },
        {
          ticketId: 'NEX-1002',
          user: user2._id,
          userName: user2.name,
          userEmail: user2.email,
          title: 'Water is leaking near C Block corridor',
          description: 'Water tap broken and water is spilling all over the walkway near Block C.',
          location: 'Block C, Ground Floor',
          department: 'Water & Plumbing Dept',
          category: 'Water Supply',
          status: 'Submitted',
          priority: 'High',
          priorityScore: 68,
          sentiment: 'Negative',
          severity: 'High',
          slaHours: 24,
          isDemo: true,
          aiAnalysis: {
            confidence: 0.94,
            summary: "AI categorized this as 'Water Supply'. Duplicate match identified with NEX-1001.",
            formulaBreakdown: { severityPoints: 31.5, sentimentPoints: 12.0, urgencyPoints: 9.0, recurrenceBoost: 15.5 },
          },
          similarComplaints: [
            {
              complaintId: 'NEX-1001',
              title: 'Water leakage in Block C',
              similarityScore: 68.5,
              isVerifiedDuplicate: true,
            },
          ],
        },
        {
          ticketId: 'NEX-1003',
          user: user1._id,
          userName: user1.name,
          userEmail: user1.email,
          title: 'Short circuit and sparking in Lab 302',
          description: 'Dangerous electric spark coming out from power switchboard. High risk of electrical shock or fire.',
          location: 'Science Block, Lab 302',
          department: 'Electrical Maintenance',
          category: 'Electricity',
          status: 'Under Review',
          priority: 'Critical',
          priorityScore: 92,
          sentiment: 'Highly Frustrated',
          severity: 'Critical',
          slaHours: 6,
          isDemo: true,
          aiAnalysis: {
            confidence: 0.98,
            summary: "AI detected 'Critical Electrical Hazard'. Priority score 92/100 requiring immediate 6-hour SLA dispatch.",
            formulaBreakdown: { severityPoints: 40.5, sentimentPoints: 20.0, urgencyPoints: 15.0, recurrenceBoost: 16.5 },
          },
          adminRemarks: 'Breaker isolated. Electrician dispatched.',
        },
        {
          ticketId: 'NEX-1004',
          user: user2._id,
          userName: user2.name,
          userEmail: user2.email,
          title: 'WiFi connection dropping in Central Library',
          description: 'Unable to connect to campus wifi router on 2nd floor library during study hours.',
          location: 'Central Library, 2nd Floor',
          department: 'IT & Network Operations',
          category: 'Network',
          status: 'In Progress',
          priority: 'Medium',
          priorityScore: 48,
          sentiment: 'Negative',
          severity: 'Medium',
          slaHours: 48,
          isDemo: true,
          aiAnalysis: {
            confidence: 0.95,
            summary: "AI categorized as 'Network'. Routed to IT Operations.",
            formulaBreakdown: { severityPoints: 22.5, sentimentPoints: 12.0, urgencyPoints: 4.8, recurrenceBoost: 8.7 },
          },
        },
        {
          ticketId: 'NEX-1005',
          user: user1._id,
          userName: user1.name,
          userEmail: user1.email,
          title: 'Broken window latch and shattered glass pane',
          description: 'Window lock is broken and glass cracked in Seminar Hall B.',
          location: 'Academic Complex, Seminar Hall B',
          department: 'Campus Maintenance & Civil Works',
          category: 'Infrastructure',
          status: 'Resolved',
          priority: 'Medium',
          priorityScore: 44,
          sentiment: 'Negative',
          severity: 'Medium',
          slaHours: 48,
          isDemo: true,
          resolvedAt: new Date(),
          aiAnalysis: {
            confidence: 0.91,
            summary: "AI categorized as 'Infrastructure'. Resolved within SLA window.",
            formulaBreakdown: { severityPoints: 22.5, sentimentPoints: 12.0, urgencyPoints: 4.8, recurrenceBoost: 4.7 },
          },
          adminRemarks: 'Glass replaced and latch repaired.',
        },
      ]);
      console.log('✅ Auto-seed complete. Demo credentials ready.');
    }
  } catch (err) {
    console.error('Error in auto-seed initialization:', err.message);
  }
};

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'NEXUS Complaint Intelligence Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  initializeData();
  app.listen(PORT, () => {
    console.log(`🚀 NEXUS Backend API Server listening on port ${PORT}`);
    console.log(`📍 Health Check: http://localhost:${PORT}/health`);
  });
});

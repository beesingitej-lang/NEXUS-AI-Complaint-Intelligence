const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Complaint = require('./models/Complaint');
const Notification = require('./models/Notification');
const connectDB = require('./config/db');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    console.log('🌱 Seeding demo database for NEXUS project...');

    // Clear existing data
    await User.deleteMany();
    await Complaint.deleteMany();
    await Notification.deleteMany();

    // 1. Create Admin
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@nexus.com',
      password: 'admin123',
      role: 'admin',
      department: 'Central Administration',
      phone: '+1 555-0199',
    });

    // 2. Create Demo Users
    const user1 = await User.create({
      name: 'John Doe',
      email: 'john@nexus.com',
      password: 'user123',
      role: 'user',
      department: 'Computer Science Dept',
      phone: '+1 555-0142',
    });

    const user2 = await User.create({
      name: 'Sarah Jenkins',
      email: 'sarah@nexus.com',
      password: 'user123',
      role: 'user',
      department: 'Civil Engineering',
      phone: '+1 555-0177',
    });

    console.log('👤 Users created successfully.');

    // 3. Create Sample Complaints
    const sampleComplaints = [
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
          summary: "AI categorized this as 'Water Supply' routed to 'Water & Plumbing Dept'. High priority due to 3-day continuous leak.",
          formulaBreakdown: { severityPoints: 33.7, sentimentPoints: 12.0, urgencyPoints: 12.0, recurrenceBoost: 14.3 },
        },
        adminRemarks: 'Plumber assigned. Valve replacement in progress.',
        statusHistory: [
          { status: 'Submitted', timestamp: new Date(Date.now() - 36 * 3600 * 1000), updatedBy: user1.name, remarks: 'Complaint submitted.' },
          { status: 'Under Review', timestamp: new Date(Date.now() - 24 * 3600 * 1000), updatedBy: admin.name, remarks: 'Verified by central facility.' },
          { status: 'In Progress', timestamp: new Date(Date.now() - 6 * 3600 * 1000), updatedBy: admin.name, remarks: 'Work order #W-44 issued.' },
        ],
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
        adminRemarks: 'Identified as related issue in Block C plumbing sector.',
        statusHistory: [
          { status: 'Submitted', timestamp: new Date(Date.now() - 12 * 3600 * 1000), updatedBy: user2.name, remarks: 'Complaint submitted.' },
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
        adminRemarks: 'Emergency electrician dispatched. Lab power turned off at main breaker.',
        statusHistory: [
          { status: 'Submitted', timestamp: new Date(Date.now() - 4 * 3600 * 1000), updatedBy: user1.name, remarks: 'Urgent complaint submitted.' },
          { status: 'Under Review', timestamp: new Date(Date.now() - 2 * 3600 * 1000), updatedBy: admin.name, remarks: 'Emergency breaker isolated.' },
        ],
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
          summary: "AI categorized as 'Network'. Routed to IT Operations with standard 48-hour resolution.",
          formulaBreakdown: { severityPoints: 22.5, sentimentPoints: 12.0, urgencyPoints: 4.8, recurrenceBoost: 8.7 },
        },
        adminRemarks: 'Access point reboot scheduled.',
        statusHistory: [
          { status: 'Submitted', timestamp: new Date(Date.now() - 18 * 3600 * 1000), updatedBy: user2.name, remarks: 'Submitted.' },
          { status: 'In Progress', timestamp: new Date(Date.now() - 5 * 3600 * 1000), updatedBy: admin.name, remarks: 'Network engineer investigating AP.' },
        ],
      },
      {
        ticketId: 'NEX-1005',
        user: user1._id,
        userName: user1.name,
        userEmail: user1.email,
        title: 'Broken window latch and shattered glass pane',
        description: 'Window lock is broken and glass cracked in Seminar Hall B. Rainwater enters during storms.',
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
        resolvedAt: new Date(Date.now() - 2 * 3600 * 1000),
        aiAnalysis: {
          confidence: 0.91,
          summary: "AI categorized as 'Infrastructure'. Resolved within SLA window.",
          formulaBreakdown: { severityPoints: 22.5, sentimentPoints: 12.0, urgencyPoints: 4.8, recurrenceBoost: 4.7 },
        },
        adminRemarks: 'Glass replaced and heavy duty latch installed by carpentry team.',
        statusHistory: [
          { status: 'Submitted', timestamp: new Date(Date.now() - 48 * 3600 * 1000), updatedBy: user1.name, remarks: 'Submitted.' },
          { status: 'In Progress', timestamp: new Date(Date.now() - 24 * 3600 * 1000), updatedBy: admin.name, remarks: 'Maintenance assigned.' },
          { status: 'Resolved', timestamp: new Date(Date.now() - 2 * 3600 * 1000), updatedBy: admin.name, remarks: 'Completed.' },
        ],
      },
      {
        ticketId: 'NEX-1006',
        user: user2._id,
        userName: user2.name,
        userEmail: user2.email,
        title: 'Garbage bins overflowing near cafeteria',
        description: 'Trash has not been cleared for 2 days. Bad odor and pest accumulation near dining tables.',
        location: 'Student Center, Cafeteria Courtyard',
        department: 'Sanitation & Housekeeping',
        category: 'Cleanliness',
        status: 'Submitted',
        priority: 'High',
        priorityScore: 62,
        sentiment: 'Negative',
        severity: 'High',
        slaHours: 24,
        isDemo: true,
        aiAnalysis: {
          confidence: 0.97,
          summary: "AI categorized as 'Cleanliness'. Priority boosted due to hygiene and odor escalation.",
          formulaBreakdown: { severityPoints: 31.5, sentimentPoints: 12.0, urgencyPoints: 9.0, recurrenceBoost: 9.5 },
        },
        adminRemarks: '',
        statusHistory: [
          { status: 'Submitted', timestamp: new Date(Date.now() - 2 * 3600 * 1000), updatedBy: user2.name, remarks: 'Submitted.' },
        ],
      },
    ];

    const createdComplaints = await Complaint.insertMany(sampleComplaints);
    console.log(`📋 Created ${createdComplaints.length} demo complaints.`);

    // 4. Create sample notifications
    await Notification.create([
      {
        recipient: user1._id,
        complaint: createdComplaints[0]._id,
        ticketId: 'NEX-1001',
        title: 'Status Updated: In Progress',
        message: 'Your complaint "Water leakage in Block C" (NEX-1001) status was changed to In Progress.',
        type: 'status_change',
        read: false,
      },
      {
        recipient: user1._id,
        complaint: createdComplaints[2]._id,
        ticketId: 'NEX-1003',
        title: 'Emergency Priority Assigned',
        message: 'NEXUS AI classified "Short circuit and sparking in Lab 302" as CRITICAL (Score 92/100). SLA: 6 Hours.',
        type: 'ai_insight',
        read: true,
      },
      {
        recipient: user2._id,
        complaint: createdComplaints[1]._id,
        ticketId: 'NEX-1002',
        title: 'Similar Complaint Detected',
        message: 'NEXUS AI detected similar issue NEX-1001 in Block C. Linked to plumbing repair queue.',
        type: 'ai_insight',
        read: false,
      },
    ]);

    console.log('🔔 Notifications seeded successfully.');
    console.log('✅ Demo seeding complete!\n');
    console.log('Demo Credentials for College Presentation:');
    console.log('  Admin Account:  admin@nexus.com / admin123');
    console.log('  Demo User:      john@nexus.com  / user123');
    console.log('  Demo User 2:    sarah@nexus.com / user123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();

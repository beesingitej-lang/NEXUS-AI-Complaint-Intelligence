const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');
const { analyzeComplaintWithAI } = require('../services/aiService');

// @desc    Pre-submission AI analysis for real-time preview card
// @route   POST /api/complaints/pre-analyze
// @access  Private
exports.preAnalyzeComplaint = async (req, res) => {
  try {
    const { title, description, location, department } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required for AI analysis.',
      });
    }

    // Retrieve active complaints to check for duplicates
    const existingComplaints = await Complaint.find(
      { status: { $ne: 'Resolved' } },
      '_id title description location status'
    ).limit(50);

    const aiResult = await analyzeComplaintWithAI(
      title,
      description,
      location || '',
      department || '',
      existingComplaints
    );

    res.json({
      success: true,
      analysis: aiResult,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'AI analysis failed.',
    });
  }
};

// @desc    Submit and save a new complaint
// @route   POST /api/complaints
// @access  Private
exports.createComplaint = async (req, res) => {
  try {
    const { title, description, location, department, confirmedAnalysis } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and location.',
      });
    }

    // Retrieve existing active complaints for duplicate detection
    const existingComplaints = await Complaint.find(
      { status: { $ne: 'Resolved' } },
      '_id title description location status'
    ).limit(50);

    // If analysis was already confirmed from frontend preview, reuse it or recompute
    let aiData = confirmedAnalysis;
    if (!aiData || !aiData.category) {
      aiData = await analyzeComplaintWithAI(
        title,
        description,
        location,
        department,
        existingComplaints
      );
    }

    const complaint = new Complaint({
      user: req.user.id,
      userName: req.user.name,
      userEmail: req.user.email,
      title,
      description,
      location,
      department: aiData.department || department || 'General Administration',
      category: aiData.category || 'Other',
      status: 'Submitted',
      priority: aiData.priority || 'Medium',
      priorityScore: aiData.priority_score || 50,
      sentiment: aiData.sentiment || 'Negative',
      severity: aiData.severity || 'Medium',
      slaHours: aiData.sla_resolution_hours || 48,
      aiAnalysis: {
        confidence: aiData.category_confidence || 0.85,
        summary: aiData.ai_summary || '',
        formulaBreakdown: aiData.formula_breakdown || {},
        analyzedAt: new Date(),
      },
      similarComplaints: (aiData.similar_complaints || []).map(sc => ({
        complaintId: sc.complaint_id,
        title: sc.title,
        similarityScore: sc.similarity_score,
        isVerifiedDuplicate: false,
      })),
      statusHistory: [
        {
          status: 'Submitted',
          timestamp: new Date(),
          updatedBy: req.user.name,
          remarks: 'Complaint submitted by user and verified by NEXUS AI.',
        },
      ],
    });

    await complaint.save();

    // Create user notification
    await Notification.create({
      recipient: req.user.id,
      complaint: complaint._id,
      ticketId: complaint.ticketId,
      title: 'Complaint Registered',
      message: `Your complaint "${complaint.title}" has been successfully logged with ticket ID ${complaint.ticketId}. Priority: ${complaint.priority}.`,
      type: 'status_change',
    });

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully.',
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit complaint.',
    });
  }
};

// @desc    Get all complaints submitted by the logged in user
// @route   GET /api/complaints/my
// @access  Private
exports.getMyComplaints = async (req, res) => {
  try {
    const { status, category, search } = req.query;
    const query = { user: req.user.id };

    if (status && status !== 'All') {
      query.status = status;
    }
    if (category && category !== 'All') {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { ticketId: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const complaints = await Complaint.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single complaint details by ID (user restricted to own complaint)
// @route   GET /api/complaints/:id
// @access  Private
exports.getMyComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.',
      });
    }

    // Only allow owner or admin
    if (complaint.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this complaint.',
      });
    }

    res.json({
      success: true,
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user dashboard stats
// @route   GET /api/complaints/stats/user
// @access  Private
exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const total = await Complaint.countDocuments({ user: userId });
    const pending = await Complaint.countDocuments({
      user: userId,
      status: { $in: ['Submitted', 'Under Review'] },
    });
    const inProgress = await Complaint.countDocuments({
      user: userId,
      status: 'In Progress',
    });
    const resolved = await Complaint.countDocuments({
      user: userId,
      status: 'Resolved',
    });

    const recent = await Complaint.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        total,
        pending,
        inProgress,
        resolved,
      },
      recentComplaints: recent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

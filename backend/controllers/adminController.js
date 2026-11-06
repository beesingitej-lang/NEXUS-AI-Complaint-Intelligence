const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Get Admin Dashboard Stats & Chart Data
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
exports.getAdminDashboard = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({
      status: { $in: ['Submitted', 'Under Review'] },
    });
    const inProgress = await Complaint.countDocuments({ status: 'In Progress' });
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });
    const critical = await Complaint.countDocuments({ priority: 'Critical' });

    // Chart 1: Complaints by Category
    const categoryAgg = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const byCategory = categoryAgg.map(item => ({
      name: item._id || 'Other',
      value: item.count,
    }));

    // Chart 2: Complaints by Status
    const statusAgg = await Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const byStatus = statusAgg.map(item => ({
      name: item._id,
      value: item.count,
    }));

    // Chart 3: Department-wise Complaints
    const deptAgg = await Complaint.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 }, pending: { $sum: { $cond: [{ $ne: ['$status', 'Resolved'] }, 1, 0] } } } },
      { $sort: { count: -1 } },
    ]);
    const byDepartment = deptAgg.map(item => ({
      name: item._id || 'General Administration',
      total: item.count,
      pending: item.pending,
    }));

    // Recent 5 complaints
    const recentComplaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      stats: {
        total,
        pending,
        inProgress,
        resolved,
        critical,
      },
      charts: {
        byCategory,
        byStatus,
        byDepartment,
      },
      recentComplaints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all complaints with pagination, search, and filtering
// @route   GET /api/admin/complaints
// @access  Private (Admin)
exports.getAllComplaints = async (req, res) => {
  try {
    const { status, priority, category, department, search, page = 1, limit = 50 } = req.query;
    const query = {};

    if (status && status !== 'All') query.status = status;
    if (priority && priority !== 'All') query.priority = priority;
    if (category && category !== 'All') query.category = category;
    if (department && department !== 'All') query.department = department;

    if (search) {
      query.$or = [
        { ticketId: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { userName: { $regex: search, $options: 'i' } },
        { userEmail: { $regex: search, $options: 'i' } },
      ];
    }

    const totalCount = await Complaint.countDocuments(query);
    const complaints = await Complaint.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      totalCount,
      page: Number(page),
      complaints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update complaint status, department assignment, and admin remarks
// @route   PUT /api/admin/complaints/:id
// @access  Private (Admin)
exports.updateComplaint = async (req, res) => {
  try {
    const { status, department, adminRemarks, priority } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.',
      });
    }

    const previousStatus = complaint.status;

    if (status && status !== complaint.status) {
      complaint.status = status;
      complaint.statusHistory.push({
        status,
        timestamp: new Date(),
        updatedBy: req.user.name,
        remarks: adminRemarks || `Status updated to ${status} by admin.`,
      });

      if (status === 'Resolved') {
        complaint.resolvedAt = new Date();
      }

      // Notify the complaint owner
      await Notification.create({
        recipient: complaint.user,
        complaint: complaint._id,
        ticketId: complaint.ticketId,
        title: `Status Changed: ${status}`,
        message: `Your complaint "${complaint.title}" (${complaint.ticketId}) status has been updated to "${status}". Remarks: ${adminRemarks || 'No extra remarks.'}`,
        type: 'status_change',
      });
    }

    if (department) complaint.department = department;
    if (priority) complaint.priority = priority;
    if (adminRemarks !== undefined) complaint.adminRemarks = adminRemarks;

    await complaint.save();

    res.json({
      success: true,
      message: 'Complaint updated successfully.',
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Verify or link duplicate complaints
// @route   POST /api/admin/complaints/:id/verify-duplicate
// @access  Private (Admin)
exports.verifyDuplicate = async (req, res) => {
  try {
    const { targetComplaintId, isDuplicate } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    // Mark similar entry as verified
    const match = complaint.similarComplaints.find(
      sc => sc.complaintId === targetComplaintId
    );

    if (match) {
      match.isVerifiedDuplicate = isDuplicate !== undefined ? isDuplicate : true;
    } else {
      complaint.similarComplaints.push({
        complaintId: targetComplaintId,
        title: 'Linked Duplicate',
        similarityScore: 90,
        isVerifiedDuplicate: true,
      });
    }

    // Add note to admin remarks
    complaint.adminRemarks = `${complaint.adminRemarks || ''} [Verified duplicate linked to ${targetComplaintId}]`.trim();
    await complaint.save();

    res.json({
      success: true,
      message: 'Duplicate status verified and saved.',
      complaint,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get AI Intelligence and real data insights
// @route   GET /api/admin/ai-insights
// @access  Private (Admin)
exports.getAIInsights = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();

    if (totalComplaints === 0) {
      return res.json({
        success: true,
        insights: {
          mostReportedCategory: { name: 'None yet', count: 0 },
          highestComplaintLocation: { name: 'None yet', count: 0 },
          mostPendingDepartment: { name: 'None yet', count: 0 },
          criticalIssuesCount: 0,
          averageResolutionHours: 24,
          recurringIssues: [],
        },
      });
    }

    // 1. Most reported category
    const catGroup = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);
    const topCategory = catGroup[0] || { _id: 'Infrastructure', count: 0 };

    // 2. Location with highest complaints
    const locGroup = await Complaint.aggregate([
      { $group: { _id: '$location', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);
    const topLocation = locGroup[0] || { _id: 'Main Block', count: 0 };

    // 3. Department with most pending complaints
    const deptGroup = await Complaint.aggregate([
      { $match: { status: { $ne: 'Resolved' } } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);
    const topPendingDept = deptGroup[0] || { _id: 'Campus Maintenance', count: 0 };

    // 4. Critical complaints count
    const criticalCount = await Complaint.countDocuments({ priority: 'Critical', status: { $ne: 'Resolved' } });

    // 5. Duplicate / recurring clusters
    const recurringClusters = await Complaint.find({
      'similarComplaints.0': { $exists: true },
    })
      .select('ticketId title location category similarComplaints priority')
      .limit(6);

    // 6. Category breakdown percentage
    const allCategories = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      insights: {
        totalComplaints,
        mostReportedCategory: {
          name: topCategory._id,
          count: topCategory.count,
          percentage: Math.round((topCategory.count / totalComplaints) * 100),
        },
        highestComplaintLocation: {
          name: topLocation._id,
          count: topLocation.count,
          percentage: Math.round((topLocation.count / totalComplaints) * 100),
        },
        mostPendingDepartment: {
          name: topPendingDept._id,
          count: topPendingDept.count,
        },
        criticalIssuesCount: criticalCount,
        recurringClusters: recurringClusters.map(rc => ({
          ticketId: rc.ticketId,
          title: rc.title,
          location: rc.location,
          category: rc.category,
          priority: rc.priority,
          duplicatesCount: rc.similarComplaints.length,
          similarComplaints: rc.similarComplaints,
        })),
        categoryDistribution: allCategories.map(c => ({
          category: c._id,
          count: c.count,
          percentage: Math.round((c.count / totalComplaints) * 100),
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

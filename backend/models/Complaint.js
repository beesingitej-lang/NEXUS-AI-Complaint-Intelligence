const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['Submitted', 'Under Review', 'In Progress', 'Resolved'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: String,
    default: 'System',
  },
  remarks: {
    type: String,
    default: '',
  },
});

const similarComplaintSchema = new mongoose.Schema({
  complaintId: {
    type: String,
  },
  title: {
    type: String,
  },
  similarityScore: {
    type: Number,
  },
  isVerifiedDuplicate: {
    type: Boolean,
    default: false,
  },
});

const complaintSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a complaint title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please describe your problem'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please provide a location or block'],
      trim: true,
    },
    department: {
      type: String,
      default: 'General Administration',
    },
    category: {
      type: String,
      enum: ['Infrastructure', 'Water Supply', 'Electricity', 'Network', 'Cleanliness', 'Other'],
      default: 'Other',
    },
    status: {
      type: String,
      enum: ['Submitted', 'Under Review', 'In Progress', 'Resolved'],
      default: 'Submitted',
      index: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
      index: true,
    },
    priorityScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
    },
    sentiment: {
      type: String,
      default: 'Negative',
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    slaHours: {
      type: Number,
      default: 48,
    },
    aiAnalysis: {
      confidence: { type: Number, default: 0.8 },
      summary: { type: String, default: '' },
      formulaBreakdown: {
        severityPoints: Number,
        sentimentPoints: Number,
        urgencyPoints: Number,
        recurrenceBoost: Number,
      },
      analyzedAt: { type: Date, default: Date.now },
    },
    similarComplaints: [similarComplaintSchema],
    adminRemarks: {
      type: String,
      default: '',
    },
    statusHistory: [statusHistorySchema],
    isDemo: {
      type: Boolean,
      default: false,
    },
    resolvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Auto-generate Ticket ID before saving if not present
complaintSchema.pre('save', async function (next) {
  if (!this.ticketId) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    this.ticketId = `NEX-${randomSuffix}`;
  }
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);

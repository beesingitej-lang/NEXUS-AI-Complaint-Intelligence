const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getAllComplaints,
  updateComplaint,
  verifyDuplicate,
  getAIInsights,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);
router.use(adminOnly);

router.get('/dashboard', getAdminDashboard);
router.get('/complaints', getAllComplaints);
router.put('/complaints/:id', updateComplaint);
router.post('/complaints/:id/verify-duplicate', verifyDuplicate);
router.get('/ai-insights', getAIInsights);

module.exports = router;

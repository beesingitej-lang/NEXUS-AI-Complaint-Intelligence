const express = require('express');
const router = express.Router();
const {
  preAnalyzeComplaint,
  createComplaint,
  getMyComplaints,
  getMyComplaintById,
  getUserStats,
} = require('../controllers/complaintController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/pre-analyze', preAnalyzeComplaint);
router.post('/', createComplaint);
router.get('/my', getMyComplaints);
router.get('/stats/user', getUserStats);
router.get('/:id', getMyComplaintById);

module.exports = router;

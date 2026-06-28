const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getLeads,
  getLeadById,
  createLead,
  updateLeadStatus,
  addNote,
  deleteLead,
} = require('../controllers/leadController');

// Public route — no auth (website contact form)
router.post('/', createLead);

// Protected routes
router.get('/', protect, getLeads);
router.get('/:id', protect, getLeadById);
router.patch('/:id/status', protect, updateLeadStatus);
router.post('/:id/notes', protect, addNote);
router.delete('/:id', protect, deleteLead);

module.exports = router;

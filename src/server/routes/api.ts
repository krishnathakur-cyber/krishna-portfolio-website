import { Router } from 'express';
import { trackVisit, updateSession, getAnalyticsDashboard } from '../controllers/analyticsController';
import { submitContactForm, getContactMessages } from '../controllers/contactController';
import { submitFeedback, getFeedbackStatistics } from '../controllers/feedbackController';
import { loginAdmin, registerAdmin } from '../controllers/authController';
import { authAdmin } from '../middleware/auth';
import { createRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public Rate Limiters (15 Minute sliding windows)
const contactLimiter = createRateLimiter(15 * 60 * 1000, 5); // Max 5 letters
const feedbackLimiter = createRateLimiter(15 * 60 * 1000, 5); // Max 5 logs
const trackerLimiter = createRateLimiter(1 * 60 * 1000, 60); // Max 60 tracks a minute

// --- PUBLIC TRACKING ROUTING CHANNELS ---
router.post('/track-visit', trackerLimiter, trackVisit);
router.post('/update-session', trackerLimiter, updateSession);

// --- PUBLIC FORM TRANSACTIONS ---
router.post('/contact', contactLimiter, submitContactForm);
router.post('/feedback', feedbackLimiter, submitFeedback);

// --- SECURED ADMIN ENTRANCES AND QUERY METADATA ---
router.post('/admin/login', loginAdmin);
router.post('/admin/register', registerAdmin);

// Protected Analytics Boards
router.get('/admin/analytics', authAdmin, getAnalyticsDashboard);
router.get('/admin/messages', authAdmin, getContactMessages);
router.get('/admin/feedback', authAdmin, getFeedbackStatistics);

export default router;

import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import authController from '../controllers/authController';
import { authenticateToken, adminOnly } from '../middleware/auth';
import { validate, userSchemas } from '../middleware/validation';

const router = Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 registration attempts per hour
  message: {
    success: false,
    message: 'Too many registration attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public routes
router.post('/register', 
  registerLimiter,
  validate(userSchemas.register),
  authController.register
);

router.post('/login',
  authLimiter,
  validate(userSchemas.login),
  authController.login
);

// Protected routes (require authentication)
router.get('/profile',
  authenticateToken,
  authController.getProfile
);

router.put('/profile',
  authenticateToken,
  validate(userSchemas.updateProfile),
  authController.updateProfile
);

router.put('/change-password',
  authenticateToken,
  authController.changePassword
);

// Admin only routes
router.get('/users',
  authenticateToken,
  adminOnly,
  authController.getAllUsers
);

router.put('/users/:id/status',
  authenticateToken,
  adminOnly,
  authController.updateUserStatus
);

export default router;
import { Router } from 'express';
import newsController from '../controllers/newsController';
import { authenticateToken, adminOrEditor, optionalAuth, checkOwnership } from '../middleware/auth';
import { validate, newsSchemas, idParamSchema, querySchema } from '../middleware/validation';

const router = Router();

// Public routes
router.get('/',
  optionalAuth,
  validate(querySchema),
  newsController.getNews
);

router.get('/search',
  optionalAuth,
  validate(querySchema),
  newsController.searchNews
);

router.get('/featured',
  optionalAuth,
  validate(querySchema),
  newsController.getFeaturedNews
);

router.get('/slug/:slug',
  optionalAuth,
  newsController.getNewsBySlug
);

router.get('/:id',
  optionalAuth,
  validate(idParamSchema),
  newsController.getNewsById
);

router.get('/:id/related',
  optionalAuth,
  validate(idParamSchema),
  newsController.getRelatedNews
);

// Public interaction routes
router.post('/:id/interact',
  validate(idParamSchema),
  newsController.updateNewsInteraction
);

// Protected routes (require authentication)
router.post('/',
  authenticateToken,
  adminOrEditor,
  validate(newsSchemas.create),
  newsController.createNews
);

router.put('/:id',
  authenticateToken,
  checkOwnership(),
  validate(newsSchemas.update),
  newsController.updateNews
);

router.delete('/:id',
  authenticateToken,
  checkOwnership(),
  validate(idParamSchema),
  newsController.deleteNews
);

router.patch('/:id/publish',
  authenticateToken,
  adminOrEditor,
  validate(idParamSchema),
  newsController.publishNews
);

export default router;
import { Router } from 'express';
import categoryController from '../controllers/categoryController';
import { authenticateToken, adminOrEditor, optionalAuth } from '../middleware/auth';
import { validate, categorySchemas, idParamSchema, querySchema } from '../middleware/validation';

const router = Router();

// Public routes
router.get('/',
  optionalAuth,
  validate(querySchema),
  categoryController.getCategories
);

router.get('/tree',
  optionalAuth,
  categoryController.getCategoryTree
);

router.get('/slug/:slug',
  optionalAuth,
  categoryController.getCategoryBySlug
);

router.get('/:id',
  optionalAuth,
  validate(idParamSchema),
  categoryController.getCategoryById
);

// Protected routes (require authentication and admin/editor role)
router.post('/',
  authenticateToken,
  adminOrEditor,
  validate(categorySchemas.create),
  categoryController.createCategory
);

router.put('/:id',
  authenticateToken,
  adminOrEditor,
  validate(categorySchemas.update),
  categoryController.updateCategory
);

router.delete('/:id',
  authenticateToken,
  adminOrEditor,
  validate(idParamSchema),
  categoryController.deleteCategory
);

router.put('/reorder',
  authenticateToken,
  adminOrEditor,
  categoryController.reorderCategories
);

export default router;
import { Router } from 'express';
import productController from '../controllers/productController';
import { authenticateToken, adminOrEditor, optionalAuth, checkOwnership } from '../middleware/auth';
import { validate, productSchemas, idParamSchema, querySchema } from '../middleware/validation';

const router = Router();

// Public routes
router.get('/',
  optionalAuth,
  validate(querySchema),
  productController.getProducts
);

router.get('/search',
  optionalAuth,
  validate(querySchema),
  productController.searchProducts
);

router.get('/featured',
  optionalAuth,
  validate(querySchema),
  productController.getFeaturedProducts
);

router.get('/low-stock',
  authenticateToken,
  adminOrEditor,
  productController.getLowStockProducts
);

router.get('/slug/:slug',
  optionalAuth,
  productController.getProductBySlug
);

router.get('/:id',
  optionalAuth,
  validate(idParamSchema),
  productController.getProductById
);

router.get('/:id/related',
  optionalAuth,
  validate(idParamSchema),
  productController.getRelatedProducts
);

// Protected routes (require authentication)
router.post('/',
  authenticateToken,
  adminOrEditor,
  validate(productSchemas.create),
  productController.createProduct
);

router.put('/:id',
  authenticateToken,
  checkOwnership(),
  validate(productSchemas.update),
  productController.updateProduct
);

router.delete('/:id',
  authenticateToken,
  checkOwnership(),
  validate(idParamSchema),
  productController.deleteProduct
);

router.patch('/:id/stock',
  authenticateToken,
  adminOrEditor,
  validate(idParamSchema),
  productController.updateStock
);

export default router;
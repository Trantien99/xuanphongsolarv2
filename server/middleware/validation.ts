import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

// Generic validation middleware
export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal server error',
        });
      }
    }
  };
};

// User validation schemas
export const userSchemas = {
  register: z.object({
    body: z.object({
      username: z.string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username cannot exceed 30 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
      email: z.string().email('Invalid email format'),
      password: z.string()
        .min(6, 'Password must be at least 6 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
      fullName: z.string().optional(),
      phoneNumber: z.string().optional(),
    }),
  }),
  
  login: z.object({
    body: z.object({
      email: z.string().email('Invalid email format'),
      password: z.string().min(1, 'Password is required'),
    }),
  }),
  
  updateProfile: z.object({
    body: z.object({
      fullName: z.string().optional(),
      phoneNumber: z.string().optional(),
      address: z.string().optional(),
    }),
  }),
};

// Category validation schemas
export const categorySchemas = {
  create: z.object({
    body: z.object({
      name: z.string()
        .min(1, 'Category name is required')
        .max(100, 'Category name cannot exceed 100 characters'),
      slug: z.string().optional(),
      description: z.string().max(1000, 'Description cannot exceed 1000 characters').optional(),
      parentCategory: z.string().optional(),
      image: z.string().url('Invalid image URL').optional(),
      sortOrder: z.number().min(0).optional(),
      metaTitle: z.string().max(160, 'Meta title cannot exceed 160 characters').optional(),
      metaDescription: z.string().max(320, 'Meta description cannot exceed 320 characters').optional(),
      metaKeywords: z.array(z.string()).optional(),
    }),
  }),
  
  update: z.object({
    params: z.object({
      id: z.string().min(1, 'Category ID is required'),
    }),
    body: z.object({
      name: z.string()
        .min(1, 'Category name is required')
        .max(100, 'Category name cannot exceed 100 characters')
        .optional(),
      slug: z.string().optional(),
      description: z.string().max(1000, 'Description cannot exceed 1000 characters').optional(),
      parentCategory: z.string().optional(),
      image: z.string().url('Invalid image URL').optional(),
      isActive: z.boolean().optional(),
      sortOrder: z.number().min(0).optional(),
      metaTitle: z.string().max(160, 'Meta title cannot exceed 160 characters').optional(),
      metaDescription: z.string().max(320, 'Meta description cannot exceed 320 characters').optional(),
      metaKeywords: z.array(z.string()).optional(),
    }),
  }),
};

// Product validation schemas
export const productSchemas = {
  create: z.object({
    body: z.object({
      name: z.string()
        .min(1, 'Product name is required')
        .max(200, 'Product name cannot exceed 200 characters'),
      slug: z.string().optional(),
      description: z.string().min(1, 'Product description is required'),
      shortDescription: z.string().max(500, 'Short description cannot exceed 500 characters').optional(),
      sku: z.string().min(1, 'SKU is required'),
      price: z.number().min(0, 'Price cannot be negative'),
      salePrice: z.number().min(0, 'Sale price cannot be negative').optional(),
      cost: z.number().min(0, 'Cost cannot be negative').optional(),
      stock: z.number().min(0, 'Stock cannot be negative'),
      minStock: z.number().min(0, 'Minimum stock cannot be negative').optional(),
      weight: z.number().min(0, 'Weight cannot be negative').optional(),
      dimensions: z.object({
        length: z.number().min(0),
        width: z.number().min(0),
        height: z.number().min(0),
      }).optional(),
      category: z.string().min(1, 'Category is required'),
      subcategories: z.array(z.string()).optional(),
      tags: z.array(z.string()).optional(),
      images: z.array(z.object({
        url: z.string().url('Invalid image URL'),
        alt: z.string().min(1, 'Image alt text is required'),
        isPrimary: z.boolean().optional(),
      })).optional(),
      isActive: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
      isDigital: z.boolean().optional(),
      status: z.enum(['draft', 'published', 'archived']).optional(),
    }),
  }),
  
  update: z.object({
    params: z.object({
      id: z.string().min(1, 'Product ID is required'),
    }),
    body: z.object({
      name: z.string()
        .min(1, 'Product name is required')
        .max(200, 'Product name cannot exceed 200 characters')
        .optional(),
      slug: z.string().optional(),
      description: z.string().min(1, 'Product description is required').optional(),
      shortDescription: z.string().max(500, 'Short description cannot exceed 500 characters').optional(),
      sku: z.string().min(1, 'SKU is required').optional(),
      price: z.number().min(0, 'Price cannot be negative').optional(),
      salePrice: z.number().min(0, 'Sale price cannot be negative').optional(),
      cost: z.number().min(0, 'Cost cannot be negative').optional(),
      stock: z.number().min(0, 'Stock cannot be negative').optional(),
      minStock: z.number().min(0, 'Minimum stock cannot be negative').optional(),
      weight: z.number().min(0, 'Weight cannot be negative').optional(),
      dimensions: z.object({
        length: z.number().min(0),
        width: z.number().min(0),
        height: z.number().min(0),
      }).optional(),
      category: z.string().min(1, 'Category is required').optional(),
      subcategories: z.array(z.string()).optional(),
      tags: z.array(z.string()).optional(),
      images: z.array(z.object({
        url: z.string().url('Invalid image URL'),
        alt: z.string().min(1, 'Image alt text is required'),
        isPrimary: z.boolean().optional(),
      })).optional(),
      isActive: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
      isDigital: z.boolean().optional(),
      status: z.enum(['draft', 'published', 'archived']).optional(),
    }),
  }),
};

// News validation schemas
export const newsSchemas = {
  create: z.object({
    body: z.object({
      title: z.string()
        .min(1, 'News title is required')
        .max(200, 'Title cannot exceed 200 characters'),
      slug: z.string().optional(),
      summary: z.string()
        .min(1, 'News summary is required')
        .max(500, 'Summary cannot exceed 500 characters'),
      content: z.string().min(1, 'News content is required'),
      excerpt: z.string().max(300, 'Excerpt cannot exceed 300 characters').optional(),
      featuredImage: z.object({
        url: z.string().url('Invalid image URL'),
        alt: z.string().min(1, 'Image alt text is required'),
        caption: z.string().optional(),
      }),
      gallery: z.array(z.object({
        url: z.string().url('Invalid image URL'),
        alt: z.string().min(1, 'Image alt text is required'),
        caption: z.string().optional(),
      })).optional(),
      category: z.string().min(1, 'Category is required'),
      tags: z.array(z.string()).optional(),
      coAuthors: z.array(z.string()).optional(),
      status: z.enum(['draft', 'published', 'archived', 'scheduled']).optional(),
      publishedAt: z.string().datetime().optional(),
      scheduledAt: z.string().datetime().optional(),
      isSticky: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
      allowComments: z.boolean().optional(),
      source: z.string().optional(),
      sourceUrl: z.string().url('Invalid source URL').optional(),
    }),
  }),
  
  update: z.object({
    params: z.object({
      id: z.string().min(1, 'News ID is required'),
    }),
    body: z.object({
      title: z.string()
        .min(1, 'News title is required')
        .max(200, 'Title cannot exceed 200 characters')
        .optional(),
      slug: z.string().optional(),
      summary: z.string()
        .min(1, 'News summary is required')
        .max(500, 'Summary cannot exceed 500 characters')
        .optional(),
      content: z.string().min(1, 'News content is required').optional(),
      excerpt: z.string().max(300, 'Excerpt cannot exceed 300 characters').optional(),
      featuredImage: z.object({
        url: z.string().url('Invalid image URL'),
        alt: z.string().min(1, 'Image alt text is required'),
        caption: z.string().optional(),
      }).optional(),
      gallery: z.array(z.object({
        url: z.string().url('Invalid image URL'),
        alt: z.string().min(1, 'Image alt text is required'),
        caption: z.string().optional(),
      })).optional(),
      category: z.string().min(1, 'Category is required').optional(),
      tags: z.array(z.string()).optional(),
      coAuthors: z.array(z.string()).optional(),
      status: z.enum(['draft', 'published', 'archived', 'scheduled']).optional(),
      publishedAt: z.string().datetime().optional(),
      scheduledAt: z.string().datetime().optional(),
      isSticky: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
      allowComments: z.boolean().optional(),
      source: z.string().optional(),
      sourceUrl: z.string().url('Invalid source URL').optional(),
    }),
  }),
};

// Common parameter validation
export const idParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'ID is required'),
  }),
});

// Query parameter validation
export const querySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    sort: z.string().optional(),
    search: z.string().optional(),
    category: z.string().optional(),
    status: z.string().optional(),
    isActive: z.string().regex(/^(true|false)$/).transform(val => val === 'true').optional(),
    isFeatured: z.string().regex(/^(true|false)$/).transform(val => val === 'true').optional(),
  }),
});

export default {
  validate,
  userSchemas,
  categorySchemas,
  productSchemas,
  newsSchemas,
  idParamSchema,
  querySchema,
};
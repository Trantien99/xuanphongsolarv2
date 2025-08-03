import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { ApiResponse } from '../types/api';

// Create new product
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      } as ApiResponse);
      return;
    }

    const productData = {
      ...req.body,
      createdBy: req.user._id,
    };

    const product = new Product(productData);
    await product.save();

    const populatedProduct = await Product.findById(product._id)
      .populate('category', 'name slug')
      .populate('subcategories', 'name slug')
      .populate('createdBy', 'username email');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: populatedProduct,
    } as ApiResponse);
  } catch (error: any) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      res.status(400).json({
        success: false,
        message: `${field} already exists`,
      } as ApiResponse);
    } else {
      res.status(500).json({
        success: false,
        message: 'Error creating product',
        error: error.message,
      } as ApiResponse);
    }
  }
};

// Get all products with advanced filtering
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const category = req.query.category as string;
    const status = req.query.status as string;
    const isActive = req.query.isActive as string;
    const isFeatured = req.query.isFeatured as string;
    const minPrice = req.query.minPrice as string;
    const maxPrice = req.query.maxPrice as string;
    const inStock = req.query.inStock as string;
    const sort = req.query.sort as string || '-createdAt';

    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    if (category) {
      query.$or = [
        { category },
        { subcategories: { $in: [category] } },
      ];
    }

    if (status) {
      query.status = status;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    if (isFeatured !== undefined) {
      query.isFeatured = isFeatured === 'true';
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    } else if (inStock === 'false') {
      query.stock = { $lte: 0 };
    }

    // Parse sort parameter
    let sortOption: any = {};
    if (sort) {
      const sortFields = sort.split(',');
      sortFields.forEach(field => {
        if (field.startsWith('-')) {
          sortOption[field.substring(1)] = -1;
        } else {
          sortOption[field] = 1;
        }
      });
    }

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .populate('subcategories', 'name slug')
        .populate('createdBy', 'username email')
        .sort(sortOption)
        .skip(skip)
        .limit(limit),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit,
        },
      },
    } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message,
    } as ApiResponse);
  }
};

// Get product by ID
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid product ID',
      } as ApiResponse);
      return;
    }

    const product = await Product.findById(id)
      .populate('category', 'name slug')
      .populate('subcategories', 'name slug')
      .populate('createdBy', 'username email')
      .populate('updatedBy', 'username email');

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      } as ApiResponse);
      return;
    }

    // Increment view count
    await Product.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });

    res.json({
      success: true,
      data: product,
    } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message,
    } as ApiResponse);
  }
};

// Get product by slug
export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ slug, isActive: true, status: 'published' })
      .populate('category', 'name slug')
      .populate('subcategories', 'name slug')
      .populate('createdBy', 'username email');

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      } as ApiResponse);
      return;
    }

    // Increment view count
    await Product.findByIdAndUpdate(product._id, { $inc: { viewCount: 1 } });

    res.json({
      success: true,
      data: product,
    } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message,
    } as ApiResponse);
  }
};

// Update product
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid product ID',
      } as ApiResponse);
      return;
    }

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      } as ApiResponse);
      return;
    }

    // Check ownership for non-admin/editor users
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      } as ApiResponse);
      return;
    }

    if (!['admin', 'editor'].includes(req.user.role) && 
        !existingProduct.createdBy.equals(req.user._id)) {
      res.status(403).json({
        success: false,
        message: 'You can only update your own products',
      } as ApiResponse);
      return;
    }

    const updateData = {
      ...req.body,
      updatedBy: req.user._id,
    };

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('category', 'name slug')
      .populate('subcategories', 'name slug')
      .populate('createdBy', 'username email')
      .populate('updatedBy', 'username email');

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    } as ApiResponse);
  } catch (error: any) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      res.status(400).json({
        success: false,
        message: `${field} already exists`,
      } as ApiResponse);
    } else {
      res.status(500).json({
        success: false,
        message: 'Error updating product',
        error: error.message,
      } as ApiResponse);
    }
  }
};

// Delete product
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid product ID',
      } as ApiResponse);
      return;
    }

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      } as ApiResponse);
      return;
    }

    // Check ownership for non-admin/editor users
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      } as ApiResponse);
      return;
    }

    if (!['admin', 'editor'].includes(req.user.role) && 
        !existingProduct.createdBy.equals(req.user._id)) {
      res.status(403).json({
        success: false,
        message: 'You can only delete your own products',
      } as ApiResponse);
      return;
    }

    await Product.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Product deleted successfully',
    } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message,
    } as ApiResponse);
  }
};

// Update product stock
export const updateStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { stock, minStock } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid product ID',
      } as ApiResponse);
      return;
    }

    const updateData: any = {};
    if (stock !== undefined) updateData.stock = stock;
    if (minStock !== undefined) updateData.minStock = minStock;

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: {
        stock: product.stock,
        minStock: product.minStock,
        stockStatus: product.stockStatus,
      },
    } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating stock',
      error: error.message,
    } as ApiResponse);
  }
};

// Get featured products
export const getFeaturedProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    const products = await Product.find({
      isFeatured: true,
      isActive: true,
      status: 'published',
    })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: products,
    } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching featured products',
      error: error.message,
    } as ApiResponse);
  }
};

// Get related products
export const getRelatedProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit as string) || 5;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid product ID',
      } as ApiResponse);
      return;
    }

    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      } as ApiResponse);
      return;
    }

    const relatedProducts = await Product.find({
      _id: { $ne: id },
      category: product.category,
      isActive: true,
      status: 'published',
    })
      .populate('category', 'name slug')
      .sort({ viewCount: -1, createdAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: relatedProducts,
    } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching related products',
      error: error.message,
    } as ApiResponse);
  }
};

// Get low stock products
export const getLowStockProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find({
      $expr: { $lte: ['$stock', '$minStock'] },
      isActive: true,
    })
      .populate('category', 'name slug')
      .sort({ stock: 1 });

    res.json({
      success: true,
      data: products,
    } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching low stock products',
      error: error.message,
    } as ApiResponse);
  }
};

// Search products
export const searchProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!q) {
      res.status(400).json({
        success: false,
        message: 'Search query is required',
      } as ApiResponse);
      return;
    }

    const skip = (page - 1) * limit;

    const searchQuery = {
      $and: [
        {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { sku: { $regex: q, $options: 'i' } },
            { tags: { $in: [new RegExp(q as string, 'i')] } },
          ],
        },
        { isActive: true, status: 'published' },
      ],
    };

    const [products, total] = await Promise.all([
      Product.find(searchQuery)
        .populate('category', 'name slug')
        .sort({ viewCount: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments(searchQuery),
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit,
        },
        query: q,
      },
    } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error searching products',
      error: error.message,
    } as ApiResponse);
  }
};

export default {
  createProduct,
  getProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  updateStock,
  getFeaturedProducts,
  getRelatedProducts,
  getLowStockProducts,
  searchProducts,
};
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Category } from '../models/Category';
import { ApiResponse, PaginatedResponse } from '../types/api';

// Create new category
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      } as ApiResponse);
      return;
    }

    const categoryData = {
      ...req.body,
      createdBy: req.user._id,
    };

    const category = new Category(categoryData);
    await category.save();

    const populatedCategory = await Category.findById(category._id)
      .populate('createdBy', 'username email')
      .populate('parentCategory', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: populatedCategory,
    } as ApiResponse);
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'Category slug already exists',
      } as ApiResponse);
    } else {
      res.status(500).json({
        success: false,
        message: 'Error creating category',
        error: error.message,
      } as ApiResponse);
    }
  }
};

// Get all categories with optional filters
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const isActive = req.query.isActive as string;
    const parentCategory = req.query.parentCategory as string;
    const includeHierarchy = req.query.includeHierarchy === 'true';

    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    if (parentCategory) {
      if (parentCategory === 'null') {
        query.parentCategory = null;
      } else {
        query.parentCategory = parentCategory;
      }
    }

    const [categories, total] = await Promise.all([
      Category.find(query)
        .populate('createdBy', 'username email')
        .populate('parentCategory', 'name slug')
        .sort({ sortOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Category.countDocuments(query),
    ]);

    let responseData: any = {
      categories,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    };

    // If hierarchy is requested, organize categories in tree structure
    if (includeHierarchy) {
      const allCategories = await Category.find({ isActive: true })
        .populate('createdBy', 'username email')
        .sort({ sortOrder: 1, name: 1 });

      const categoryTree = buildCategoryTree(allCategories);
      responseData.hierarchy = categoryTree;
    }

    res.json({
      success: true,
      data: responseData,
    } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message,
    } as ApiResponse);
  }
};

// Get category by ID
export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid category ID',
      } as ApiResponse);
      return;
    }

    const category = await Category.findById(id)
      .populate('createdBy', 'username email')
      .populate('updatedBy', 'username email')
      .populate('parentCategory', 'name slug')
      .populate('subcategories');

    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found',
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: category,
    } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error.message,
    } as ApiResponse);
  }
};

// Get category by slug
export const getCategoryBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({ slug, isActive: true })
      .populate('createdBy', 'username email')
      .populate('parentCategory', 'name slug')
      .populate('subcategories');

    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found',
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: category,
    } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error.message,
    } as ApiResponse);
  }
};

// Update category
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid category ID',
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

    const updateData = {
      ...req.body,
      updatedBy: req.user._id,
    };

    const category = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'username email')
      .populate('updatedBy', 'username email')
      .populate('parentCategory', 'name slug');

    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found',
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    } as ApiResponse);
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'Category slug already exists',
      } as ApiResponse);
    } else {
      res.status(500).json({
        success: false,
        message: 'Error updating category',
        error: error.message,
      } as ApiResponse);
    }
  }
};

// Delete category
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid category ID',
      } as ApiResponse);
      return;
    }

    // Check if category has subcategories
    const subcategories = await Category.find({ parentCategory: id });
    if (subcategories.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Cannot delete category with subcategories. Please delete or move subcategories first.',
      } as ApiResponse);
      return;
    }

    // Check if category is used by products (you might want to add this check)
    // const productsCount = await Product.countDocuments({ category: id });
    // if (productsCount > 0) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Cannot delete category that has products. Please move or delete products first.',
    //   });
    // }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found',
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      message: 'Category deleted successfully',
    } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting category',
      error: error.message,
    } as ApiResponse);
  }
};

// Get category tree (hierarchical structure)
export const getCategoryTree = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('createdBy', 'username email')
      .sort({ sortOrder: 1, name: 1 });

    const categoryTree = buildCategoryTree(categories);

    res.json({
      success: true,
      data: categoryTree,
    } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching category tree',
      error: error.message,
    } as ApiResponse);
  }
};

// Helper function to build category tree
function buildCategoryTree(categories: any[]): any[] {
  const categoryMap = new Map();
  const rootCategories: any[] = [];

  // Create a map of categories
  categories.forEach(category => {
    categoryMap.set(category._id.toString(), {
      ...category.toObject(),
      children: [],
    });
  });

  // Build the tree structure
  categories.forEach(category => {
    const categoryObj = categoryMap.get(category._id.toString());
    
    if (category.parentCategory) {
      const parent = categoryMap.get(category.parentCategory.toString());
      if (parent) {
        parent.children.push(categoryObj);
      }
    } else {
      rootCategories.push(categoryObj);
    }
  });

  return rootCategories;
}

// Reorder categories
export const reorderCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoryOrders } = req.body; // Array of { id, sortOrder }

    if (!Array.isArray(categoryOrders)) {
      res.status(400).json({
        success: false,
        message: 'Category orders must be an array',
      } as ApiResponse);
      return;
    }

    const updatePromises = categoryOrders.map(({ id, sortOrder }) =>
      Category.findByIdAndUpdate(id, { sortOrder })
    );

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: 'Categories reordered successfully',
    } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error reordering categories',
      error: error.message,
    } as ApiResponse);
  }
};

export default {
  createCategory,
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
  getCategoryTree,
  reorderCategories,
};
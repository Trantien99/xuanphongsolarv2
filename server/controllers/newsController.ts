import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { News } from '../models/News';
import { ApiResponse } from '../types/api';

// Create new news article
export const createNews = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      } as ApiResponse);
      return;
    }

    const newsData = {
      ...req.body,
      author: req.user._id,
      createdBy: req.user._id,
    };

    const news = new News(newsData);
    await news.save();

    const populatedNews = await News.findById(news._id)
      .populate('category', 'name slug')
      .populate('author', 'username email fullName')
      .populate('coAuthors', 'username email fullName')
      .populate('createdBy', 'username email');

    res.status(201).json({
      success: true,
      message: 'News article created successfully',
      data: populatedNews,
    } as ApiResponse);
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'News slug already exists',
      } as ApiResponse);
    } else {
      res.status(500).json({
        success: false,
        message: 'Error creating news article',
        error: error.message,
      } as ApiResponse);
    }
  }
};

// Get all news with filtering and pagination
export const getNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const category = req.query.category as string;
    const status = req.query.status as string;
    const author = req.query.author as string;
    const isFeatured = req.query.isFeatured as string;
    const isSticky = req.query.isSticky as string;
    const sort = req.query.sort as string || '-publishedAt';

    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (status) {
      query.status = status;
    } else {
      // For public access, only show published articles
      if (!req.user || req.user.role === 'user') {
        query.status = 'published';
        query.publishedAt = { $lte: new Date() };
      }
    }

    if (author) {
      query.$or = [
        { author },
        { coAuthors: { $in: [author] } },
      ];
    }

    if (isFeatured !== undefined) {
      query.isFeatured = isFeatured === 'true';
    }

    if (isSticky !== undefined) {
      query.isSticky = isSticky === 'true';
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

    const [newsArticles, total] = await Promise.all([
      News.find(query)
        .populate('category', 'name slug')
        .populate('author', 'username email fullName')
        .populate('coAuthors', 'username email fullName')
        .populate('createdBy', 'username email')
        .sort(sortOption)
        .skip(skip)
        .limit(limit),
      News.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        news: newsArticles,
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
      message: 'Error fetching news articles',
      error: error.message,
    } as ApiResponse);
  }
};

// Get news article by ID
export const getNewsById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid news ID',
      } as ApiResponse);
      return;
    }

    const news = await News.findById(id)
      .populate('category', 'name slug')
      .populate('author', 'username email fullName')
      .populate('coAuthors', 'username email fullName')
      .populate('createdBy', 'username email')
      .populate('updatedBy', 'username email')
      .populate('relatedNews', 'title slug featuredImage');

    if (!news) {
      res.status(404).json({
        success: false,
        message: 'News article not found',
      } as ApiResponse);
      return;
    }

    // Check if user can access this news article
    if (news.status !== 'published' && 
        (!req.user || !['admin', 'editor'].includes(req.user.role)) &&
        (!req.user || !news.author.equals(req.user._id))) {
      res.status(403).json({
        success: false,
        message: 'Access denied',
      } as ApiResponse);
      return;
    }

    // Increment view count for published articles
    if (news.status === 'published') {
      await News.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
    }

    res.json({
      success: true,
      data: news,
    } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching news article',
      error: error.message,
    } as ApiResponse);
  }
};

// Get news article by slug
export const getNewsBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const news = await News.findOne({
      slug,
      status: 'published',
      publishedAt: { $lte: new Date() },
    })
      .populate('category', 'name slug')
      .populate('author', 'username email fullName')
      .populate('coAuthors', 'username email fullName')
      .populate('relatedNews', 'title slug featuredImage');

    if (!news) {
      res.status(404).json({
        success: false,
        message: 'News article not found',
      } as ApiResponse);
      return;
    }

    // Increment view count
    await News.findByIdAndUpdate(news._id, { $inc: { viewCount: 1 } });

    res.json({
      success: true,
      data: news,
    } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching news article',
      error: error.message,
    } as ApiResponse);
  }
};

// Update news article
export const updateNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid news ID',
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
    const existingNews = await News.findById(id);
    if (!existingNews) {
      res.status(404).json({
        success: false,
        message: 'News article not found',
      } as ApiResponse);
      return;
    }

    if (!['admin', 'editor'].includes(req.user.role) && 
        !existingNews.author.equals(req.user._id)) {
      res.status(403).json({
        success: false,
        message: 'You can only update your own articles',
      } as ApiResponse);
      return;
    }

    const updateData = {
      ...req.body,
      updatedBy: req.user._id,
    };

    const news = await News.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('category', 'name slug')
      .populate('author', 'username email fullName')
      .populate('coAuthors', 'username email fullName')
      .populate('createdBy', 'username email')
      .populate('updatedBy', 'username email');

    res.json({
      success: true,
      message: 'News article updated successfully',
      data: news,
    } as ApiResponse);
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'News slug already exists',
      } as ApiResponse);
    } else {
      res.status(500).json({
        success: false,
        message: 'Error updating news article',
        error: error.message,
      } as ApiResponse);
    }
  }
};

// Delete news article
export const deleteNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid news ID',
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
    const existingNews = await News.findById(id);
    if (!existingNews) {
      res.status(404).json({
        success: false,
        message: 'News article not found',
      } as ApiResponse);
      return;
    }

    if (!['admin', 'editor'].includes(req.user.role) && 
        !existingNews.author.equals(req.user._id)) {
      res.status(403).json({
        success: false,
        message: 'You can only delete your own articles',
      } as ApiResponse);
      return;
    }

    await News.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'News article deleted successfully',
    } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting news article',
      error: error.message,
    } as ApiResponse);
  }
};

// Publish news article
export const publishNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid news ID',
      } as ApiResponse);
      return;
    }

    const news = await News.findByIdAndUpdate(
      id,
      {
        status: 'published',
        publishedAt: new Date(),
      },
      { new: true }
    );

    if (!news) {
      res.status(404).json({
        success: false,
        message: 'News article not found',
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      message: 'News article published successfully',
      data: news,
    } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error publishing news article',
      error: error.message,
    } as ApiResponse);
  }
};

// Get featured news
export const getFeaturedNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 5;

    const news = await News.find({
      isFeatured: true,
      status: 'published',
      publishedAt: { $lte: new Date() },
    })
      .populate('category', 'name slug')
      .populate('author', 'username email fullName')
      .sort({ isSticky: -1, publishedAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: news,
    } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching featured news',
      error: error.message,
    } as ApiResponse);
  }
};

// Get related news
export const getRelatedNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit as string) || 5;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid news ID',
      } as ApiResponse);
      return;
    }

    const news = await News.findById(id);
    if (!news) {
      res.status(404).json({
        success: false,
        message: 'News article not found',
      } as ApiResponse);
      return;
    }

    const relatedNews = await News.find({
      _id: { $ne: id },
      category: news.category,
      status: 'published',
      publishedAt: { $lte: new Date() },
    })
      .populate('category', 'name slug')
      .populate('author', 'username email fullName')
      .sort({ viewCount: -1, publishedAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: relatedNews,
    } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching related news',
      error: error.message,
    } as ApiResponse);
  }
};

// Search news
export const searchNews = async (req: Request, res: Response): Promise<void> => {
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
            { title: { $regex: q, $options: 'i' } },
            { summary: { $regex: q, $options: 'i' } },
            { content: { $regex: q, $options: 'i' } },
            { tags: { $in: [new RegExp(q as string, 'i')] } },
          ],
        },
        {
          status: 'published',
          publishedAt: { $lte: new Date() },
        },
      ],
    };

    const [newsArticles, total] = await Promise.all([
      News.find(searchQuery)
        .populate('category', 'name slug')
        .populate('author', 'username email fullName')
        .sort({ viewCount: -1, publishedAt: -1 })
        .skip(skip)
        .limit(limit),
      News.countDocuments(searchQuery),
    ]);

    res.json({
      success: true,
      data: {
        news: newsArticles,
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
      message: 'Error searching news',
      error: error.message,
    } as ApiResponse);
  }
};

// Update news interactions (like, share)
export const updateNewsInteraction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'like' or 'share'

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid news ID',
      } as ApiResponse);
      return;
    }

    if (!['like', 'share'].includes(action)) {
      res.status(400).json({
        success: false,
        message: 'Invalid action. Must be "like" or "share"',
      } as ApiResponse);
      return;
    }

    const updateField = action === 'like' ? 'likeCount' : 'shareCount';
    const news = await News.findByIdAndUpdate(
      id,
      { $inc: { [updateField]: 1 } },
      { new: true }
    );

    if (!news) {
      res.status(404).json({
        success: false,
        message: 'News article not found',
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      message: `News ${action} updated successfully`,
      data: {
        likeCount: news.likeCount,
        shareCount: news.shareCount,
      },
    } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating news interaction',
      error: error.message,
    } as ApiResponse);
  }
};

export default {
  createNews,
  getNews,
  getNewsById,
  getNewsBySlug,
  updateNews,
  deleteNews,
  publishNews,
  getFeaturedNews,
  getRelatedNews,
  searchNews,
  updateNewsInteraction,
};
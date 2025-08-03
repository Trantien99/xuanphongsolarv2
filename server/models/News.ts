import mongoose, { Document, Schema } from 'mongoose';

interface INewsImage {
  url: string;
  alt: string;
  caption?: string;
}

interface INewsSEO {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  canonicalUrl?: string;
}

export interface INews extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  summary: string;
  content: string;
  excerpt?: string;
  featuredImage: INewsImage;
  gallery?: INewsImage[];
  category: mongoose.Types.ObjectId;
  tags?: string[];
  author: mongoose.Types.ObjectId;
  coAuthors?: mongoose.Types.ObjectId[];
  status: 'draft' | 'published' | 'archived' | 'scheduled';
  publishedAt?: Date;
  scheduledAt?: Date;
  isSticky: boolean;
  isFeatured: boolean;
  allowComments: boolean;
  viewCount: number;
  likeCount: number;
  shareCount: number;
  readingTime: number; // in minutes
  source?: string;
  sourceUrl?: string;
  seo: INewsSEO;
  relatedNews?: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const newsImageSchema = new Schema<INewsImage>({
  url: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    trim: true,
  },
});

const newsSEOSchema = new Schema<INewsSEO>({
  metaTitle: {
    type: String,
    trim: true,
    maxlength: [160, 'Meta title cannot exceed 160 characters'],
  },
  metaDescription: {
    type: String,
    trim: true,
    maxlength: [320, 'Meta description cannot exceed 320 characters'],
  },
  metaKeywords: [{
    type: String,
    trim: true,
  }],
  canonicalUrl: {
    type: String,
    trim: true,
  },
});

const newsSchema = new Schema<INews>(
  {
    title: {
      type: String,
      required: [true, 'News title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'News slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers and hyphens'],
    },
    summary: {
      type: String,
      required: [true, 'News summary is required'],
      trim: true,
      maxlength: [500, 'Summary cannot exceed 500 characters'],
    },
    content: {
      type: String,
      required: [true, 'News content is required'],
      trim: true,
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
    },
    featuredImage: {
      type: newsImageSchema,
      required: [true, 'Featured image is required'],
    },
    gallery: [newsImageSchema],
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
    }],
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    coAuthors: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    status: {
      type: String,
      enum: ['draft', 'published', 'archived', 'scheduled'],
      default: 'draft',
    },
    publishedAt: {
      type: Date,
    },
    scheduledAt: {
      type: Date,
    },
    isSticky: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    allowComments: {
      type: Boolean,
      default: true,
    },
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    shareCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    readingTime: {
      type: Number,
      default: 1,
      min: 1,
    },
    source: {
      type: String,
      trim: true,
    },
    sourceUrl: {
      type: String,
      trim: true,
      validate: {
        validator: function(v: string) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'Source URL must be a valid HTTP/HTTPS URL',
      },
    },
    seo: newsSEOSchema,
    relatedNews: [{
      type: Schema.Types.ObjectId,
      ref: 'News',
    }],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for formatted publish date
newsSchema.virtual('formattedPublishDate').get(function() {
  if (this.publishedAt) {
    return this.publishedAt.toLocaleDateString();
  }
  return null;
});

// Virtual for publication status
newsSchema.virtual('isPublished').get(function() {
  return this.status === 'published' && 
         this.publishedAt && 
         this.publishedAt <= new Date();
});

// Pre-save middleware to generate slug if not provided
newsSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

// Calculate reading time based on content
newsSchema.pre('save', function (next) {
  if (this.isModified('content')) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / wordsPerMinute) || 1;
  }
  next();
});

// Set publishedAt when status changes to published
newsSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Generate excerpt from content if not provided
newsSchema.pre('save', function (next) {
  if (!this.excerpt && this.content) {
    // Remove HTML tags and get first 250 characters
    const plainText = this.content.replace(/<[^>]*>/g, '');
    this.excerpt = plainText.substring(0, 250).trim() + (plainText.length > 250 ? '...' : '');
  }
  next();
});

// Indexes for performance
newsSchema.index({ slug: 1 });
newsSchema.index({ status: 1, publishedAt: -1 });
newsSchema.index({ category: 1 });
newsSchema.index({ author: 1 });
newsSchema.index({ tags: 1 });
newsSchema.index({ isSticky: 1, isFeatured: 1 });
newsSchema.index({ publishedAt: -1 });
newsSchema.index({ viewCount: -1 });
newsSchema.index({ createdAt: -1 });
newsSchema.index({ title: 'text', summary: 'text', content: 'text' });

// Compound indexes
newsSchema.index({ status: 1, isFeatured: 1, publishedAt: -1 });
newsSchema.index({ category: 1, status: 1, publishedAt: -1 });

export const News = mongoose.model<INews>('News', newsSchema);
export default News;
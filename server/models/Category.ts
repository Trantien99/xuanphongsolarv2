import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  parentCategory?: mongoose.Types.ObjectId;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [100, 'Category name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Category slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers and hyphens'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    image: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
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

// Virtual for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentCategory',
});

// Virtual for products count
categorySchema.virtual('productsCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true,
});

// Pre-save middleware to generate slug if not provided
categorySchema.pre('save', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

// Prevent circular references in parent-child relationships
categorySchema.pre('save', async function (next) {
  if (this.parentCategory && this.parentCategory.equals(this._id)) {
    const error = new Error('Category cannot be its own parent');
    return next(error);
  }
  
  // Check for circular reference
  if (this.parentCategory && this.isModified('parentCategory')) {
    let currentParent = this.parentCategory;
    const visited = new Set();
    
    while (currentParent) {
      if (visited.has(currentParent.toString())) {
        const error = new Error('Circular reference detected in category hierarchy');
        return next(error);
      }
      
      if (currentParent.equals(this._id)) {
        const error = new Error('Cannot create circular reference in category hierarchy');
        return next(error);
      }
      
      visited.add(currentParent.toString());
      
      const parent = await mongoose.model('Category').findById(currentParent);
      currentParent = parent?.parentCategory;
    }
  }
  
  next();
});

// Indexes for performance
categorySchema.index({ slug: 1 });
categorySchema.index({ parentCategory: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ sortOrder: 1 });
categorySchema.index({ name: 'text', description: 'text' });

export const Category = mongoose.model<ICategory>('Category', categorySchema);
export default Category;
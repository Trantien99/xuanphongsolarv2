import mongoose, { Document, Schema } from 'mongoose';

interface IProductVariant {
  name: string;
  value: string;
  price: number;
  stock: number;
  sku: string;
  isActive: boolean;
}

interface IProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

interface IProductSEO {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  canonicalUrl?: string;
}

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  sku: string;
  price: number;
  salePrice?: number;
  cost?: number;
  stock: number;
  minStock: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  category: mongoose.Types.ObjectId;
  subcategories?: mongoose.Types.ObjectId[];
  tags?: string[];
  images: IProductImage[];
  variants?: IProductVariant[];
  isActive: boolean;
  isFeatured: boolean;
  isDigital: boolean;
  status: 'draft' | 'published' | 'archived';
  seo: IProductSEO;
  viewCount: number;
  rating: number;
  reviewCount: number;
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const productImageSchema = new Schema<IProductImage>({
  url: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
  isPrimary: {
    type: Boolean,
    default: false,
  },
});

const productVariantSchema = new Schema<IProductVariant>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  value: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const productSEOSchema = new Schema<IProductSEO>({
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

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers and hyphens'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [500, 'Short description cannot exceed 500 characters'],
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    salePrice: {
      type: Number,
      min: [0, 'Sale price cannot be negative'],
      validate: {
        validator: function(value: number) {
          return !value || value < this.price;
        },
        message: 'Sale price must be less than regular price',
      },
    },
    cost: {
      type: Number,
      min: [0, 'Cost cannot be negative'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    minStock: {
      type: Number,
      default: 5,
      min: [0, 'Minimum stock cannot be negative'],
    },
    weight: {
      type: Number,
      min: [0, 'Weight cannot be negative'],
    },
    dimensions: {
      length: {
        type: Number,
        min: [0, 'Length cannot be negative'],
      },
      width: {
        type: Number,
        min: [0, 'Width cannot be negative'],
      },
      height: {
        type: Number,
        min: [0, 'Height cannot be negative'],
      },
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    subcategories: [{
      type: Schema.Types.ObjectId,
      ref: 'Category',
    }],
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
    }],
    images: [productImageSchema],
    variants: [productVariantSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isDigital: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    seo: productSEOSchema,
    viewCount: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
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

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.salePrice && this.price) {
    return Math.round(((this.price - this.salePrice) / this.price) * 100);
  }
  return 0;
});

// Virtual for current price
productSchema.virtual('currentPrice').get(function() {
  return this.salePrice || this.price;
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (this.stock === 0) return 'out-of-stock';
  if (this.stock <= this.minStock) return 'low-stock';
  return 'in-stock';
});

// Pre-save middleware to generate slug if not provided
productSchema.pre('save', function (next) {
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

// Ensure only one primary image
productSchema.pre('save', function (next) {
  const primaryImages = this.images.filter(img => img.isPrimary);
  if (primaryImages.length > 1) {
    // Keep only the first primary image
    this.images.forEach((img, index) => {
      if (img.isPrimary && index > 0) {
        img.isPrimary = false;
      }
    });
  }
  next();
});

// Indexes for performance
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ isActive: 1, status: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ viewCount: -1 });
productSchema.index({ rating: -1 });
productSchema.index({ name: 'text', description: 'text', shortDescription: 'text' });

export const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product;
import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    // required: true,
    unique: true,
    lowercase: true
  },
  content: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    default: ""
  },
  metaTitle: {
    type: String,
    default: ""
  },
  metaDescription: {
    type: String,
    default: ""
  },
  author: {
    type: String,
    required: true,
    default: "Timeless Aesthetics"
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create slug from title before saving
blogSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();
  }
  next();
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;

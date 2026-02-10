import express from 'express';
import {
  getAllBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogById
} from '../controllers/blogController.js';

import isAuth from "../middlewares/isAuth.js"

const router = express.Router();

// Public routes
router.get('/', getAllBlogs);
router.get('/slug/:slug', getBlogBySlug);

// Admin routes (protected)
// router.post('/', isAuth, createBlog);
// router.get('/admin/:id', isAuth, getBlogById);
// router.put('/:id', isAuth, updateBlog);
// router.delete('/:id', isAuth, deleteBlog);



router.post('/', createBlog);
router.get('/admin/:id', getBlogById);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);




export default router;

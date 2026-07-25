import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { getCategories, addCategory, removeCategory } from './category.controller.js';
const router = Router();
router.use(authenticate);
router.get('/', getCategories);
router.post('/', addCategory);
router.delete('/:id', removeCategory);
export default router;

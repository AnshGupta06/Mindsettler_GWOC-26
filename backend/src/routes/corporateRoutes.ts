// backend/src/routes/corporateRoutes.ts
import express from 'express';
import { submitInquiry } from '../controllers/corporateController';

const router = express.Router();

router.post('/inquiry', submitInquiry);

export default router;
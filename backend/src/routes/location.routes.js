import express from 'express';
import { reverseGeocode, searchLocation } from '../controllers/location.controller.js';

const router = express.Router();

router.get('/reverse-geocode', reverseGeocode);
router.get('/search', searchLocation);

export default router;

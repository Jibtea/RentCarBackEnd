const express = require('express');
const {
  getAllCarProviders,
  getOneCarProvider,
  addCarProvider,
  updateCarProvider,
  deleteCarProvider
} = require('../controller/carProvider');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getAllCarProviders)
  .post(protect, authorize('admin', 'provider'), addCarProvider);

router.route('/:id')
  .get(getOneCarProvider)
  .put(protect, authorize('admin', 'provider'), updateCarProvider)
  .delete(protect, authorize('admin', 'provider'), deleteCarProvider);


module.exports = router;
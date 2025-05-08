const express = require('express');
const {
  getAllCars,
  getOneCar,
  addCar,
  deleteCar,
  updateCar
} = require('../controller/car');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getAllCars);
router.route('/:id')
  .get(getOneCar)
  .post(protect, authorize('admin', 'provider'), addCar)
  .delete(protect, authorize('admin', 'provider'), deleteCar)
  .put(protect, authorize('admin', 'provider'), updateCar);

module.exports = router;
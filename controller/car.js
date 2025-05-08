const Car = require('../models/Car');
const CarProvider = require('../models/CarProvider');


//get
exports.getAllCars = async (req, res) => {
  try {
    const Cars = await Car.find();

    res.status(200).json({
      success: true,
      count: Cars.length,
      data: Cars
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

exports.getOneCar = async (req, res) => {
  try {
    const car = await Car.findbyID(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car ID not found"
      });
    }

    res.status(200).json({
      success: true,
      data: car
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

//add
exports.addCar = async (req, res) => {
  try {
    const provider = req.params.id;
    const { model, brand, year, picture, available, pricePerDay } = req.body;

    const newCar = new Car({
      provider,
      model,
      brand,
      year,
      picture,
      available,
      pricePerDay
    })

    await newCar.save();

    res.status(201).json({
      success: true,
      data: newCar
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

//delete
exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Car delete successfully'
    })
  } catch (err) {
    res.status(500).json({
      sucess: false,
      error: err.message
    });
  }
};

//update
exports.updateCar = async (req, res) => {
  try {
    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true
        , runValidators: true
      }
    );

    if (!updatedCar) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedCar
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
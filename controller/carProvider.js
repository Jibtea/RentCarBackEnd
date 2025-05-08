const CarProvider = require('../models/CarProvider');
const Car = require('../models/Car');

//get
exports.getAllCarProviders = async (req, res) => {
  try {
    const providers = await CarProvider.find().populate('cars');

    res.status(200).json({
      success: true,
      count: providers.length,
      data: providers
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getOneCarProvider = async (req, res) => {
  try {
    const provider = await CarProvider.findById(req.params.id).populate('cars');

    if (!provider) {
      return res.status(404).json({ success: false, massage: "not found the rental car provider" });
    }

    res.status(200).json({
      success: true,
      data: provider
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


//add
exports.addCarProvider = async (req, res) => {
  try {
    const owner = req.user._id;
    const { name, address, province, tel } = req.body;

    // ตรวจสอบว่ามี provider นี้ในระบบแล้วหรือยัง
    const existingProvider = await CarProvider.findOne({ name });
    if (existingProvider) {
      return res.status(400).json({ success: false, message: 'Car provider already exists' });
    }


    const newCarProvider = new CarProvider({
      name,
      address,
      province,
      tel,
      owner
    })

    // บันทึกข้อมูล provider ลงฐานข้อมูล
    await newCarProvider.save();


    res.status(201).json({
      success: true,
      data: newCarProvider
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

//delete
exports.deleteCarProvider = async (req, res) => {
  try {
    const provider = await CarProvider.findById(req.params.id).populate('cars');
    // const provider = await CarProvider.findByIdAndDelete(req.params.id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Rental car provider not found"
      });
    }

    // ลบรถทั้งหมดที่ provider นี้เป็นเจ้าของ
    await Car.deleteMany({ provider: req.params.id });

    // ลบ provider
    await CarProvider.findByIdAndDelete(req.params.id);


    res.status(200).json({
      success: true,
      message: 'Provider deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
};

//update
exports.updateCarProvider = async (req, res) => {
  try {
    const updatedProvider = await CarProvider.findByIdAndUpdate(
      req.params.id,
      req.body, // 👈 ข้อมูลที่ต้องการอัปเดต
      {
        new: true,             // ให้คืนค่าใหม่หลังอัปเดต
        runValidators: true    // ใช้ validation จาก schema
      }
    );

    if (!updatedProvider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedProvider
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
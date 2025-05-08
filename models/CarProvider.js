const mongoose = require('mongoose');

const CarProviderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add car provider name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Car provider name can\'t more than 50 characters']
  },
  address: {
    type: String,
    required: [true, 'Please add car provider address']
  },
  province: {
    type: String,
    required: [true, 'Please add car provider province'],
    maxlength: [20, 'Province can\'t more than 20 characters']
  },
  tel: {
    type: String,
    required: [true, 'Please add car provider phone number'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});


//  virtual populate: cars จะไม่อยู่จริงใน MongoDB แต่จะถูกโหลดอัตโนมัติเมื่อ .populate() ถูกใช้
CarProviderSchema.virtual('cars', {
  ref: 'Car',
  localField: '_id',
  foreignField: 'provider',
  justOne: false
});


module.exports = mongoose.model('CarProvider', CarProviderSchema);
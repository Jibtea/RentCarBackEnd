const mongoose = require('mongoose');

const connectDB = async () => {
  //strict query ซึ่งช่วยป้องกันการ query field ที่ไม่ได้ระบุไว้ใน schema
  mongoose.set('strictQuery', true);
  const connect = await mongoose.connect(process.env.MONGO_URI);

  console.log(`MongoDB Connected : ${connect.connection.host}`);
}

module.exports = connectDB;
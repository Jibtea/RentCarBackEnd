const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const { xss } = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');



//load env
dotenv.config({ path: './config/config.env' });

//connect database
connectDB();

//routes file
const carProviders = require('./routes/carProviders');
const cars = require('./routes/cars');
const auths = require('./routes/auths');


//body parser
const app = express();
app.use(express.json());


//Helmet protect xss...
app.use(helmet());

// protect xss
app.use(xss());

// prevent http param pollutions 
app.use(hpp());

//Cross-Origin Resource Sharing ไว้อนุญาตให้ใครดึงapiได้บ้าง
// app.use(cors());
app.use(cors({
  origin: '*',
  credentials: true,
}));

// //fixed bug
// app.use(
//   mongoSanitize({
//     replaceWith: "_removed_", // จะไม่ set req.query ใหม่
//   })
// );

//rate limit
const limiter = rateLimit({
  windowsMs: 10 * 60 * 1000, //10mins
  max: 50
});

app.use(limiter);

//cookie parser
app.use(cookieParser());

app.use('/api/carProviders', carProviders);
app.use('/api/cars', cars);
app.use('/api/auths', auths);


//Sanitize data ป้องกันการใส่queryมาในระบบ
app.use(mongoSanitize());
//แก้แบบเปลี่ยนเป็นstring
// app.use(
//   mongoSanitize({
//     replaceWith: '_removed_' // แทนที่ค่าไม่ปลอดภัยด้วย string แทนการแก้ไข object ตรง ๆ
//   })
// );

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, ' mode on port', PORT));
//handle unhandle promise rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  //close server & exit process
  server.close(() => process.exit(1));
})


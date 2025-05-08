const User = require('../models/User');
const Car = require('../models/Car');
const CarProvider = require('../models/CarProvider');

//func send token
const sendTokenResponse = (user, statuscode, res) => {
  //Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statuscode).cookie('token', token, options).json({
    success: true,
    token
  });
}

exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user
  });
}

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    //create User
    const user = await User.create({
      name,
      email,
      password,
      role
    });

    //create token
    // const token = user.getSignedJwtToken();
    // res.status(200).json({
    //   success: true,
    //   data: user,
    //   token: token
    // });

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }

}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
    }

    //check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'invalid credentials'
      });
    }

    //Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'invalid credentials'
      });
    }

    //Create token
    // const token = user.getSignedJwtToken();
    // res.status(200).json({ success: true, token });

    sendTokenResponse(user, 200, res);
  }
  catch (err) {
    res.status(401).json({
      success: false,
      message: 'cannot convert email or password to string'
    });
  }
};

exports.deleteuser = async (req, res, next) => {
  if (!req.user || !req.user._id) {
    return res.status(404).json({
      success: false,
      message: "User not found or not authenticated"
    });
  }

  const userId = req.user._id;

  try {
    // ค้นหา car providers ที่ user คนนี้เป็นเจ้าของ
    const providers = await CarProvider.find({ owner: userId });

    // ดึง ID ของ providers เพื่อนำไปลบรถที่เกี่ยวข้อง
    const providerIds = providers.map(p => p._id);

    // ลบรถทั้งหมดที่เชื่อมกับ provider เหล่านี้
    await Car.deleteMany({ provider: { $in: providerIds } });

    // ลบ car providers ที่ user เป็นเจ้าของ
    await CarProvider.deleteMany({ owner: userId });

    // ลบ user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "Deleted user and all related data successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


//update
exports.updateUser = async (req, res, next) => {
  if (!req.user || !req.user._id) {
    return res.status(404).json({
      success: false,
      message: "User not found or not authenticated"
    });
  }
  try {
    const userId = req.user._id;

    delete req.body.email;
    delete req.body.role;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedUser) {
      return res.status(400).json({
        success: false,
        message: 'Can\'t update user'
      });
    }
    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }


};


//logout
exports.logout = async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: "logout complete"
  });
}
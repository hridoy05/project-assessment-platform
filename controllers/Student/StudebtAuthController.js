const Student = require("../../models/Student");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../../errors");
const jwt = require("jsonwebtoken");

/**
 * Register Controller
 * It creates a new admin in the database
 * @param req - The request object. This contains information about the HTTP request that raised the
 * event.
 * @param res - The response object.
 */
const register = async (req, res) => {
  const { email, name, password } = req.body;

  const emailAlreadyExists = await Student.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError("Email already exists");
  }

  try {
    const student = await Student.create({
      name,
      email,
      password,
    });

    res.status(StatusCodes.CREATED).json({
      admin: { name: student.name, email: student.email, role: student.userType },
      msg: "Success! new student created",
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};


/**
 * It takes in a admin's email and password, checks if the admin exists, checks if the password is
 * correct, creates a JWT, and sends it back to the admin
 * @param req - The request object. This contains information about the HTTP request that raised the
 * event.
 * @param res - The response object.
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }
  const student = await Student.findOne({ email });

  if (!student) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await student.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  // create jwt

  const accessToken = jwt.sign(
    {
      studentInfo: {
        studentId: student._id,
        studentname: student.name,
        roles: student.userType,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "30min" }
  );

  const refreshToken = jwt.sign(
    { studentname: student.name, studentId: student._id, roles: student.userType },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  student.refreshToken = refreshToken;
  const result = await student.save();


  // Creates Secure Cookie with refresh token
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  // Send authorization roles and access token to admin
  res.json({ accessToken });
};


const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  console.log(cookies);
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  const foundstudent = await student.findOne({ refreshToken }).exec();
  console.log(foundstudent);
  if (!foundstudent) return res.sendStatus(403); //Forbidden 
  // evaluate jwt 
  jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        console.log("foundadmin",err, decoded);
          if (err || foundstudent.name !== decoded.studentname) return res.sendStatus(403);
          const accessToken = jwt.sign(
              {
                studentInfo: {
                  studentId: decoded.studentId,
                  studentname: decoded.studentname,
                  roles: decoded.roles,
                }
              },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: '50min' }
          );
          res.json({accessToken })
      }
  );
}

const logout = async (req, res) => {
  const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    const foundstudent = await Student.findOne({ refreshToken }).exec();
    if (!foundstudent) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }

    // Delete refreshToken in db
    foundstudent.refreshToken = '';
    const result = await foundstudent.save();
    console.log(result);

    res.clearCookie('jwt', { httpOnly: true });
    res.sendStatus(204).json({msg:"logout"});
};

module.exports = {
  register,
  login,
  logout,
  handleRefreshToken
};

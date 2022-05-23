const Mentor = require("../../models/Mentor");
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

  const emailAlreadyExists = await Mentor.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError("Email already exists");
  }

  try {
    const mentor = await Mentor.create({
      name,
      email,
      password,
    });

    res.status(StatusCodes.CREATED).json({
      mentor: { name: mentor.name, email: mentor.email, role: mentor.userType },
      msg: "Success! new mentor created",
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
  const mentor = await Mentor.findOne({ email });

  if (!mentor) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await mentor.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  // create jwt

  const accessToken = jwt.sign(
    {
      mentorInfo: {
        mentorId: mentor._id,
        mentorname: mentor.name,
        roles: mentor.userType,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "30min" }
  );

  const refreshToken = jwt.sign(
    { mentorname: mentor.name, mentorId: mentor._id, roles: mentor.userType },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  mentor.refreshToken = refreshToken;
  const result = await mentor.save();


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

  const foundMentor = await Mentor.findOne({ refreshToken }).exec();
  console.log(foundMentor);
  if (!foundMentor) return res.sendStatus(403); //Forbidden 
  // evaluate jwt 
  jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        console.log("foundadmin",err, decoded);
          if (err || foundMentor.name !== decoded.mentorname) return res.sendStatus(403);
          const accessToken = jwt.sign(
              {
                mentorInfo: {
                  mentorId: decoded.mentorId,
                  mentorname: decoded.mentorname,
                  roles: decoded.roles,
                }
              },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: '30min' }
          );
          res.json({ accessToken })
      }
  );
}

const logout = async (req, res) => {
  const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    const foundMentor = await Mentor.findOne({ refreshToken }).exec();
    if (!foundMentor) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }

    // Delete refreshToken in db
    foundMentor.refreshToken = '';
    const result = await foundMentor.save();
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

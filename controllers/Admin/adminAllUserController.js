const Admin = require("../../models/Admin");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../../errors");

/*--------------- manage admin -------------- */

//create user as admin
const createAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  Admin.findOne({ email }).exec((err, admin) => {
    if (admin) {
      return res.status(400).json({
        error: "Email is taken",
      });
    }
  });

  let newAdmin = new Admin({ name, email, password });
  //save in database
  newAdmin.save((err, success) => {
    if (err) {
      console.log("SIGNUP ERROR", err);
      return res.status(400).json({
        error: err,
      });
    }
    res.json({
      message: "admin added successfully",
    });
  });
};

//update admin
const updateAdmin = async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    throw new CustomError.BadRequestError("Please provide all values");
  }
  try {
    //using findOne first find existing admin then update admin
    const admin = await Admin.findOne({ _id: req.admin.adminId });
   
    admin.email = email;
    admin.name = name;

    await admin.save();
    res.status(StatusCodes.OK).json({ data: admin });
  } catch (error) {
    res.status(StatusCodes.FORBIDDEN).json({ msg: "error in update" });
  }
};

//delete admin
const deleteAdmin = async (req, res) => {
  const admin = await Admin.findByIdAndDelete({ _id: req.admin.adminId });
  if (!admin) {
    throw new CustomError.NotFoundError(`No user with id : ${req.admin.adminId}`);
  }
  res.status(StatusCodes.OK).json({ user: null, status: "successfull" });
};


/* --------------Manage mentor -------------*/

//create user as mentor
const createMentor = async (req, res) => {
  const { name, email, password } = req.body;
  Mentor.findOne({ email }).exec((err, mentor) => {
    if (mentor) {
      return res.status(400).json({
        error: "Email is taken",
      });
    }
  });

  let newMentor = new Mentor({ name, email, password });

  newMentor.save((err, success) => {
    if (err) {
      console.log("SIGNUP ERROR", err);
      return res.status(400).json({
        error: err,
      });
    }
    res.json({
      message: "admin added successfully",
    });
  });
};

//update mentor by admin
const updateMentor = async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    throw new CustomError.BadRequestError("Please provide all values");
  }
  const mentor = await Mentor.findOne({ _id: req.mentor.mentorId });

  mentor.email = email;
  mentor.name = name;

  await mentor.save();
  res.status(StatusCodes.OK).json({ mentor });
};

//delete mentor by admin
const deleteMentor = async (req, res) => {
  const mentor = await Mentor.findByIdAndDelete({ _id: req.mentor.mentorId });
  if (!mentor) {
    throw new CustomError.NotFoundError(
      `No user with id : ${req.mentor.mentorId}`
    );
  }
  res.status(StatusCodes.OK).json({ user: null, status: "successfull" });
};

/*--------------manage student---------------------*/

//create student by admin
const createStudent = async (req, res) => {
  const { name, email, password } = req.body;
  Student.findOne({ email }).exec((err, student) => {
    if (student) {
      return res.status(400).json({
        error: "Email is taken",
      });
    }
  });

  let newStudent = new Student({ name, email, password });

  newStudent.save((err, success) => {
    if (err) {
      console.log("SIGNUP ERROR", err);
      return res.status(400).json({
        error: err,
      });
    }
    res.json({
      message: "student added successfully",
    });
  });
};

//update student by admin
const updateStudent = async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    throw new CustomError.BadRequestError("Please provide all values");
  }
  const student = await Student.findOne({ _id: req.student.studentId });

  student.email = email;
  student.name = name;
  await student.save();
  res.status(StatusCodes.OK).json({ student });
};

//delete student by admin
const deleteStudent = async (req, res)=> {
  const student = await Student.findByIdAndDelete({_id: req.student.studentId})
  if(!student){
    throw new CustomError.NotFoundError(`No user with id : ${req.student.studentId}`);
  }
  res.status(StatusCodes.OK).json({user: null, status: "successfull"})

}




module.exports = {
  updateAdmin,
  deleteAdmin,
  createAdmin,
  createMentor,
  updateMentor,
  deleteMentor,
  createStudent,
  updateStudent,
  deleteStudent,
};

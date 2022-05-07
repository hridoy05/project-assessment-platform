const Admin = require("../../models/Admin");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../../errors");

/*--------------- manage admin -------------- */
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

const updateAdmin = async (req, res) => {
  console.log(req);
  const { email, name } = req.body;
  if (!email || !name) {
    throw new CustomError.BadRequestError("Please provide all values");
  }
  try {
    const admin = await Admin.findOne({ _id: req.admin.adminId });
    console.log(admin);

    admin.email = email;
    admin.name = name;

    await admin.save();
    res.status(StatusCodes.OK).json({ data: admin });
  } catch (error) {
    res.status(StatusCodes.FORBIDDEN).json({ msg: "error in update" });
  }
};

const deleteAdmin = async (req, res) => {
  const admin = await Admin.findByIdAndDelete({ _id: req.admin.adminId });
  if (!admin) {
    throw new CustomError.NotFoundError(`No user with id : ${req.admin.adminId}`);
  }
  res.status(StatusCodes.OK).json({ user: null, status: "successfull" });
};

/* --------------Manage mentor -------------*/
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

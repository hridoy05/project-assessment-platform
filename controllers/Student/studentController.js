const Student = require("../../models/Student");
const Submission = require("../../models/Submission");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../../errors");
const Assessment = require("../../models/Assessment");
const formidable = require("formidable");
const fs = require("fs");


//file valid check
const isFileValid = (file) => {
  const type = file.type.split("/").pop();
  const validTypes = ["pdf"];
  if (validTypes.indexOf(type) === -1) {
    return false;
  }
  return true;
};
/*------------- assessment submission ------------ */
const addSubmission = async (req, res) => {

  const assessmentId = req.params.id;
  //basic setup
  const form = formidable.IncomingForm();
  const uploadFolder = path.join(__dirname, "public", "files");

  //basic configuaration
  form.multiples = true;
  form.maxFileSize = 50 * 1024 * 1024; // 5MB
  form.uploadDir = uploadFolder;

  //parsing
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.log("Error parsing the files");
      return res.status(400).json({
        status: "Fail",
        message: "There was an error parsing the files",
        error: err,
      });
    }
    if (!files.myFile.length) {
      //Single file

      const file = files.myFile;

      // checks if the file is valid
      const isValid = isFileValid(file);

      // creates a valid name by removing spaces
      const fileName = encodeURIComponent(file.name.replace(/\s/g, "-"));

      if (!isValid) {
        // throes error if file isn't valid
        return res.status(400).json({
          status: "Fail",
          message: "The file type is not a valid type",
        });
      }
      try {
        // renames the file in the directory
        fs.renameSync(file.path, join(uploadFolder, fileName));
      } catch (error) {
        console.log(error);
      }

      try {
        // stores the fileName in the database
        let newSubmission = new Submission({
          ...req.body,
          pdf: `files/${fileName}`,
          student: req.studentInfo.studentId,
          assessment: assessmentId,
        });
      
        
          const submission = await newSubmission.save();
          await Student.updateOne(
            { _id: req.studentInfo.studentId },
            {
              $push: {
                submission: submission._id,
              },
            }
          );
          await Assessment.updateOne(
            { _id: assessmentId },
            {
              $push: {
                submission: submission._id,
              },
            }
          );
          res.status(201).json({
            message: "subssion added successfully",
          });
      } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({
          error,
        });
      }
    }
  });

  
};
const getSubmissions = async (req, res) => {
  const assessmentId = req.params.id;

  try {
    const submissions = await Submission.find({
      assessment: assessmentId,
      student: req.studentInfo.studentId,
    });
    res.status(200).json({
      message: "subssions get successfully",
      submissions,
    });
  } catch (error) {
    res.status(500).json({ error: "There was a error" });
  }
};
module.exports = {
  addSubmission,
  getSubmissions,
};

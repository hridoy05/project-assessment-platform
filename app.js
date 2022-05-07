require('dotenv').config();
require('express-async-errors');
// express

const express = require('express');
const app = express();
// rest of the packages
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');

// database
const connectDB = require('./db/connect');

//  routers import
const adminAuthRouter = require('./routes/adminRoutes/adminAuthRoutes');
const adminRouter = require('./routes/adminRoutes/adminRoutes');
const mentorAuthRouter = require('./routes/mentorRoutes/mentorAuthRoutes');
const mentorRouter = require('./routes/mentorRoutes/mentorRoutes');
const studentAuthRouter = require('./routes/studentRoutes/studentAuthRoutes');
const studentRouter = require('./routes/studentRoutes/studentRoutes');



// middleware import
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

app.use(express.json());
app.use(cookieParser());

/*---------- admin route ------------*/
app.use('/api/v1/adminAuth', adminAuthRouter);
app.use('/api/v1/admin', adminRouter);

/*---------- mentor route ------------*/
app.use('/api/v1/mentorAuth', mentorAuthRouter);
app.use('/api/v1/mentor', mentorRouter);

/*---------- student route ------------*/
app.use('/api/v1/studentAuth', studentAuthRouter);
app.use('/api/v1/student', studentRouter);

/*---------- error middleware ------------*/
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


/*---------- server set up ------------*/
const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();


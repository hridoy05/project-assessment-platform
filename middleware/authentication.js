const jwt = require('jsonwebtoken');


/**
 * It checks if the request has a valid token, and if it does, it adds the user's information to the
 * request object
 * @param req - The request object.
 * @param res - the response object
 * @param next - a callback function that will be called when the middleware is done.
 * @returns - If the token is invalid, the server will return a 403 status code.
 *     - If the token is valid, the server will return the decoded token.
 */
const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
           
            if (err) return res.sendStatus(403); //invalid token
            req.admin = decoded.adminInfo
            req.roles = decoded.adminInfo.roles;
            next();
        }
    );
}

const authenticateMentor = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            console.log(err, decoded, "authenticate");
            if (err) return res.sendStatus(403); //invalid token
            req.mentor = decoded.mentorInfo
            req.roles = decoded.mentorInfo.roles;
            next();
        }
    );
}
const authenticatestudent = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403); //invalid token
            req.student = decoded.studentInfo
            req.roles = decoded.studentInfo.roles;
            next();
        }
    );
}


module.exports = {
  authenticateAdmin,authenticateMentor, authenticatestudent
};

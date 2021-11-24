const User = require("../models/User");
const jwt = require("jsonwebtoken");

const isAuth = async (req, res, next) => {
  try {

    // import the token from the headers of the req with the key: "authorization":
    const token = req.headers["authorization"];
    // console.log(token)

    // if there's no token (no key => user not authorized):
    if (!token) {
      return res
        .status(401)
        .send({ errors: [{ msg: "you are not authorized" }] });
    }
    
    // if there's token we should verify its validity:
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // test if the user exist with that id (token is an object that contains the id in it):
    const user = await User.findOne({ _id: decoded.id }).select("-password");

    // if no => you are not authorised
    if (!user) {
      return res
        .status(401)
        .send({ errors: [{ msg: "you are not authorized" }] });
    }

    //else we get that user we've just found:
    req.user = user;

    // next
    next();
    
  } catch (error) {
    res.status(401).send({ errors: [{ msg: "you are not authorized" }] });
  }
};

module.exports = isAuth;

const express = require("express");
const multer = require("multer");
const { Register, Login } = require("../controllers/user.controllers");
const isAuth = require("../middleware/Auth");
const {
  registerValidate,
  validation,
  loginValidate,
} = require("../middleware/UserValidation");
const User = require("../models/User");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./client/public/profile/");
  },
  filename: (req, file, callback) => {
    callback(null, "-" + Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

// register
router.post("/register", registerValidate(), validation, Register);

// login
router.post("/login", loginValidate(), validation, Login);

// authentification router :
router.get("/current", isAuth, (req, res) => {
  res.send({ msg: "authorized", user: req.user });
});

//get user by id:
router.get("/:_id", isAuth, async (req, res) => {
  try {
    const { _id } = req.params;
    const user = await User.findById(_id);
    res.send({ msg: "user found user", user });
  } catch (error) {
    res.status(400).send({ msg: "user not found", error });
  }
});

//consult all users //only admin:
//isAdmin middleware NEED to be CREATED

router.get("/", isAuth, async (req, res) => {
  try {
    const users = await User.find();
    res.send({ msg: "users  found succ", users });
  } catch (error) {
    res.status(400).send({ msg: "users not found", error });
  }
});

//edit user:
router.put("/:_id", isAuth, upload.single("image"), async (req, res) => {
  try {
    const { _id } = req.params;
    await User.findByIdAndUpdate(
      { _id },
      { $set: { ...req.body, image: req.file.filename } }
    );
    res.send({ msg: "user updated succ " });
  } catch (error) {
    res.status(400).send({ msg: "user can not be updated", error });
  }
});

//delete user:
router.delete("/:_id", isAuth, async (req, res) => {
  try {
    const { _id } = req.params;
    const user = await User.findById(_id);
    const deletedUser = await user.remove();
    res.send({ msg: "user deleted succ ", deletedUser });
  } catch (error) {
    res.status(400).send({ msg: "user can not be deleted", error });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const multer = require("../middlewares/multer");
var fetchuser = require("../middleware/fetchuser");
// jet secret key

const JWT_SECRET = "harshilprajapati9192@gmail.com";

// ROUTE 1: Create a User using : POST "api/auth/createuser" , No login required
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 2 }),
    body("email", "Enter a valid email").isEmail(),

    // password must be at least 5 chars long
    body("password", "Enter must be atleast 5 characters").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;

    // If there ate error then return the bad request and error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
      // check whether the user with same email exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          success,
          errors: "sorry a user with this email already exsits",
        });
      }
      // hashing a password
      const salt = bcrypt.genSaltSync(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        mobileNo: req.body.mobileNo,
        password: secPass,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      console.log(success);
      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

//ROUTE 2  : login a User using : POST "api/auth/login" , No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    // password must be at least 5 chars long
    body("password", "Password can not be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    // If there ate error then return the bad request and error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res
          .status(400)
          .json({ errors: "Please try to login with correct credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res.status(400).json({
          success,
          errors: "Please try to login with correct credentials",
        });
      }
      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

// ROUTE 3 : Get loggedin User Details using : POST "/api/auth/getuser" Login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;

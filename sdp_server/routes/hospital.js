const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");
const Hospital = require("../models/Hospital");
const { isValidObjectId } = require("mongoose");
// jet secret key
const JWT_SECRET = "harshilprajapati9192@gmail.com";

router.post(
  "/create",
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
      let hospital = await Hospital.findOne({ email: req.body.email });
      if (hospital) {
        return res.status(400).json({
          success,
          errors: "sorry a hospital with this email already exsits",
        });
      }
      // hashing a password
      const salt = bcrypt.genSaltSync(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      hospital = await Hospital.create({
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        // licence: req.body.licence,
        password: secPass,
      });

      const data = {
        hospital: {
          id: hospital.id,
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

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
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
      let hospital = await Hospital.findOne({ email });
      if (!hospital) {
        success = false;
        return res
          .status(400)
          .json({ errors: "Please try to login with correct credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, hospital.password);
      if (!passwordCompare) {
        success = false;
        return res.status(400).json({
          success,
          errors: "Please try to login with correct credentials",
        });
      }
      const data = {
        hospital: {
          id: hospital.id,
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

router.post("/getHospital", fetchuser, async (req, res) => {
  try {
    let hospitalId = req.hospital.id;
    const hospital = await Hospital.findById(hospitalId).select("-password");
    res.send(hospital);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

router.get("/getAllPendingList", async (req, res) => {
  try {
    const hospital = await Hospital.find({ approved: false });
    console.log(hospital);
    res.send(hospital);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

router.get("/getAllApprovedList", async (req, res) => {
  try {
    const hospital = await Hospital.find({ approved: true });
    res.send(hospital);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

router.put("/updateStatus/:id", async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(401).json({ error: "Invalid Request" });
    }
    // Find the note to be updated and update it
    let hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).send("Hospital Not Found");
    }
    hospital.approved = true;

    await hospital.save();

    res.json({ hospital: hospital });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error\n" + error.message);
  }
});

router.delete("/deleteHospital/:id", async (req, res) => {
  try {
    const prmId = req.params.id;
    if (!isValidObjectId(prmId))
      return res.status(401).json({ error: "Invalid Request" });

    let hospital = await Hospital.findById(prmId);

    if (!hospital) {
      return res.status(404).send("Hospital Not Found!");
    }

    hospital = await Hospital.findByIdAndDelete(prmId);
    res.json({ Success: "Hospital has been deleted", hospital: hospital });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;

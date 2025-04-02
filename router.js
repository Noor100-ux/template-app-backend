const express = require("express");
const { register, login, sendtomail } = require("./controller");
const router = express.Router();
const multer = require("multer");

require("dotenv").config();

router.post('/register',register)
router.post('/login',login)

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post("/sendemail", upload.single("file"),sendtomail );

module.exports=router
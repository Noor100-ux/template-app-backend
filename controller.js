const { createTenantDatabase } = require("./common");
const { User } = require("./model/user");
const nodemailer = require("nodemailer");

require("dotenv").config();
const register = async (req, res) => {
    try {
      const {
       
        email,
       password,
       
      } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "Existing user" });
      }
  
      const user={
        email,
        password,
        
      }
  
    const response=await createTenantDatabase(user)
    console.log(response)
    const newUser = new User({
        
        email,
        password,
        dbUri:response
        
      });
    await newUser.save();

      return res
        .status(200)
        .json({ success: true, message: "User registered successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  };
  const login = async (req, res) => {
    try {
      const {
       
        email,
       password,
       
      } = req.body;

      const existingUser = await User.findOne({ email });
      
     if(existingUser?.password !=password){
      return res.status(400).json({message:"Invalid password and email" });
     }
  
    
      return res
        .status(200)
        .json({ success: true, message: "User login successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  };
const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },
});

  const sendtomail=async (req, res) => {
    try {
      const { email } = req.body; 
      if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
      }
      if (!req.file) {
        return res.status(400).json({ success: false, message: "File is required" });
      }
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "File Attachment",
        text: "Please find the attached file.",
        attachments: [
          {
            filename: req.file.originalname,
            content: req.file.buffer,
          },
        ],
      };
  
      await transporter.sendMail(mailOptions);
  
      res.json({ success: true, message: "Email sent successfully with attachment" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  }


  module.exports={
    register,
    login,
    sendtomail
  }
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {

    email: {
      type: String,
      required: true,
    },
    password:{
      type: String,
      required: true,
    },
    dbUri:{
        type: String,
    }
 },
  {
    timestamps: true,
  }
);


const User = mongoose.model("User", UserSchema);
const TemplatesSchema = new mongoose.Schema(
    {
  
      email: {
        type: String,
        required: true,
      },
      password:{
        type: String,
        required: true,
      },
      dbUri:{
          type: String,
      }
   },
    {
      timestamps: true,
    }
  );
  
  
  const Template = mongoose.model("Template", TemplatesSchema);

module.exports = {
                  User,
                  Template
                  
}

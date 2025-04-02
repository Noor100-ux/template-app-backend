const { default: mongoose } = require("mongoose");
const { Template } = require("./model/user");

async function createTenantDatabase(user) {
    const email = user.email;
    const username = email.split("@")[0];
    const tenantDbName = `${username}_db`;
    console.log(tenantDbName);
    const tenantDbUri = `mongodb+srv://noormohamed100108:9ld4sXSrOZGxYPji@cluster0.yiqiz.mongodb.net/${tenantDbName}?retryWrites=true&w=majority&appName=Cluster0`;
  
    try {
      console.log("entry");
      const tenantConnection = mongoose.createConnection(tenantDbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
  
      tenantConnection.model("Template", Template.schema);
    
      console.log(
        `Tenant database created for user ${email} with db name ${tenantDbName}`
      );
  
      return tenantDbUri
    } catch (error) {
      throw new Error(`Error creating tenant database: ${error.message}`);
    }
  }

  module.exports={
    createTenantDatabase
  }
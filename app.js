const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var cors = require("cors");
const PORT = process.env.PORT || 5055;
const { createServer } = require("http");
const { User, Template } = require("./model/user");
const { default: mongoose } = require("mongoose");
const Router = require('./router.js');

// Function to sanitize database names
function sanitizeDatabaseName(name) {
  return name.replace(/\./g, '_');
}

const connectDB = async () => {
  if (mongoose.connection.readyState !== 1) {
    console.log("Connecting to primary MongoDB...");
    await mongoose.connect("mongodb+srv://noormohamed100108:9ld4sXSrOZGxYPji@cluster0.yiqiz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
      socketTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      serverSelectionTimeoutMS: 10000,
    });
    console.log("Connected to primary MongoDB successfully");
  } else {
    console.log("Using existing MongoDB connection");
  }

  try {
    const merchants = await User.find({});
    await Promise.all(
      merchants.map(async (merchant) => {
        if (merchant.dbUri) {
          try {
            // Modify the URI to use sanitized database name
            const email = merchant.email;
            const username = email.split("@")[0];
            const sanitizedUsername = sanitizeDatabaseName(username);
            const tenantDbName = `${sanitizedUsername}_db`;
            
            // Create a new URI with the sanitized database name
            // Extract the base part of the URI (up to the database name)
            const baseUri = "mongodb+srv://noormohamed100108:9ld4sXSrOZGxYPji@cluster0.yiqiz.mongodb.net/";
            const sanitizedUri = `${baseUri}${tenantDbName}?retryWrites=true&w=majority&appName=Cluster0`;
            
            // Connect using the sanitized URI, not the stored one
            tenantConnections[merchant._id] = await mongoose.createConnection(
              sanitizedUri,
              {
                socketTimeoutMS: 30000,
                connectTimeoutMS: 30000,
              }
            );
            
            console.log(`Connected to tenant DB: ${username}`);
            
            // Update the merchant's dbUri in the database with the sanitized version
            // This ensures future connections use the correct format
            await User.findByIdAndUpdate(merchant._id, { dbUri: sanitizedUri });
          } catch (err) {
            console.error(`Error connecting to tenant DB for ${merchant.email}:`, err);
          }
        }
      })
    );
  } catch (err) {
    console.error("Error connecting to tenant databases:", err);
  }
};

let tenantConnections = {};

connectDB();
const server = createServer(app);
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/', Router);
app.get("/", (req, res) => {
  res.send("server up!");
});
app.use(bodyParser.json());
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

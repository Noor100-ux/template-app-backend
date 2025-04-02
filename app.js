const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var cors = require("cors");
const PORT = process.env.PORT || 5055;
const { createServer } = require("http");
const { User,Template } = require("./model/user");
const { default: mongoose } = require("mongoose");
const Router=require('./router.js')

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
          if (merchant.dbUri && !tenantConnections[merchant._id]) {
            tenantConnections[merchant._id] = await mongoose.createConnection(
              merchant.dbUri,
              {
                socketTimeoutMS: 30000,
                connectTimeoutMS: 30000,
              }
            );
            const email = merchant.email;
    const username = email.split("@")[0];
            console.log(`Connected to tenant DB: ${username}`);
          }
        })
      );
    } catch (err) {
      console.error("Error connecting to tenant databases:", err);
    }
  };
  
  let tenantConnections = {};
  

connectDB()
const server = createServer(app);

app.use(cors({ origin: '*' }));
app.use(express.json());


app.use('/',Router)



app.get("/", (req, res) => {
  res.send("server up!");
});

app.use(bodyParser.json());
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

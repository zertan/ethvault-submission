const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const app = express();

// config
require('dotenv').config();
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

const user = require('./routes/userRoute');
const product = require('./routes/productRoute');
const order = require('./routes/orderRoute');
const payment = require('./routes/paymentRoute');
const deth = require('./routes/dETHRoute');
const seth = require("./routes/stakedEthRoute");
const dashboard = require("./routes/stakingDashboardRoute");
const governance = require("./routes/governanceRoute");

app.use('/api/user', user);
app.use('/api/product', product);
app.use('/api/order', order);
app.use('/api/payment', payment);
app.use('/api/deth', deth);
app.use("/api/seth", seth);
app.use("/api/dashboard", dashboard);
app.use("/api/governance", governance);

// deployment
__dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Server is Running! 🚀");
  });
}

module.exports = app;

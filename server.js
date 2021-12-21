const express = require("express");
const path = require("path");
const connectDB = require("./config/connectDB");

require("dotenv").config();

const app = express();
connectDB();

app.use(express.json());
app.use("/api/user", require("./router/user"));
app.use("/api/food", require("./router/food"));
app.use("/api/order", require("./router/order"));
app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});
// **********************************
if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
} else {
  require("dotenv").config();
}

const PORT = process.env.PORT || 7777;

app.listen(PORT, (err) => {
  !err ? console.log(`server is runnig on port ${PORT}`) : console.error(err);
});

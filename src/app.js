const express = require("express");
const cors = require("cors");
const router = require("./app/routes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://rswa-web-app.web.app",
  "https://rswaa.vercel.app",
  "https://rrswa.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

// Application routes
app.use("/", router);

app.get("/", (req, res) => {
  res.send("RSWA server is running");
});

module.exports = app;

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

/* MIDDLEWARE */
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true }));

/* ROUTES */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/seller", require("./routes/sellerRoutes"));

/* TEST */
app.get("/", (req, res) => {
  res.send("Gramika DB API Running");
});

/* SERVER */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

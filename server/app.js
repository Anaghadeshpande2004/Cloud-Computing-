// app.js

const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const userToken = require("./routes/userTokenRoute");

const app = express();

// Middleware
app.use(cors({
  origin: "*", // For development, allow all origins. In production, specify your Vercel URL.
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/token", userToken);

// Server
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

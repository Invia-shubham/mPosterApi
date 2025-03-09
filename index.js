const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swaggerConfig");
const UserMasterRoute = require("./src/routes/UserMasterRoute");

const app = express();
app.use(express.json());


// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://new-user-31:BVjbKBhcu8puOKC3@cluster19986.4ktj0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster19986"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Use API Routes
app.use("/api", UserMasterRoute);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Serve Swagger Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Imports
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Routing
const weatherRoutes = require("./routes/weatherRoutes");

// Add utilities
const errorHandler = require("./utils/errorHandler");
const logger = require("./utils/logger");
const config = require("./config");

// Init express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.use("/api", weatherRoutes);

// Health check
app.get("/health", (req, res) => {
	res.json({ 
        status: "OK", 
        timestamp: new Date().toISOString() 
    });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
	logger.info(`Weather app running on port ${config.port}`);
});

// Exports modules to app
module.exports = app;
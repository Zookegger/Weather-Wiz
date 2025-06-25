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
const { slugify } = require('transliteration');

// Init express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../node_modules")));
app.use(express.static(path.join(__dirname, "../public")));
app.use((req, res, next) => {
    if (req.url) {
        // Split the URL into path and query string
        const [path, querystring] = req.url.split('?');

        // Step 1: Decode URL encoded input
        let sanitizedPath = decodeURIComponent(path);

        // Step 2: Normalize URL
        sanitizedPath = sanitizedPath.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        // Step 3: Sanitize URL
        sanitizedPath = slugify(sanitizedPath, { 
            lowercase: false, 
            separator: '%20',
            allowedChars: 'a-zA-Z0-9-._~!$&\'()*+,;=:@/'
        });

        // Reconstruct the URL with the original query string
        req.url = querystring ? `${sanitizedPath}?${querystring}` : sanitizedPath;

    } 
    next();
});

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
if (require.main === module) { // Only start the server if this file is run directly
    app.listen(config.port, () => {
        logger.info(`Weather app running on port ${config.port}`);
    });
}
    
// Exports modules to app
module.exports = app;
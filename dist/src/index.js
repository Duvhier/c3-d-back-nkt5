"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
const data_sources_1 = require("./data-sources");
const cors_1 = __importDefault(require("cors"));
const bookRoutes_1 = __importDefault(require("./routes/bookRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/books", bookRoutes_1.default);
data_sources_1.AppDataSource.initialize().then(() => {
    if (process.env.VERCEL === "1") {
        // No hacer nada, Vercel maneja el serverless handler
    }
    else {
        app.listen(3000, '0.0.0.0', () => {
            console.log("🚀 Server running on http://localhost:3000");
        });
    }
});
exports.default = app;

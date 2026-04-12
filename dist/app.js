"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = require("./routes");
const notFound_middleware_1 = require("./middlewares/notFound.middleware");
const globalErrorHandler_1 = __importDefault(require("./app/errors/globalErrorHandler"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.APP_URL,
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.get("/", (_, res) => {
    res.json({ status: "OK", message: "MediStore API running" });
});
app.use("/api", routes_1.indexRoute);
//* Not found handler
app.use(notFound_middleware_1.notFound);
//* Global error handler
app.use(globalErrorHandler_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map
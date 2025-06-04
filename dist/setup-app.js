"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupApp = void 0;
const express_1 = __importDefault(require("express"));
const videos_router_1 = require("./videos/routers/videos.router");
const testing_router_1 = require("./testing/routers/testing.router");
const setup_swagger_1 = require("./core/swagger/setup-swagger");
const setupApp = (app) => {
    app.use(express_1.default.json());
    app.get('/', (req, res) => {
        res.status(200).send('Heyy Alex Bitau!!!');
    });
    app.use('/api/videos', videos_router_1.videosRouter);
    app.use('/api/testing', testing_router_1.testingRouter);
    (0, setup_swagger_1.setupSwagger)(app);
    return app;
};
exports.setupApp = setupApp;

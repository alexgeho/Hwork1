"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingRouter = void 0;
const express_1 = require("express");
const in_memory_db_1 = require("../../db/in-memory.db");
const http_statuses_1 = require("../../core/types/http-statuses");
exports.testingRouter = (0, express_1.Router)({});
exports.testingRouter.delete('/all-data', (req, res) => {
    in_memory_db_1.db.videos = [];
    res.sendStatus(http_statuses_1.HttpStatus.NoContent);
});

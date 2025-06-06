"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosRouter = void 0;
const express_1 = require("express");
const videoInputDtoValidation_1 = require("../validation/videoInputDtoValidation");
const http_statuses_1 = require("../../core/types/http-statuses");
const error_utils_1 = require("../../core/utils/error.utils");
const in_memory_db_1 = require("../../db/in-memory.db");
exports.videosRouter = (0, express_1.Router)({});
exports.videosRouter
    .get('', (req, res) => {
    res.status(200).send(in_memory_db_1.db.videos);
})
    .get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const video = in_memory_db_1.db.videos.find((d) => d.id === id);
    if (!video) {
        res
            .status(http_statuses_1.HttpStatus.NotFound)
            .send((0, error_utils_1.createErrorMessages)([{ field: 'id', message: 'video not found' }]));
        return;
    }
    res.status(200).send(video);
})
    .post('', (req, res) => {
    var _a, _b, _c;
    const errors = (0, videoInputDtoValidation_1.videoInputDtoValidation)(req.body);
    if (errors.length > 0) {
        res.status(http_statuses_1.HttpStatus.BadRequest).send((0, error_utils_1.createErrorMessages)(errors));
        return;
    }
    const createdAtDate = new Date();
    const publicationDate = req.body.publicationDate && req.body.publicationDate.trim()
        ? new Date(req.body.publicationDate)
        : new Date(createdAtDate.getTime() + 24 * 60 * 60 * 1000);
    const newVideo = {
        id: in_memory_db_1.db.videos.length ? in_memory_db_1.db.videos[in_memory_db_1.db.videos.length - 1].id + 1 : 1,
        title: req.body.title,
        author: req.body.author,
        canBeDownloaded: (_a = req.body.canBeDownloaded) !== null && _a !== void 0 ? _a : false,
        minAgeRestriction: (_b = req.body.minAgeRestriction) !== null && _b !== void 0 ? _b : null,
        createdAt: createdAtDate.toISOString(),
        publicationDate: publicationDate.toISOString(),
        availableResolutions: (_c = req.body.availableResolutions) !== null && _c !== void 0 ? _c : [],
    };
    in_memory_db_1.db.videos.push(newVideo);
    res.status(http_statuses_1.HttpStatus.Created).send(newVideo);
})
    .put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = in_memory_db_1.db.videos.findIndex((v) => v.id === id);
    if (index === -1) {
        res
            .status(http_statuses_1.HttpStatus.NotFound)
            .send((0, error_utils_1.createErrorMessages)([{ field: 'id', message: 'Video not found' }]));
        return;
    }
    const errors = (0, videoInputDtoValidation_1.videoInputDtoValidation)(req.body);
    if (errors.length > 0) {
        res.status(http_statuses_1.HttpStatus.BadRequest).send((0, error_utils_1.createErrorMessages)(errors));
        return;
    }
    const video = in_memory_db_1.db.videos[index];
    video.id = id;
    video.title = req.body.title;
    video.author = req.body.author;
    video.availableResolutions = req.body.availableResolutions;
    video.canBeDownloaded = req.body.canBeDownloaded;
    video.minAgeRestriction = req.body.minAgeRestriction;
    video.createdAt = req.body.createdAt;
    video.publicationDate = req.body.publicationDate;
    res.sendStatus(http_statuses_1.HttpStatus.NoContent);
})
    .delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = in_memory_db_1.db.videos.findIndex((v) => v.id === id);
    if (index === -1) {
        res
            .status(http_statuses_1.HttpStatus.NotFound)
            .send((0, error_utils_1.createErrorMessages)([{ field: 'id', message: 'Videos not found' }]));
        return;
    }
    in_memory_db_1.db.videos.splice(index, 1);
    res.sendStatus(http_statuses_1.HttpStatus.NoContent);
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoInputDtoValidation = void 0;
const ALLOWED_RESOLUTIONS = [
    'P144',
    'P240',
    'P360',
    'P480',
    'P720',
    'P1080',
    'P1440',
    'P2160',
];
const videoInputDtoValidation = (data) => {
    const errors = [];
    if (!data.title ||
        typeof data.title !== 'string' ||
        data.title.trim().length < 1 ||
        data.title.trim().length > 40) {
        errors.push({
            message: 'Any<String>',
            field: 'title'
        });
    }
    if (!data.author ||
        typeof data.author !== 'string' ||
        data.author.trim().length < 1 ||
        data.author.trim().length > 20) {
        errors.push({
            message: 'Author must be between 1 and 20 characters',
            field: 'author'
        });
    }
    if (data.availableResolutions) {
        if (!Array.isArray(data.availableResolutions)) {
            errors.push({
                field: 'availableResolutions',
                message: 'Must be an array of allowed resolutions',
            });
        }
        else {
            for (const res of data.availableResolutions) {
                if (!ALLOWED_RESOLUTIONS.includes(res)) {
                    errors.push({
                        field: 'availableResolutions',
                        message: `Invalid resolution: ${res}`,
                    });
                    break;
                }
            }
        }
    }
    return errors;
};
exports.videoInputDtoValidation = videoInputDtoValidation;

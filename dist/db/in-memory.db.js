"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.db = {
    videos: [
        {
            id: 1,
            title: 'Example Video',
            author: 'Example Author',
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: new Date().toISOString(),
            publicationDate: new Date().toISOString(),
            availableResolutions: ['P144', 'P240']
        }
    ]
};

import { Request, Response, Router } from 'express';

import { videoInputDtoValidation } from '../validation/videoInputDtoValidation';
import { HttpStatus } from '../../core/types/http-statuses';
import { createErrorMessages } from '../../core/utils/error.utils';
import { Resolution, Video } from '../types/video';
import { db } from '../../db/in-memory.db';

export const videosRouter = Router({});

videosRouter
  .get('', (req: Request, res: Response) => {
    res.status(200).send(db.videos);
  })

  .get('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const video = db.videos.find((d) => d.id === id);

    if (!video) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'video not found' }]),
        );
      return;
    }
    res.status(200).send(video);
  })

  .post('', (req: Request<{}, {}, Video>, res: Response) => {
    const errors = videoInputDtoValidation(req.body);

    if (errors.length > 0) {
      res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
      return;
    }

const createdAt = new Date();
const publicationDate = req.body.publicationDate 
  ? new Date(req.body.publicationDate) 
  : new Date(createdAt.getTime() + 24 * 60 * 60 * 1000); // +1 day in ms

    const newVideo: Video = {
  id: db.videos.length ? db.videos[db.videos.length - 1].id + 1 : 1,
  title: req.body.title,
  author: req.body.author,
  canBeDownloaded: req.body.canBeDownloaded ?? false,
  minAgeRestriction: req.body.minAgeRestriction ?? null,
  createdAt: createdAt.toISOString(),
  publicationDate: publicationDate.toISOString(),
  availableResolutions: req.body.availableResolutions ?? [],
};
    db.videos.push(newVideo);
    res.status(HttpStatus.Created).send(newVideo);
  })

  .put('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const index = db.videos.findIndex((v) => v.id === id);

    if (index === -1) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Video not found' }]),
        );
      return;
    }

    const errors = videoInputDtoValidation(req.body);

    if (errors.length > 0) {
      res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
      return;
    }

    const video = db.videos[index];

    video.id = id;
    video.title = req.body.title;
    video.author = req.body.author;
    video.availableResolutions = req.body.availableResolutions;
    video.canBeDownloaded = req.body.canBeDownloaded;
    video.minAgeRestriction = req.body.minAgeRestriction;
    video.createdAt = req.body.createdAt;
    video.publicationDate = req.body.publicationDate;

    res.sendStatus(HttpStatus.NoContent);
  })

  .delete('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const index = db.videos.findIndex((v) => v.id === id);

    if (index === -1) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Videos not found' }]),
        );
      return;
    }

    db.videos.splice(index, 1);
    res.sendStatus(HttpStatus.NoContent);
  });

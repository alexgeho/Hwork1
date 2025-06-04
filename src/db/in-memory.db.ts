import { Video } from '../videos/types/video';

export const db = {
  videos: <Video[]>[
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

import { Resolution } from '../types/video';

export type videoInputDtoId = {
  title: string;
  author: string;
  availableResolutions: Resolution[];
  canBeDownloaded:	boolean;
  minAgeRestriction: number | null;
  publicationDate: string;

};

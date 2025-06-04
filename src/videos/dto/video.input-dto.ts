import { Resolution } from '../types/video';

export type videoInputDto = {
  title: string;
  author: string;
  availableResolutions: Resolution[];
};

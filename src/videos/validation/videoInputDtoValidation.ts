import { videoInputDto } from '../dto/video.input-dto';
import { Resolution } from '../types/video';
import { ValidationError } from '../types/validationError';


const ALLOWED_RESOLUTIONS: Resolution[] = [
  'P144',
  'P240',
  'P360',
  'P480',
  'P720',
  'P1080',
  'P1440',
  'P2160',
];

export const videoInputDtoValidation = (
  data: videoInputDto,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (
    !data.title ||
    typeof data.title !== 'string' ||
    data.title.trim().length < 1 ||
    data.title.trim().length > 40
  ) {
    errors.push({
      message: 'Any<String>',
      field: 'title'
      
    });
  }

  if (
    !data.author ||
    typeof data.author !== 'string' ||
    data.author.trim().length < 1 ||
    data.author.trim().length > 20
  ) {
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
    } else {
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

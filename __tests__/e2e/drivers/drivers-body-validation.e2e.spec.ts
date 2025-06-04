import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import express from 'express';
import { videoInputDto } from '../../../src/videos/dto/video.input-dto';
import { VehicleFeature } from '../../../src/videos/types/video';
import { HttpStatus } from '../../../src/core/types/http-statuses';

describe('video API body validation check', () => {
  const app = express();
  setupApp(app);

  const correctTestvideoData: videoInputDto = {
    name: 'Valentin',
    phoneNumber: '123-456-7890',
    email: 'valentin@example.com',
    vehicleMake: 'BMW',
    vehicleModel: 'X5',
    vehicleYear: 2021,
    vehicleLicensePlate: 'ABC-123',
    vehicleDescription: 'Some description',
    vehicleFeatures: [VehicleFeature.ChildSeat],
  };

  beforeAll(async () => {
    await request(app)
      .delete('/api/testing/all-data')
      .expect(HttpStatus.NoContent);
  });

  it(`should not create video when incorrect body passed; POST /api/videos'`, async () => {
    const invalidDataSet1 = await request(app)
      .post('/api/videos')
      .send({
        ...correctTestvideoData,
        name: '   ',
        phoneNumber: '    ',
        email: 'invalid email',
        vehicleMake: '',
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorMessages).toHaveLength(4);

    const invalidDataSet2 = await request(app)
      .post('/api/videos')
      .send({
        ...correctTestvideoData,
        phoneNumber: '', // empty string
        vehicleModel: '', // empty string
        vehicleYear: 'year', // incorrect number
        vehicleLicensePlate: '', // empty string
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorMessages).toHaveLength(4);

    const invalidDataSet3 = await request(app)
      .post('/api/videos')
      .send({
        ...correctTestvideoData,
        name: 'A', // too shot
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet3.body.errorMessages).toHaveLength(1);

    // check что никто не создался
    const videoListResponse = await request(app).get('/api/videos');
    expect(videoListResponse.body).toHaveLength(0);
  });

  it('should not update video when incorrect data passed; PUT /api/videos/:id', async () => {
    const {
      body: { id: createdvideoId },
    } = await request(app)
      .post('/api/videos')
      .send({ ...correctTestvideoData })
      .expect(HttpStatus.Created);

    const invalidDataSet1 = await request(app)
      .put(`/api/videos/${createdvideoId}`)
      .send({
        ...correctTestvideoData,
        name: '   ',
        phoneNumber: '    ',
        email: 'invalid email',
        vehicleMake: '',
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorMessages).toHaveLength(4);

    const invalidDataSet2 = await request(app)
      .put(`/api/videos/${createdvideoId}`)
      .send({
        ...correctTestvideoData,
        phoneNumber: '', // empty string
        vehicleModel: '', // empty string
        vehicleYear: 'year', // incorrect number
        vehicleLicensePlate: '', // empty string
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorMessages).toHaveLength(4);

    const invalidDataSet3 = await request(app)
      .put(`/api/videos/${createdvideoId}`)
      .send({
        ...correctTestvideoData,
        name: 'A', //too short
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet3.body.errorMessages).toHaveLength(1);

    const videoResponse = await request(app).get(
      `/api/videos/${createdvideoId}`,
    );

    expect(videoResponse.body).toEqual({
      ...correctTestvideoData,
      id: createdvideoId,
      createdAt: expect.any(String),
    });
  });

  it('should not update video when incorrect features passed; PUT /api/videos/:id', async () => {
    const {
      body: { id: createdvideoId },
    } = await request(app)
      .post('/api/videos')
      .send({ ...correctTestvideoData })
      .expect(HttpStatus.Created);

    await request(app)
      .put(`/api/videos/${createdvideoId}`)
      .send({
        ...correctTestvideoData,
        vehicleFeatures: [
          VehicleFeature.ChildSeat,
          'invalid-feature',
          VehicleFeature.WiFi,
        ],
      })
      .expect(HttpStatus.BadRequest);

    const videoResponse = await request(app).get(
      `/api/videos/${createdvideoId}`,
    );

    expect(videoResponse.body).toEqual({
      ...correctTestvideoData,
      id: createdvideoId,
      createdAt: expect.any(String),
    });
  });
});

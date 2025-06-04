import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { videoInputDto } from '../../../src/videos/dto/video.input-dto';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { VehicleFeature } from '../../../src/videos/types/video';

describe('video API', () => {
  const app = express();
  setupApp(app);

  const testvideoData: videoInputDto = {
    name: 'Valentin',
    phoneNumber: '123-456-7890',
    email: 'valentin@example.com',
    vehicleMake: 'BMW',
    vehicleModel: 'X5',
    vehicleYear: 2021,
    vehicleLicensePlate: 'ABC-123',
    vehicleDescription: null,
    vehicleFeatures: [],
  };

  beforeAll(async () => {
    await request(app)
      .delete('/api/testing/all-data')
      .expect(HttpStatus.NoContent);
  });

  it('should create video; POST /api/videos', async () => {
    const newvideo: videoInputDto = {
      ...testvideoData,
      name: 'Feodor',
    };

    await request(app)
      .post('/api/videos')
      .send(newvideo)
      .expect(HttpStatus.Created);
  });

  it('should return videos list; GET /api/videos', async () => {
    await request(app)
      .post('/api/videos')
      .send({ ...testvideoData, name: 'Another video' })
      .expect(HttpStatus.Created);

    await request(app)
      .post('/api/videos')
      .send({ ...testvideoData, name: 'Another video2' })
      .expect(HttpStatus.Created);

    const videoListResponse = await request(app)
      .get('/api/videos')
      .expect(HttpStatus.Ok);

    expect(videoListResponse.body).toBeInstanceOf(Array);
    expect(videoListResponse.body.length).toBeGreaterThanOrEqual(2);
  });

  it('should return video by id; GET /api/videos/:id', async () => {
    const createResponse = await request(app)
      .post('/api/videos')
      .send({ ...testvideoData, name: 'Another video' })
      .expect(HttpStatus.Created);

    const getResponse = await request(app)
      .get(`/api/videos/${createResponse.body.id}`)
      .expect(HttpStatus.Ok);

    expect(getResponse.body).toEqual({
      ...createResponse.body,
      id: expect.any(Number),
      createdAt: expect.any(String),
    });
  });

  it('should update video; PUT /api/videos/:id', async () => {
    const createResponse = await request(app)
      .post('/api/videos')
      .send({ ...testvideoData, name: 'Another video' })
      .expect(HttpStatus.Created);

    const videoUpdateData: videoInputDto = {
      name: 'Updated Name',
      phoneNumber: '999-888-7777',
      email: 'updated@example.com',
      vehicleMake: 'Tesla',
      vehicleModel: 'Model S',
      vehicleYear: 2022,
      vehicleLicensePlate: 'NEW-789',
      vehicleDescription: 'Updated vehicle description',
      vehicleFeatures: [VehicleFeature.ChildSeat],
    };

    await request(app)
      .put(`/api/videos/${createResponse.body.id}`)
      .send(videoUpdateData)
      .expect(HttpStatus.NoContent);

    const videoResponse = await request(app).get(
      `/api/videos/${createResponse.body.id}`,
    );

    expect(videoResponse.body).toEqual({
      ...videoUpdateData,
      id: createResponse.body.id,
      createdAt: expect.any(String),
    });
  });

  it('DELETE /api/videos/:id and check after NOT FOUND', async () => {
    const {
      body: { id: createdvideoId },
    } = await request(app)
      .post('/api/videos')
      .send({ ...testvideoData, name: 'Another video' })
      .expect(HttpStatus.Created);

    await request(app)
      .delete(`/api/videos/${createdvideoId}`)
      .expect(HttpStatus.NoContent);

    const videoResponse = await request(app).get(
      `/api/videos/${createdvideoId}`,
    );
    expect(videoResponse.status).toBe(HttpStatus.NotFound);
  });
});

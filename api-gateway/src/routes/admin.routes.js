import express from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { requireAdminApiKey } from '../middlewares/authentication.js';
import { ServiceModel } from '../models/Service.js';
import { ApiKeyModel } from '../models/ApiKey.js';

export const adminRouter = express.Router();

adminRouter.use(requireAdminApiKey);

adminRouter.get('/services', async (req, res) => {
  const services = await ServiceModel.find().lean();
  res.json({ services });
});

adminRouter.post(
  '/services',
  celebrate({
    [Segments.BODY]: Joi.object({
      name: Joi.string().required(),
      version: Joi.string().default('v1'),
      baseUrl: Joi.string().uri().required(),
      healthPath: Joi.string().default('/health'),
      weight: Joi.number().integer().min(1).default(1),
      enabled: Joi.boolean().default(true)
    })
  }),
  async (req, res) => {
    const service = await ServiceModel.create(req.body);
    res.status(201).json({ service });
  }
);

adminRouter.patch(
  '/services/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object({ id: Joi.string().required() }),
    [Segments.BODY]: Joi.object({
      baseUrl: Joi.string().uri(),
      healthPath: Joi.string(),
      weight: Joi.number().integer().min(1),
      enabled: Joi.boolean()
    }).min(1)
  }),
  async (req, res) => {
    const service = await ServiceModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) return res.status(404).json({ error: { message: 'Service not found' } });
    res.json({ service });
  }
);

adminRouter.delete('/services/:id', async (req, res) => {
  const service = await ServiceModel.findByIdAndDelete(req.params.id);
  if (!service) return res.status(404).json({ error: { message: 'Service not found' } });
  res.status(204).end();
});

adminRouter.get('/apikeys', async (req, res) => {
  const keys = await ApiKeyModel.find().select('-keyHash').lean();
  res.json({ apiKeys: keys });
});

adminRouter.post(
  '/apikeys',
  celebrate({
    [Segments.BODY]: Joi.object({ name: Joi.string().required(), roles: Joi.array().items(Joi.string()).default([]) })
  }),
  async (req, res) => {
    const { name, roles } = req.body;
    const { rawKey, apiKey } = await ApiKeyModel.createKey(name, roles);
    res.status(201).json({ apiKeyId: apiKey._id, apiKey: rawKey });
  }
);

adminRouter.delete('/apikeys/:id', async (req, res) => {
  const key = await ApiKeyModel.findByIdAndDelete(req.params.id);
  if (!key) return res.status(404).json({ error: { message: 'API key not found' } });
  res.status(204).end();
});
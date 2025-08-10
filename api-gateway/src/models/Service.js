import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    version: { type: String, default: 'v1' },
    baseUrl: { type: String, required: true },
    healthPath: { type: String, default: '/health' },
    weight: { type: Number, default: 1, min: 1 },
    enabled: { type: Boolean, default: true },
    lastStatus: { type: String, enum: ['unknown', 'up', 'down'], default: 'unknown' },
    lastCheckedAt: { type: Date }
  },
  { timestamps: true }
);

ServiceSchema.index({ name: 1, version: 1 });

export const ServiceModel = mongoose.model('Service', ServiceSchema);
import mongoose from 'mongoose';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const ApiKeySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    keyHash: { type: String, required: true },
    roles: { type: [String], default: [] },
    enabled: { type: Boolean, default: true }
  },
  { timestamps: true }
);

ApiKeySchema.statics.createKey = async function (name, roles = []) {
  const rawKey = crypto.randomBytes(24).toString('hex');
  const saltRounds = Number(process.env.API_KEY_HASH_SALT_ROUNDS || 10);
  const keyHash = await bcrypt.hash(rawKey, saltRounds);
  const apiKey = await this.create({ name, keyHash, roles });
  return { rawKey, apiKey };
};

ApiKeySchema.statics.verifyKey = async function (rawKey) {
  const keys = await this.find({ enabled: true }).select('keyHash roles').lean();
  for (const k of keys) {
    const ok = await bcrypt.compare(rawKey, k.keyHash);
    if (ok) return { valid: true, roles: k.roles };
  }
  return { valid: false };
};

export const ApiKeyModel = mongoose.model('ApiKey', ApiKeySchema);
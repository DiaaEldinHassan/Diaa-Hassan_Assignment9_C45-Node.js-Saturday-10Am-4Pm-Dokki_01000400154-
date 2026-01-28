import mongoose from 'mongoose';
import { comparing, hashing } from '../../Common/index.js';

const phoneNumbers = new mongoose.Schema({
  iv: { type: String, required: true },
  number: {
    type: String,
    required: true,
  },
});

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: 4,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^[a-z0-9_%+-]+@(gmail|yahoo|hotmail|outlook)\.(com|net)$/,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: [phoneNumbers],
      required: true,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
      max: 60,
    },
  },
  {
    collection: 'Users',
    timestamps: true,
    strict: true,
  }
);

schema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await hashing(this.password);
});


schema.methods.comparePassword = function (plainpassword) {
  return comparing(plainpassword, this.password);
};

export const userModel = mongoose.models.Users || mongoose.model('Users', schema);

import mongoose from 'mongoose';
import { checkUpperCase } from '../../Common/index.js';
const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      minlength: 10,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
  },
  {
    collection: 'Notes',
    timestamps: true,
  }
);
schema.pre('save', function () {
  this.title = checkUpperCase(this.title);
});

schema.pre('findOneAndUpdate', function() {
    const update = this.getUpdate();
    if (update.title) update.title = checkUpperCase(update.title);
  });
  schema.pre('updateMany', function() {
    const update = this.getUpdate();
    if (update.$set.title) {
      update.$set.title = checkUpperCase(update.$set.title);
    }
  });

export const notesModel =
  mongoose.models.Notes || mongoose.model('Notes', schema);

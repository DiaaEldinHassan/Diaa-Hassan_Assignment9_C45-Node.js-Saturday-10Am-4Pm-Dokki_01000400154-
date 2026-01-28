import mongoose from 'mongoose';
import { checkTokenAndDecode, errorThrow } from '../../Common/index.js';
import { notesModel } from '../../DB/models/notes.model.js';

export async function createNewNote(data, token) {
  const header = await checkTokenAndDecode(token);
  if (!header) {
    errorThrow(404, 'User is not authorized');
  }
  try {
    data.userId = await header._id;
    const newNote = await notesModel.create(data);
    return newNote;
  } catch (error) {
    if (error.code === 11000) {
      errorThrow(400, 'This note is already exist before');
    }
    errorThrow(400, error.message);
  }
}

export async function updateNote(id, data, token) {
  const header = await checkTokenAndDecode(token);
  if (!header) errorThrow(401, 'User is not authorized');

  try {
    const update = await notesModel.findOneAndUpdate(
      { _id: id, userId: header._id },
      data,
      { new: true, runValidators: true }
    );

    if (!update) errorThrow(404, 'Note not found');

    return { message: 'Data updated', data: update };
  } catch (error) {
    if (error.code === 11000) {
      errorThrow(400, 'Note already exists');
    }
    errorThrow(400, error.message);
  }
}

export async function entireUpdate(id, data, token) {
  const header = await checkTokenAndDecode(token);
  if (!header) {
    errorThrow(401, 'User is not authorized');
  }
  try {
    const update = await notesModel.findOneAndReplace(
      { _id: id, userId: header._id },
      { ...data, userId: header._id },
      { runValidators: true, new: true, overwrite: true }
    );
    if (!update) {
      errorThrow(404, 'Note not found');
    }
    return { message: 'Data Updata', data: update };
  } catch (error) {
    if (error.code === 11000) {
      errorThrow(400, 'Note already exists');
    }
    errorThrow(400, error.message);
  }
}

export async function updateMany(data, token) {
  const header = await checkTokenAndDecode(token);
  if (!header) {
    errorThrow(401, 'User is not authorized');
  }
  try {
    const updateAll = await notesModel.updateMany(
      { userId: header._id },
      { $set: { title: data.title } },
      {
        runValidators: true,
      }
    );
    if (!updateAll) {
      errorThrow(404, 'No notes found');
    }
    return { message: 'Data updated', data: updateAll };
  } catch (error) {
    errorThrow(400, error.message);
  }
}

export async function deleteOneNote(id, token) {
  const header = await checkTokenAndDecode(token);
  if (!header) {
    errorThrow(401, 'User not authorized');
  }
  try {
    const deleteNote = await notesModel.findOneAndDelete({
      _id: id,
      userId: header._id,
    });
    if (!deleteNote) errorThrow(404, 'Note is not found');
    return { message: 'Note is deleted', data: deleteNote };
  } catch (error) {
    errorThrow(400, error.message);
  }
}

export async function getNotesPaginated(page, limit, token) {
  const header = await checkTokenAndDecode(token);
  if (!header) {
    errorThrow(401, 'User not authorized');
  }
  const pageParsed = parseInt(page) || 1;
  const limitParsed = parseInt(limit) || 3;
  const skip = (pageParsed - 1) * limitParsed;
  try {
    const notes = await notesModel
      .find({ userId: header._id })
      .sort({ createdAt: -1 })
      .limit(limitParsed)
      .skip(skip);
    return { message: 'Done', data: notes };
  } catch (error) {
    errorThrow(400, error.message);
  }
}

export async function getNoteById(id, token) {
  const header = await checkTokenAndDecode(token);
  if (!header) {
    errorThrow(401, 'User not authorized');
  }
  try {
    const note = await notesModel.findOne({ _id: id, userId: header._id });
    if (!note) {
      errorThrow(404, 'there is not notes found');
    }
    return { message: 'Done', data: note };
  } catch (error) {
    errorThrow(400, error.message);
  }
}

export async function getNoteByContent(content, token) {
  const header = await checkTokenAndDecode(token);
  if (!header) {
    errorThrow(401, 'User not authorized');
  }
  try {
    const note = await notesModel.findOne({ content, userId: header._id });
    if (!note) {
      errorThrow(404, 'there is not notes found');
    }
    return { message: 'Done', data: note };
  } catch (error) {
    errorThrow(400, error.message);
  }
}

export async function getNotesWithUserEmail(token) {
  const header = await checkTokenAndDecode(token);
  if (!header) {
    errorThrow(401, 'User not authorized');
  }

  try {
    const notes = await notesModel
      .find({ userId: header._id })
      .select('title userId createdAt')
      .populate({
        path: 'userId',
        select: 'email -_id',
      });

    if (notes.length === 0) {
      errorThrow(404, 'No Notes Found for this user');
    }

    return { message: 'Done', data: notes };
  } catch (error) {
    errorThrow(400, error.message);
  }
}

export async function getAllNotesWithAggregation(search, token) {
  const header = await checkTokenAndDecode(token);
  if (!header) {
    errorThrow(401, 'User not authorized');
  }
  try {
    const notes = await notesModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(header._id),
          title: { $regex: search, $options: 'i' },
        },
      },
      {
        $lookup: {
          from: 'Users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userNotes',
        },
      },
      {
        $unwind: '$userNotes',
      },
      {
        $project: {
          title: 1,
          userId: 1,
          createdAt: 1,
          'userNotes.name': 1,
          'userNotes.email': 1,
        },
      },
    ]);
    if (notes.length === 0) {
      errorThrow(404, 'No notes found');
    }
    return { message: 'Done', data: notes };
  } catch (error) {
    errorThrow(400, error.message);
  }
}

export async function deleteAllNotes(token) {
  const header = await checkTokenAndDecode(token);
  if (!header) {
    errorThrow(401, 'User not authorized');
  }
  try {
    const deletedNotes = await notesModel.deleteMany({ userId: header._id });
    return { message: 'Deleted', data: deletedNotes };
  } catch (error) {
    errorThrow(400, error.message);
  }
}

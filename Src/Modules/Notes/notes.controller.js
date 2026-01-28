import { Router } from 'express';
import {
  createNewNote,
  deleteAllNotes,
  deleteOneNote,
  entireUpdate,
  getAllNotesWithAggregation,
  getNoteByContent,
  getNoteById,
  getNotesPaginated,
  getNotesWithUserEmail,
  updateMany,
  updateNote,
} from './notes.service.js';
import { success } from '../../Common/index.js';
import mongoose from 'mongoose';

export const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const newNote = await createNewNote(req.body, req.headers.authorization);
    success(res, 200, 'New Note Created Successfully', newNote);
  } catch (error) {
    next(error);
  }
});

router.get('/paginated-sort', async (req, res, next) => {
  const { page, limit } = req.query;
  if (!page || !limit) {
    return next(new Error('Please Enter the limit and the page query'));
  }
  try {
    const notes = await getNotesPaginated(
      page,
      limit,
      req.headers.authorization
    );
    success(res, 200, notes.message, notes.data);
  } catch (error) {
    next(error);
  }
});

router.get('/notes-by-content', async (req, res, next) => {
  if (!req.query.content) {
    return next(new Error('Please Enter the content of the note'));
  }
  try {
    const note = await getNoteByContent(
      req.query.content,
      req.headers.authorization
    );
    success(res, 200, note.message, note.data);
  } catch (error) {
    next(error);
  }
});

router.get('/notes-with-user', async (req, res, next) => {
  try {
    const notes = await getNotesWithUserEmail(req.headers.authorization);
    success(res, 200, notes.message, notes.data);
  } catch (error) {
    next(error);
  }
});

router.get('/aggregate', async (req, res, next) => {
  try {
    const notes = await getAllNotesWithAggregation(
      req.query.title || '',
      req.headers.authorization
    );
    success(res, 200, notes.message, notes.data);
  } catch (error) {
    next(error);
  }
});

router.patch('/all', async (req, res, next) => {
  try {
    const update = await updateMany(req.body, req.headers.authorization);
    success(res, 200, update.message, update.data);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new Error('Invalid Note ID format'));
  }
  try {
    const note = await getNoteById(req.params.id, req.headers.authorization);
    success(res, 200, note.message, note.data);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new Error('Invalid Note ID format'));
  }
  try {
    const update = await updateNote(
      req.params.id,
      req.body,
      req.headers.authorization
    );
    success(res, 200, update.message, update.data);
  } catch (error) {
    next(error);
  }
});

router.put('/replace/:id', async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new Error('Invalid Note ID format'));
  }
  try {
    const update = await entireUpdate(
      req.params.id,
      req.body,
      req.headers.authorization
    );
    success(res, 200, update.message, update.data);
  } catch (error) {
    next(error);
  }
});

router.delete('/', async (req, res, next) => {
  try {
    const deleteNotes = await deleteAllNotes(req.headers.authorization);
    success(res, 200, deleteNotes.message, deleteNotes.data);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new Error('Invalid Note ID format'));
  }
  try {
    const deleteNote = await deleteOneNote(
      req.params.id,
      req.headers.authorization
    );
    success(res, 200, deleteNote.message, deleteNote.data);
  } catch (error) {
    next(error);
  }
});

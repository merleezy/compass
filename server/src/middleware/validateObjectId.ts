import mongoose from 'mongoose';
import type { Request, Response, NextFunction } from 'express';

// Rejects requests whose :id param is not a valid MongoDB ObjectId.
// Without this guard, Mongoose throws a CastError inside the controller and
// the request falls into the generic catch block, returning a 500. A
// malformed id is a client mistake, not a server failure, so the correct
// response is 400 — and validating it here means no controller has to
// repeat the check.
const validateObjectId = (req: Request, res: Response, next: NextFunction) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid id format' });
  }
  next();
};

export default validateObjectId;

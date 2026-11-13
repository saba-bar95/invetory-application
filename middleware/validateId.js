import HttpError from "../errors/httpError.js";

export default function validateId(req, res, next) {
  if (!/^\d+$/.test(req.params.id)) {
    return next(new HttpError("Invalid id.", 400));
  }
  next();
}

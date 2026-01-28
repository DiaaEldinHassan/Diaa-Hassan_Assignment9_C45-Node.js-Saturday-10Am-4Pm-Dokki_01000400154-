export function success(res, statusCode = 200, message = "", data = "") {
  res.status(statusCode).json({ message: message, data: data});
}

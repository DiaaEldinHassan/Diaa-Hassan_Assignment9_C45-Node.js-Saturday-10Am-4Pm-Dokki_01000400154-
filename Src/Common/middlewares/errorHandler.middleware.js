export function globalErrorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json(
        {
            success: false,
            error: process.env.NODE_ENV === "development" ? err.stack : undefined,
            message: err.message
        }
    )
}
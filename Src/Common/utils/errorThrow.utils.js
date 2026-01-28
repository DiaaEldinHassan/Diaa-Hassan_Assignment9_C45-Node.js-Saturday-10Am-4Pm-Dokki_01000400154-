export function errorThrow(statusCode=400,message) {
    const err=new Error(message);
    err.statusCode=statusCode;
    throw err;
}
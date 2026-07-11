function errorHandler(err, req, res, next) {
  console.error('Error Intercepted:', err.message);

  // Database unique violation (e.g. unique email register conflict)
  if (err.code === '23505') {
    return res.status(409).json({ error: 'A record with these details already exists.' });
  }

  // Database foreign key violation
  if (err.code === '23503') {
    return res.status(400).json({ error: 'Invalid reference ID detected.' });
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  return res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
}

module.exports = errorHandler;

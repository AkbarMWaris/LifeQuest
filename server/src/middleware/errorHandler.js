export function errorHandler(err, req, res, _next) {
  console.error('[LifeQuest][error]', err);
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: Object.values(err.errors).map((e) => e.message).join(' ') });
  }
  if (err.code === 11000) {
    return res.status(409).json({ error: 'That already exists in the world.' });
  }
  const status = err.status || 500;
  return res.status(status).json({ error: err.message || 'Something went wrong in the realm.' });
}
export const Roles = {
  USER: 'USER',
  RESTAURANT: 'RESTAURANT',
  DRIVER: 'DRIVER'
};

const tokenToRole = (token, env) => {
  if (!token) return null;
  if (token === env.ROLE_USER_TOKEN) return Roles.USER;
  if (token === env.ROLE_RESTAURANT_TOKEN) return Roles.RESTAURANT;
  if (token === env.ROLE_DRIVER_TOKEN) return Roles.DRIVER;
  return null;
};

export function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  req.role = tokenToRole(token, process.env);
  next();
}

export function requireRole(...allowed) {
  return (req, res, next) => {
    if (!req.role) return res.status(401).json({ error: 'Unauthorized' });
    if (!allowed.includes(req.role)) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}
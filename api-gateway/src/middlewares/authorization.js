import { getRequiredRoles } from '../config/acl.js';

export function requireRolesForService() {
  return (req, res, next) => {
    const serviceName = req.params.service;
    const method = req.method;
    const required = getRequiredRoles(serviceName, method);
    if (!required || required.length === 0) return next();

    const roles = req.auth?.roles || [];
    const has = required.every((r) => roles.includes(r));
    if (!has) return res.status(403).json({ error: { message: 'Forbidden' } });
    next();
  };
}
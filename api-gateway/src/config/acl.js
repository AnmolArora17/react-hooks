export const aclRules = {
  // Example defaults: GET requires 'read', write methods require 'write'
  // You can override per-service below. Empty or missing means allow all for that service.
  // products: { GET: ['read'], POST: ['write'], PUT: ['write'], PATCH: ['write'], DELETE: ['write'] },
};

export function getRequiredRoles(serviceName, method) {
  const rules = aclRules[serviceName];
  if (!rules) {
    // Default policy: GET/HEAD -> read, others -> write
    if (method === 'GET' || method === 'HEAD') return ['read'];
    return ['write'];
  }
  return rules[method] || [];
}
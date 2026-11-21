import AuditLog from '../models/AuditLog.js';

// Records an admin action. A logging problem must never block the action itself.
export async function audit(req, action, target = '', label = '', admin = req.admin) {
  try {
    await AuditLog.create({
      admin: admin?._id ?? null,
      adminEmail: admin?.email || '',
      action,
      target,
      label: String(label || '').slice(0, 150),
      ip: req.ip || '',
    });
  } catch (err) {
    console.error('Could not write audit log:', err.message);
  }
}

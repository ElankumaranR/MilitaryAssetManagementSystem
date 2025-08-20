// backend/middleware/audit.js

const AuditLog = require('../models/AuditLog');

/**
 * Audit middleware: logs every asset-modifying transaction.
 * Use: audit('Purchase'), audit('Transfer'), etc.
 */
module.exports = (action) => async (req, res, next) => {
  // Waits until request is finished so status and result are known.
  res.on('finish', async () => {
    // Only log successful writes (status < 400) and only if user is authenticated
    if (res.statusCode < 400 && req.user) {
      // Details can be: route, body, possibly affected _id after insert, etc.
      try {
        await AuditLog.create({
          user: req.user.username,
          action: action,
          details: JSON.stringify({
            method: req.method,
            route: req.originalUrl,
            body: req.body,
            resultId: res.locals?.resultId // optionally set in your controllers
          }),
          timestamp: new Date()
        });
      } catch (err) {
        // Audit log errors shouldn't break main flow, but log for debugging
        console.error('Failed to write audit log:', err);
      }
    }
  });

  next();
};

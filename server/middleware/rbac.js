module.exports = (...roles) => (req, res, next) => {
  // If Commander, restrict your controllers to their base only
  if (req.user.role === 'Commander' && req.method !== 'GET') {
    if (req.body.base !== req.user.base) {
      return res.status(403).json({ error: 'Commander can only operate their base' });
    }
  }
  // Logistics can not assign/expended assets
  if (req.user.role === 'Logistics' && req.path.match(/assignments|expenditures/)) {
    return res.status(403).json({ error: 'Logistics cannot access assignments/expenditures' });
  }
  if (!roles.includes(req.user.role)) return res.sendStatus(403);
  next();
};

const express = require('express');
const router = express.Router();
const controller = require('../controllers/purchaseController');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const audit = require('../middleware/audit');

router.get('/', auth, controller.getPurchases);
router.post('/', auth, rbac('Admin', 'Logistics'), audit('Add Purchase'), controller.addPurchase);

module.exports = router;

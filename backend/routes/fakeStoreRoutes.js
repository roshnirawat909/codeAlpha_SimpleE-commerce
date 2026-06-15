const express = require('express');
const router = express.Router();

const fakeStoreController = require('../controllers/fakeStoreController');

router.get('/', fakeStoreController.listFakeProducts);
router.get('/:id', fakeStoreController.getFakeProductById);

module.exports = router;


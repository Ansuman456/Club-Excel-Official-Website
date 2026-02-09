const express = require('express');
const router = express.Router();
const sankalpEventController = require('../controllers/sankalpEventController');
const { upload } = require('../config/cloudinaryConfig');
const auth = require('../middleware/auth');

router.post('/', auth, upload.fields([{ name: 'photos', maxCount: 10 }, { name: 'bannerImg', maxCount: 1 }]), sankalpEventController.addSankalpEvent);
router.get('/', sankalpEventController.getAllSankalpEvents);
router.put('/:id', auth, upload.fields([{ name: 'photos', maxCount: 10 }, { name: 'bannerImg', maxCount: 1 }]), sankalpEventController.updateSankalpEvent);
router.delete('/:id', auth, sankalpEventController.deleteSankalpEvent);

module.exports = router;

const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { upload } = require('../config/cloudinaryConfig');
const auth = require('../middleware/auth');

router.post('/', auth, upload.fields([{ name: 'photos', maxCount: 10 }, { name: 'bannerImg', maxCount: 1 }]), eventController.addEvent);
router.get('/', eventController.getAllEvents);
router.put('/:id', auth, upload.fields([{ name: 'photos', maxCount: 10 }, { name: 'bannerImg', maxCount: 1 }]), eventController.updateEvent);
router.delete('/:id', auth, eventController.deleteEvent);

module.exports = router;

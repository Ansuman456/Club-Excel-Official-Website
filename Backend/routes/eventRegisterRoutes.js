const express = require('express');
const router = express.Router();
const eventRegisterController = require('../controllers/eventRegisterController');
const auth = require('../middleware/auth');

router.post('/', eventRegisterController.addRegistration);
router.get('/', auth, eventRegisterController.getAllRegisters);
router.put('/:id', auth, eventRegisterController.updateRegistration);
router.delete('/:id', auth, eventRegisterController.deleteRegistration);

// Delete all registers endpoint
router.delete('/eventdelete', auth, eventRegisterController.deleteAllRegisters);

module.exports = router;

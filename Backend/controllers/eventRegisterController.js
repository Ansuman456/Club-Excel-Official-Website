const EventRegister = require('../models/EventRegister');

// POST add event registration
exports.addRegistration = async (req, res) => {
    try {
        const newReg = new EventRegister(req.body);
        const savedReg = await newReg.save();
        res.status(201).json(savedReg);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// GET all registers
exports.getAllRegisters = async (req, res) => {
    try {
        const registers = await EventRegister.find();
        res.status(200).json(registers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE registration
exports.updateRegistration = async (req, res) => {
    try {
        const updatedReg = await EventRegister.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedReg) return res.status(404).json({ message: "Registration not found" });
        res.status(200).json(updatedReg);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE one registration
exports.deleteRegistration = async (req, res) => {
    try {
        const deletedReg = await EventRegister.findByIdAndDelete(req.params.id);
        if (!deletedReg) return res.status(404).json({ message: "Registration not found" });
        res.status(200).json({ message: "Registration deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE all registers
exports.deleteAllRegisters = async (req, res) => {
    try {
        await EventRegister.deleteMany({});
        res.status(200).json({ message: "All registrations deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

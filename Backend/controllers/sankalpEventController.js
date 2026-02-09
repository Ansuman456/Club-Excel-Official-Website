const SankalpEvent = require('../models/SankalpEvent');
const { uploadToCloudinary } = require('../config/cloudinaryConfig');

// POST add sankalp event
exports.addSankalpEvent = async (req, res) => {
    try {
        const eventData = { ...req.body };

        const files = [];
        if (req.files) {
            if (req.files.photos) files.push(...req.files.photos);
            if (req.files.bannerImg) files.push(...req.files.bannerImg);
        }

        if (files.length > 0) {
            const uploadPromises = files.map(file => uploadToCloudinary(file.buffer));
            const results = await Promise.all(uploadPromises);
            eventData.photos = results.map(result => result.secure_url);
        }

        const newEvent = new SankalpEvent(eventData);
        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// GET all sankalp events
exports.getAllSankalpEvents = async (req, res) => {
    try {
        const events = await SankalpEvent.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE sankalp event
exports.updateSankalpEvent = async (req, res) => {
    try {
        const updateData = { ...req.body };

        const files = [];
        if (req.files) {
            if (req.files.photos) files.push(...req.files.photos);
            if (req.files.bannerImg) files.push(...req.files.bannerImg);
        }

        if (files.length > 0) {
            const uploadPromises = files.map(file => uploadToCloudinary(file.buffer));
            const results = await Promise.all(uploadPromises);
            updateData.photos = results.map(result => result.secure_url);
        }

        const updatedEvent = await SankalpEvent.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedEvent) return res.status(404).json({ message: "Sankalp Event not found" });
        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE sankalp event
exports.deleteSankalpEvent = async (req, res) => {
    try {
        const deletedEvent = await SankalpEvent.findByIdAndDelete(req.params.id);
        if (!deletedEvent) return res.status(404).json({ message: "Sankalp Event not found" });
        res.status(200).json({ message: "Sankalp Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

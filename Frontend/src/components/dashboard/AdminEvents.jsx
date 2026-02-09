import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Upload, Calendar, Clock, MapPin, Users } from 'lucide-react';
import Popup from '../ui/Popup';

const AdminEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        date: '',
        time: '',
        vanue: '',
        rules: '',
        whatsappGroup: '',
        status: 'upcoming',
        noOfAttendies: 0
    });
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [popup, setPopup] = useState({
        show: false,
        type: 'success',
        message: '',
        isConfirm: false,
        onConfirm: () => { }
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/event');
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (event = null) => {
        if (event) {
            setCurrentEvent(event);
            setFormData({
                name: event.name,
                description: event.description,
                date: event.date,
                time: event.time,
                vanue: event.vanue || '',
                rules: event.rules,
                whatsappGroup: event.whatsappGroup || '',
                status: event.status,
                noOfAttendies: event.noOfAttendies || 0
            });
            setImagePreviews(event.photos || []);
        } else {
            setCurrentEvent(null);
            setFormData({
                name: '',
                description: '',
                date: '',
                time: '',
                vanue: '',
                rules: '',
                whatsappGroup: '',
                status: 'upcoming',
                noOfAttendies: 0
            });
            setImagePreviews([]);
        }
        setImageFiles([]);
        setShowModal(true);
        setSubmitting(false);
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImageFiles(files);

        const previews = files.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(previews).then(res => setImagePreviews(res));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const token = localStorage.getItem('adminToken');

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));

        imageFiles.forEach(file => {
            data.append('photos', file);
        });

        try {
            const url = currentEvent
                ? `http://localhost:5000/api/event/${currentEvent._id}`
                : 'http://localhost:5000/api/event';

            const method = currentEvent ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: data
            });

            if (response.ok) {
                setShowModal(false);
                setPopup({
                    show: true,
                    type: 'success',
                    message: currentEvent ? 'Event updated successfully!' : 'Event created successfully!',
                    isConfirm: false
                });
                fetchEvents();
            } else {
                const error = await response.json();
                setPopup({
                    show: true,
                    type: 'error',
                    message: error.message || 'Something went wrong',
                    isConfirm: false
                });
            }
        } catch (error) {
            console.error('Error saving event:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        setPopup({
            show: true,
            type: 'confirm',
            message: 'Are you sure you want to delete this event? This action cannot be undone.',
            isConfirm: true,
            onConfirm: async () => {
                const token = localStorage.getItem('adminToken');
                try {
                    const response = await fetch(`http://localhost:5000/api/event/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        setPopup({
                            show: true,
                            type: 'success',
                            message: 'Event deleted successfully!',
                            isConfirm: false
                        });
                        fetchEvents();
                    } else {
                        setPopup({
                            show: true,
                            type: 'error',
                            message: 'Failed to delete event',
                            isConfirm: false
                        });
                    }
                } catch (error) {
                    console.error('Error deleting event:', error);
                    setPopup({
                        show: true,
                        type: 'error',
                        message: 'An error occurred while deleting',
                        isConfirm: false
                    });
                }
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Manage Events</h2>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-xl font-semibold hover:bg-neutral-200 transition-all"
                >
                    <Plus className="w-4 h-4" /> Add Event
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <div key={event._id} className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-blue-500/30 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] hover:-translate-y-2 transition-all duration-500 flex flex-col">
                            <div className="h-56 relative overflow-hidden bg-white/5 border-b border-white/5">
                                {event.photos?.[0] ? (
                                    <img src={event.photos[0]} alt={event.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-neutral-700 bg-white/5 font-black uppercase tracking-widest text-[8px] flex-col">
                                        <Calendar className="w-8 h-8 mb-2 text-blue-500 opacity-20" />
                                        <span>No Photo</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-4 backdrop-blur-[2px] z-20">
                                    <button
                                        onClick={() => handleOpenModal(event)}
                                        className="p-3 bg-white/10 hover:bg-white text-black rounded-full backdrop-blur-md transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(event._id)}
                                        className="p-3 bg-red-500/10 hover:bg-red-500 text-white rounded-full backdrop-blur-md transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="absolute top-4 left-4 z-10">
                                    <span className={`text-[10px] uppercase tracking-[0.2em] font-black px-3 py-1.5 rounded-full backdrop-blur-md border ${event.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400 border-blue-500/20' : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/20'}`}>
                                        {event.status}
                                    </span>
                                </div>
                            </div>

                            <div className="p-7 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold mb-4 group-hover:text-blue-400 transition-colors duration-300 line-clamp-1">{event.name}</h3>

                                <div className="space-y-3 mb-6 font-medium">
                                    <div className="flex items-center gap-3 text-neutral-400">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-blue-400">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm">{event.date}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-neutral-400">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-blue-400">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm">{event.time}</span>
                                    </div>
                                </div>

                                <p className="text-neutral-500 text-xs leading-relaxed line-clamp-2 mt-auto pt-5 border-t border-white/5 italic">
                                    {event.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !submitting && setShowModal(false)}></div>
                    <div className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col h-fit max-h-[90vh]">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0a0a0a] sticky top-0 z-10">
                            <h3 className="text-xl font-bold">{currentEvent ? 'Edit Event' : 'Add New Event'}</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-white/5 rounded-full transition-all disabled:opacity-50"
                                disabled={submitting}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-1 p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Event Images</label>
                                    <div className="grid grid-cols-4 gap-4">
                                        {imagePreviews.map((src, idx) => (
                                            <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-white/10 relative group">
                                                <img src={src} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                        <div className="aspect-square rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center relative hover:border-white/20 transition-all">
                                            <Upload className="w-5 h-5 text-neutral-500 mb-2" />
                                            <span className="text-[10px] text-neutral-500 font-bold">UPLOAD</span>
                                            <input
                                                type="file"
                                                multiple
                                                onChange={handleImageChange}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                disabled={submitting}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Event Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/30 disabled:opacity-50"
                                            required
                                            disabled={submitting}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Date</label>
                                            <input
                                                type="date"
                                                value={formData.date}
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/30 disabled:opacity-50"
                                                disabled={submitting}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Time</label>
                                            <input
                                                type="time"
                                                value={formData.time}
                                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/30 disabled:opacity-50"
                                                disabled={submitting}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Venue</label>
                                        <input
                                            type="text"
                                            value={formData.vanue}
                                            onChange={(e) => setFormData({ ...formData, vanue: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/30 disabled:opacity-50"
                                            disabled={submitting}
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/30 h-24 resize-none disabled:opacity-50"
                                            required
                                            disabled={submitting}
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Rules (separate by new lines)</label>
                                        <textarea
                                            value={formData.rules}
                                            onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/30 h-24 resize-none disabled:opacity-50"
                                            disabled={submitting}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Status</label>
                                            <select
                                                value={formData.status}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/30 appearance-none cursor-pointer disabled:opacity-50"
                                                disabled={submitting}
                                            >
                                                <option value="upcoming" className="bg-[#121212] text-white">Upcoming</option>
                                                <option value="completed" className="bg-[#121212] text-white">Completed</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Attendees</label>
                                            <input
                                                type="number"
                                                value={formData.noOfAttendies}
                                                onChange={(e) => setFormData({ ...formData, noOfAttendies: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/30 disabled:opacity-50"
                                                disabled={submitting}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold ml-1">WhatsApp Group Link</label>
                                        <input
                                            type="url"
                                            value={formData.whatsappGroup}
                                            onChange={(e) => setFormData({ ...formData, whatsappGroup: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/30 disabled:opacity-50"
                                            placeholder="https://chat.whatsapp.com/..."
                                            disabled={submitting}
                                        />
                                    </div>
                                </div>

                                <div className="sticky bottom-0 bg-[#0a0a0a] pt-4 pb-2 z-10">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {submitting && <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>}
                                        {submitting
                                            ? (currentEvent ? 'Updating...' : 'Creating...')
                                            : (currentEvent ? 'Update Event' : 'Create Event')
                                        }
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            <Popup
                show={popup.show}
                type={popup.type}
                message={popup.message}
                isConfirm={popup.isConfirm}
                onConfirm={() => {
                    popup.onConfirm();
                }}
                onClose={() => setPopup({ ...popup, show: false })}
            />
        </div>
    );
};

export default AdminEvents;

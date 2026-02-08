import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Upload, Calendar, Clock, MapPin, Trophy } from 'lucide-react';

const AdminSankalpEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        time: '',
        vanue: '',
        rules: '',
        status: 'upcoming',
        link: '',
        whatsappGroup: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/sankalpevent');
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching sankalp events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (event = null) => {
        if (event) {
            setCurrentEvent(event);
            setFormData({
                name: event.name,
                date: event.date,
                time: event.time,
                vanue: event.vanue,
                rules: event.rules,
                status: event.status,
                link: event.link || '',
                whatsappGroup: event.whatsappGroup || ''
            });
            setImagePreview(event.bannerImg);
        } else {
            setCurrentEvent(null);
            setFormData({
                name: '',
                date: '',
                time: '',
                vanue: '',
                rules: '',
                status: 'upcoming',
                link: '',
                whatsappGroup: ''
            });
            setImagePreview(null);
        }
        setImageFile(null);
        setShowModal(true);
        setSubmitting(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const token = localStorage.getItem('adminToken');

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (imageFile) {
            data.append('bannerImg', imageFile);
        }

        try {
            const url = currentEvent
                ? `http://localhost:5000/api/sankalpevent/${currentEvent._id}`
                : 'http://localhost:5000/api/sankalpevent';

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
                fetchEvents();
            } else {
                const error = await response.json();
                alert(error.message);
            }
        } catch (error) {
            console.error('Error saving sankalp event:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this Sankalp event?')) return;

        const token = localStorage.getItem('adminToken');
        try {
            const response = await fetch(`http://localhost:5000/api/sankalpevent/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchEvents();
            }
        } catch (error) {
            console.error('Error deleting sankalp event:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-indigo-500" />
                    </div>
                    <h2 className="text-2xl font-bold">Sankalp Events</h2>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-indigo-500 text-black px-4 py-2 rounded-xl font-semibold hover:bg-indigo-400 transition-all"
                >
                    <Plus className="w-4 h-4" /> Add Sankalp Event
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <div key={event._id} className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-indigo-500/30 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] hover:-translate-y-2 transition-all duration-500 flex flex-col">
                            <div className="h-56 relative overflow-hidden bg-white/5 border-b border-white/5">
                                {event.bannerImg ? (
                                    <img src={event.bannerImg} alt={event.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full bg-indigo-500/5 flex items-center justify-center font-black uppercase tracking-widest text-[8px] flex-col">
                                        <Trophy className="w-8 h-8 mb-2 text-indigo-500 opacity-20" />
                                        <span>No Banner</span>
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
                                    <span className={`text-[10px] uppercase tracking-[0.2em] font-black px-3 py-1.5 rounded-full backdrop-blur-md border ${event.status === 'upcoming' ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/20' : 'bg-neutral-500/20 text-neutral-400 border-neutral-500/20'}`}>
                                        {event.status}
                                    </span>
                                </div>
                            </div>

                            <div className="p-7 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold mb-4 group-hover:text-indigo-400 transition-colors duration-300 line-clamp-1">{event.name}</h3>

                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center gap-3 text-neutral-400 font-medium">
                                        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-indigo-500">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm">{event.date}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-neutral-400 font-medium">
                                        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-indigo-500">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm">{event.time}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-neutral-400 font-medium">
                                        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-indigo-500">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm line-clamp-1">{event.vanue}</span>
                                    </div>
                                </div>

                                {event.rules && (
                                    <p className="text-neutral-500 text-xs leading-relaxed line-clamp-2 mt-auto pt-5 border-t border-white/5 italic">
                                        {event.rules}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !submitting && setShowModal(false)}></div>
                    <div className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0a0a0a] sticky top-0 z-10">
                            <h3 className="text-xl font-bold">{currentEvent ? 'Edit Sankalp Event' : 'Add Sankalp Event'}</h3>
                            <button
                                onClick={() => !submitting && setShowModal(false)}
                                className={`p-2 hover:bg-white/5 rounded-full transition-all ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={submitting}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Event Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/30 disabled:opacity-50"
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
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/30 disabled:opacity-50"
                                            required
                                            disabled={submitting}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Time</label>
                                        <input
                                            type="time"
                                            value={formData.time}
                                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/30 disabled:opacity-50"
                                            required
                                            disabled={submitting}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Venue</label>
                                        <input
                                            type="text"
                                            value={formData.vanue}
                                            onChange={(e) => setFormData({ ...formData, vanue: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/30 disabled:opacity-50"
                                            required
                                            disabled={submitting}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/30 appearance-none cursor-pointer disabled:opacity-50"
                                            disabled={submitting}
                                        >
                                            <option value="upcoming" className="bg-[#121212] text-white">Upcoming</option>
                                            <option value="completed" className="bg-[#121212] text-white">Completed</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Registration Link (External)</label>
                                        <input
                                            type="url"
                                            value={formData.link}
                                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/30 disabled:opacity-50"
                                            placeholder="https://..."
                                            disabled={submitting}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold ml-1">WhatsApp Group Link</label>
                                        <input
                                            type="url"
                                            value={formData.whatsappGroup}
                                            onChange={(e) => setFormData({ ...formData, whatsappGroup: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/30 disabled:opacity-50"
                                            placeholder="https://chat.whatsapp.com/..."
                                            disabled={submitting}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Banner Image</label>
                                    <div className="relative group">
                                        <div className="h-40 rounded-2xl overflow-hidden border-2 border-dashed border-white/10 flex items-center justify-center bg-white/5">
                                            {imagePreview ? (
                                                <img src={imagePreview} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="text-neutral-500 flex flex-col items-center">
                                                    <Upload className="w-6 h-6 mb-2" />
                                                    <span className="text-[10px] uppercase font-bold">Upload Banner</span>
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            onChange={handleImageChange}
                                            className={`absolute inset-0 opacity-0 cursor-pointer ${submitting ? 'cursor-not-allowed' : ''}`}
                                            required={!currentEvent}
                                            disabled={submitting}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Rules</label>
                                    <textarea
                                        value={formData.rules}
                                        onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/30 h-24 resize-none disabled:opacity-50"
                                        required
                                        disabled={submitting}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-indigo-500 text-black font-bold py-4 rounded-xl hover:bg-indigo-400 transition-all sticky bottom-0 z-10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl"
                            >
                                {submitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                                        {currentEvent ? 'Updating...' : 'Creating...'}
                                    </>
                                ) : (
                                    currentEvent ? 'Update Event' : 'Create Event'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSankalpEvents;

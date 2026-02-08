import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Hash, Home, Send, ArrowLeft, Trophy, Calendar } from 'lucide-react';

const RegisterEvent = () => {
    const { type, id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        phoneno: '',
        rollno: '',
        locality: 'hostelite'
    });

    useEffect(() => {
        fetchEvent();
    }, [id, type]);

    const fetchEvent = async () => {
        try {
            const apiPath = type === 'sankalp' ? 'sankalpevent' : 'event';
            const response = await fetch(`http://localhost:5000/api/${apiPath}`);
            const events = await response.json();
            const foundEvent = events.find(e => e._id === id);

            if (foundEvent) {
                setEvent(foundEvent);
            } else {
                alert('Event not found');
                navigate('/events');
            }
        } catch (error) {
            console.error('Error fetching event:', error);
            alert('Error loading event details');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const apiPath = type === 'sankalp' ? 'sankalpregisters' : 'eventregisters';
        const dataToSend = {
            ...formData,
            eventname: event.name
        };

        try {
            const response = await fetch(`http://localhost:5000/api/${apiPath}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            });

            const responseData = await response.json().catch(() => null);

            if (response.ok) {
                alert('Registration successful! Prepare for battle.');
                navigate(type === 'sankalp' ? '/sankalp' : '/events');
            } else {
                console.error('Registration failed:', responseData);
                const errorMessage = responseData?.message || `Registration failed with status: ${response.status}`;
                alert(errorMessage);
            }
        } catch (error) {
            console.error('Registration network error:', error);
            alert(`Network error: ${error.message}. Please insure the backend is running.`);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-white/5 border-t-white rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!event) return null;

    return (
        <div className="min-h-screen bg-black pt-32 pb-20 px-6">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>

                <div className="bg-[#050505] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(99,102,241,0.1)]">
                    <div className="p-10 border-b border-white/5">
                        <div className="flex items-center gap-4 mb-4">
                            {type === 'sankalp' ? (
                                <Trophy className="w-8 h-8 text-indigo-500" />
                            ) : (
                                <Calendar className="w-8 h-8 text-blue-500" />
                            )}
                            <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Event Registration</h1>
                        </div>
                        <p className="text-neutral-500 text-sm">{event.name}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-10 space-y-8">
                        <div className="space-y-6">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-black ml-1">
                                    <User className="w-3 h-3" /> Full Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.fullname}
                                    onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all font-medium text-white"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>

                            {/* Email & Phone */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-black ml-1">
                                        <Mail className="w-3 h-3" /> Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all font-medium text-white"
                                        placeholder="email@example.com"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-black ml-1">
                                        <Phone className="w-3 h-3" /> Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phoneno}
                                        onChange={(e) => setFormData({ ...formData, phoneno: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all font-medium text-white"
                                        placeholder="9876543210"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Roll No & Locality */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-black ml-1">
                                        <Hash className="w-3 h-3" /> Roll Number
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.rollno}
                                        onChange={(e) => setFormData({ ...formData, rollno: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all font-medium text-white"
                                        placeholder="21BCSXXXX"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-black ml-1">
                                        <Home className="w-3 h-3" /> Locality
                                    </label>
                                    <select
                                        value={formData.locality}
                                        onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all font-medium appearance-none cursor-pointer text-white"
                                    >
                                        <option value="hostelite" className="bg-[#050505]">Hostelite</option>
                                        <option value="localite" className="bg-[#050505]">Localite</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-white text-black font-black py-5 rounded-[2rem] hover:bg-neutral-200 transition-all duration-500 flex items-center justify-center gap-4 group/btn disabled:opacity-50"
                        >
                            {submitting ? (
                                <div className="w-6 h-6 border-4 border-black/20 border-t-black rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    SUBMIT REGISTRATION
                                    <Send className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterEvent;

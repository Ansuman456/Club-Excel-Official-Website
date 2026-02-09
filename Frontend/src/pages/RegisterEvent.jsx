import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Hash, Home, Send, ArrowLeft, Trophy, Calendar, CheckCircle2 } from 'lucide-react';
import Popup from '../components/ui/Popup';

const RegisterEvent = () => {
    const { type, id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        phoneno: '',
        rollno: '',
        locality: 'hostelite'
    });
    const [popup, setPopup] = useState({
        show: false,
        type: 'error',
        message: ''
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
                setPopup({
                    show: true,
                    type: 'error',
                    message: 'Event not found'
                });
                setTimeout(() => navigate('/events'), 2000);
            }
        } catch (error) {
            console.error('Error fetching event:', error);
            setPopup({
                show: true,
                type: 'error',
                message: 'Error loading event details'
            });
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
                setSubmitted(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                console.error('Registration failed:', responseData);
                const errorMessage = responseData?.message || `Registration failed with status: ${response.status}`;
                setPopup({
                    show: true,
                    type: 'error',
                    message: errorMessage
                });
            }
        } catch (error) {
            console.error('Registration network error:', error);
            setPopup({
                show: true,
                type: 'error',
                message: `Network error: ${error.message}. Please insure the backend is running.`
            });
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

    if (submitted) {
        return (
            <div className="min-h-screen bg-black pt-40 pb-20 px-6 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-8 border border-green-500/20">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6 uppercase">
                    Success!
                </h1>
                <p className="text-neutral-400 max-w-xl text-lg font-light leading-relaxed mb-12">
                    Registration complete. Join the official WhatsApp group for {event.name} to receive further instructions and updates.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    {event.whatsappGroup && (
                        <a
                            href={event.whatsappGroup}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 bg-green-600 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest hover:bg-green-500 transition-all shadow-[0_0_50px_rgba(34,197,94,0.2)]"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            Join WhatsApp Group
                        </a>
                    )}
                    <button
                        onClick={() => navigate(type === 'sankalp' ? '/sankalp' : '/events')}
                        className="flex items-center gap-3 bg-white/5 border border-white/10 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                    >
                        Back to Events
                    </button>
                </div>
            </div>
        );
    }

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
            <Popup
                show={popup.show}
                type={popup.type}
                message={popup.message}
                onClose={() => setPopup({ ...popup, show: false })}
            />
        </div>
    );
};

export default RegisterEvent;

import React, { useState, useEffect } from 'react';
import { Send, MessageCircle, User, Hash, Mail, BookOpen, Code, Phone, MapPin, ChevronRight, CheckCircle2 } from 'lucide-react';
import Popup from '../components/ui/Popup';

const Recruitment = () => {
    const [formData, setFormData] = useState({
        name: '',
        rollno: '',
        registrationno: '',
        nistemail: '',
        personalemail: '',
        gender: '',
        branch: '',
        hackerRankId: '',
        techstack: '',
        phoneno: '',
        locality: ''
    });

    const [whatsappLink, setWhatsappLink] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [popup, setPopup] = useState({
        show: false,
        type: 'error',
        message: ''
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/recruitment/settings');
            const data = await response.json();
            if (data.whatsappLink) {
                setWhatsappLink(data.whatsappLink);
            }
        } catch (error) {
            console.error('Error fetching recruitment settings:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await fetch('http://localhost:5000/api/recruitment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmitted(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const error = await response.json();
                setPopup({
                    show: true,
                    type: 'error',
                    message: error.message || 'Submission failed. Please check your details.'
                });
            }
        } catch (error) {
            console.error('Error submitting recruitment form:', error);
            setPopup({
                show: true,
                type: 'error',
                message: 'Error connecting to server.'
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="pt-40 pb-24 px-6 max-w-7xl mx-auto min-h-screen flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-8 border border-green-500/20">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 uppercase">
                    Success!
                </h1>
                <p className="text-neutral-400 max-w-xl text-lg font-light leading-relaxed mb-12">
                    Your application has been received. Join our official recruitment WhatsApp group to stay updated on the selection process.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    {whatsappLink && (
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 bg-green-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-green-500 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                        >
                            <MessageCircle className="w-5 h-5" />
                            Join WhatsApp Group
                        </a>
                    )}
                    <button
                        onClick={() => window.location.href = '/'}
                        className="flex items-center gap-3 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                <div className="lg:col-span-5 space-y-8">
                    <div data-aos="fade-right">
                        <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white mb-6 uppercase leading-[0.9]">
                            Level <br />
                            <span className="text-blue-500">Up</span>
                        </h1>
                        <p className="text-neutral-400 max-w-md text-lg font-light leading-relaxed">
                            Join Club Excel and be part of the most elite tech community. Fill out the application to start your journey.
                        </p>
                    </div>

                    <div className="space-y-6 pt-8">
                        <div className="flex items-start gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-blue-500/30 transition-all duration-500">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-all">
                                <Code className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-1 uppercase tracking-wider">Technical Prowess</h3>
                                <p className="text-neutral-500 text-sm leading-relaxed">Showcase your skills in programming, development, and problem solving.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-purple-500/30 transition-all duration-500">
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center shrink-0 group-hover:bg-purple-500/20 transition-all">
                                <MessageCircle className="w-6 h-6 text-purple-500" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-1 uppercase tracking-wider">Join Part</h3>
                                <p className="text-neutral-500 text-sm leading-relaxed">Engage with our recruitment community and stay updated via WhatsApp.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-7 relative">
                    <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/20 to-transparent blur-3xl -z-10 opacity-50"></div>
                    <form
                        onSubmit={handleSubmit}
                        className="bg-[#080808] border border-white/10 rounded-[3rem] p-8 md:p-12 space-y-8 backdrop-blur-xl shadow-2xl"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-blue-500/50 transition-all text-sm font-medium"
                                        placeholder="Enter your name"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black ml-1">Roll Number</label>
                                <div className="relative">
                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                                    <input
                                        type="text"
                                        name="rollno"
                                        value={formData.rollno}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-blue-500/50 transition-all text-sm font-medium"
                                        placeholder="e.g. 23XXXX"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black ml-1">Registration No</label>
                                <div className="relative">
                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                                    <input
                                        type="text"
                                        name="registrationno"
                                        value={formData.registrationno}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-blue-500/50 transition-all text-sm font-medium"
                                        placeholder="e.g. 230110XXX"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black ml-1">Gender</label>
                                <div className="flex gap-4">
                                    {['male', 'female'].map(g => (
                                        <button
                                            key={g}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, gender: g })}
                                            className={`flex-1 py-4 rounded-2xl border transition-all uppercase text-[10px] font-black tracking-widest ${formData.gender === g
                                                ? 'bg-blue-500 border-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                                                : 'bg-white/[0.03] border-white/5 text-neutral-500 hover:border-white/10'
                                                }`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black ml-1">NIST Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                                    <input
                                        type="email"
                                        name="nistemail"
                                        value={formData.nistemail}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-blue-500/50 transition-all text-sm font-medium"
                                        placeholder="...@nist.edu"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black ml-1">Personal Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                                    <input
                                        type="email"
                                        name="personalemail"
                                        value={formData.personalemail}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-blue-500/50 transition-all text-sm font-medium"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black ml-1">Branch</label>
                                <div className="relative">
                                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                                    <input
                                        type="text"
                                        name="branch"
                                        value={formData.branch}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-blue-500/50 transition-all text-sm font-medium"
                                        placeholder="e.g. CSE, ECE"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black ml-1">HackerRank ID</label>
                                <div className="relative">
                                    <Code className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                                    <input
                                        type="text"
                                        name="hackerRankId"
                                        value={formData.hackerRankId}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-blue-500/50 transition-all text-sm font-medium"
                                        placeholder="Username"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black ml-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                                    <input
                                        type="tel"
                                        name="phoneno"
                                        value={formData.phoneno}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-blue-500/50 transition-all text-sm font-medium"
                                        placeholder="+91..."
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black ml-1">Locality</label>
                                <div className="flex gap-4">
                                    {['localite', 'hostelite'].map(l => (
                                        <button
                                            key={l}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, locality: l })}
                                            className={`flex-1 py-4 rounded-2xl border transition-all uppercase text-[10px] font-black tracking-widest ${formData.locality === l
                                                ? 'bg-blue-500 border-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                                                : 'bg-white/[0.03] border-white/5 text-neutral-500 hover:border-white/10'
                                                }`}
                                        >
                                            {l}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black ml-1">Target Tech Stack</label>
                            <div className="relative">
                                <Code className="absolute left-4 top-6 w-4 h-4 text-neutral-600" />
                                <textarea
                                    name="techstack"
                                    value={formData.techstack}
                                    onChange={handleChange}
                                    required
                                    rows="3"
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-blue-500/50 transition-all text-sm font-medium resize-none"
                                    placeholder="e.g. Web Dev (MERN), AI/ML, Cloud..."
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-4 uppercase tracking-[0.2em] text-sm"
                        >
                            {submitting ? (
                                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Submit Application
                                    <Send className="w-4 h-4" />
                                </>
                            )}
                        </button>

                        <p className="text-[9px] text-neutral-600 text-center uppercase font-black tracking-widest">
                            By submitting you agree to complete the technical assessment.
                        </p>
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

export default Recruitment;

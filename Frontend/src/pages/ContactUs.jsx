import { useState } from 'react';
import { Mail, Phone, MapPin, Send, User } from 'lucide-react';
import Popup from '../components/ui/Popup';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [popup, setPopup] = useState({
        show: false,
        type: 'success',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await fetch('http://localhost:5000/api/contacts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setPopup({
                    show: true,
                    type: 'success',
                    message: 'Thank you for contacting us! We will get back to you soon.'
                });
                setFormData({
                    firstname: '',
                    lastname: '',
                    email: '',
                    phone: '',
                    message: ''
                });
            } else {
                setPopup({
                    show: true,
                    type: 'error',
                    message: 'Failed to send message. Please try again.'
                });
            }
        } catch (error) {
            console.error('Error submitting contact form:', error);
            setPopup({
                show: true,
                type: 'error',
                message: 'Error connecting to server.'
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                {/* Contact Info Header */}
                <div data-aos="fade-right">
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-8 uppercase">
                        Get in <br />
                        <span className="text-purple-500">Touch</span>
                    </h1>
                    <p className="text-neutral-400 max-w-md text-lg font-light leading-relaxed mb-12">
                        Have a question or want to work together? Fill out the form and our team will get back to you within 24 hours.
                    </p>

                    <div className="space-y-8">
                        <div className="flex items-center gap-6 group">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-purple-500/50 transition-all duration-300 group-hover:bg-purple-500/10">
                                <Mail className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-1">Email Us</p>
                                <p className="text-white text-lg font-medium">clubexcel@nist.edu</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 group">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-purple-500/50 transition-all duration-300 group-hover:bg-purple-500/10">
                                <Phone className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-1">Call Us</p>
                                <p className="text-white text-lg font-medium">+91 98765 43210</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 group">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-purple-500/50 transition-all duration-300 group-hover:bg-purple-500/10">
                                <MapPin className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-1">Visit Us</p>
                                <p className="text-white text-lg font-medium">NIST University, Berhampur, Odisha</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div data-aos="fade-left" className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-tr from-purple-500/20 to-transparent blur-3xl -z-10 opacity-50"></div>
                    <form
                        onSubmit={handleSubmit}
                        className="bg-[#080808] border border-white/10 rounded-[2.5rem] p-8 md:p-12 space-y-6 backdrop-blur-xl shadow-2xl relative overflow-hidden"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-mono uppercase tracking-widest text-neutral-500 ml-1">First Name</label>
                                <input
                                    type="text"
                                    name="firstname"
                                    value={formData.firstname}
                                    onChange={handleChange}
                                    required
                                    placeholder="John"
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-purple-500/50 transition-all duration-300"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-mono uppercase tracking-widest text-neutral-500 ml-1">Last Name</label>
                                <input
                                    type="text"
                                    name="lastname"
                                    value={formData.lastname}
                                    onChange={handleChange}
                                    required
                                    placeholder="Doe"
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-purple-500/50 transition-all duration-300"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono uppercase tracking-widest text-neutral-500 ml-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="john@example.com"
                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-purple-500/50 transition-all duration-300"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono uppercase tracking-widest text-neutral-500 ml-1">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                placeholder="+91 00000 00000"
                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-purple-500/50 transition-all duration-300"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono uppercase tracking-widest text-neutral-500 ml-1">Your Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows="4"
                                placeholder="What's on your mind?"
                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-purple-500/50 transition-all duration-300 resize-none"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full group relative p-1 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-[1.02] transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
                        >
                            <div className="bg-[#080808] rounded-[0.9rem] py-4 flex items-center justify-center gap-3">
                                {submitting ? (
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <span className="font-mono text-sm tracking-widest text-white uppercase group-hover:text-purple-400 transition-colors">Send Message</span>
                                        <Send className="w-4 h-4 text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                                    </>
                                )}
                            </div>
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

export default ContactUs;

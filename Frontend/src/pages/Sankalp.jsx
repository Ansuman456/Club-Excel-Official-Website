import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Trophy, ArrowRight, ShieldCheck, Users, ChevronLeft, ChevronRight, X, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sankalp = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);

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

    const upcomingEvents = events.filter(event => event.status === 'upcoming');
    const pastEvents = events.filter(event => event.status !== 'upcoming');

    const ImageCarousel = ({ photos, bannerImg }) => {
        const [currentIndex, setCurrentIndex] = useState(0);

        const allPhotos = photos && photos.length > 0 ? photos : bannerImg ? [bannerImg] : [];

        if (allPhotos.length === 0) return (
            <div className="w-full h-full bg-indigo-500/5 flex items-center justify-center">
                <Trophy className="w-16 h-16 text-indigo-500 opacity-20" />
            </div>
        );

        const next = () => setCurrentIndex((prev) => (prev + 1) % allPhotos.length);
        const prev = () => setCurrentIndex((prev) => (prev - 1 + allPhotos.length) % allPhotos.length);

        return (
            <div className="relative w-full h-full group">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentIndex}
                        src={allPhotos[currentIndex]}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="w-full h-full object-cover"
                    />
                </AnimatePresence>

                {allPhotos.length > 1 && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); prev(); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 z-10"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); next(); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 z-10"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                            {allPhotos.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-6 bg-indigo-500' : 'w-1.5 bg-white/30'}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        );
    };

    const SankalpDetailsModal = ({ event, onClose }) => {
        if (!event) return null;
        const isUpcoming = event.status === 'upcoming';

        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
            >
                <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose}></div>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-6xl bg-[#080808] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(99,102,241,0.2)] flex flex-col md:flex-row max-h-[90vh]"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 z-10 p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>

                    {/* Left - Image Carousel */}
                    <div className="md:w-1/2 h-64 md:h-auto p-4 flex-shrink-0">
                        <ImageCarousel photos={event.photos} bannerImg={event.bannerImg} />
                    </div>

                    {/* Right - Content */}
                    <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar bg-gradient-to-br from-indigo-500/[0.02] to-transparent">
                        <div className="flex items-center gap-4 mb-6">
                            <span className={`px-4 py-1.5 rounded-full ${isUpcoming ? 'bg-indigo-600' : 'bg-neutral-800'} text-white text-[10px] uppercase tracking-[0.2em] font-black border border-white/10 shadow-[0_0_20px_rgba(99,102,241,0.3)]`}>
                                {isUpcoming ? 'Upcoming' : 'Completed'}
                            </span>
                            {!isUpcoming && event.noOfAttendies > 0 && (
                                <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] uppercase tracking-[0.2em] font-black border border-indigo-500/20">
                                    <Users className="w-3 h-3" /> {event.noOfAttendies} Attendees
                                </span>
                            )}
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black mb-10 leading-tight">
                            {event.name}
                        </h2>

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase tracking-widest text-neutral-600 font-black">Date</p>
                                <p className="text-lg font-bold text-white">{event.date}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase tracking-widest text-neutral-600 font-black">Time</p>
                                <p className="text-lg font-bold text-white">{event.time}</p>
                            </div>
                            <div className="space-y-1 col-span-2 lg:col-span-1">
                                <p className="text-[10px] uppercase tracking-widest text-neutral-600 font-black">Venue</p>
                                <p className="text-lg font-bold text-white">{event.vanue || 'TBA'}</p>
                            </div>
                        </div>

                        <div className="space-y-12">
                            {event.rules && (
                                <div className="p-8 bg-white/[0.03] border border-white/5 rounded-[2rem]">
                                    <h4 className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.2em] text-indigo-500 mb-6">
                                        <ShieldCheck className="w-4 h-4" /> Sankalp Guidelines
                                    </h4>
                                    <div className="text-neutral-300 whitespace-pre-wrap font-medium leading-loose text-sm">
                                        {event.rules}
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 flex flex-col gap-4">
                                {isUpcoming ? (
                                    <Link
                                        to={`/register/sankalp/${event._id}`}
                                        className="w-full bg-indigo-600 text-white font-black py-5 rounded-3xl hover:bg-white hover:text-black transition-all duration-500 flex items-center justify-center gap-4 group/btn shadow-xl text-center"
                                    >
                                        REGISTER FOR SANKALP
                                        <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform" />
                                    </Link>
                                ) : (
                                    <div className="w-full bg-neutral-800/50 text-neutral-500 font-black py-5 rounded-3xl border border-white/5 flex items-center justify-center gap-4 shadow-xl text-center cursor-default uppercase">
                                        Registration Closed
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        );
    };

    const SankalpCard = ({ event, isUpcoming }) => (
        <div
            data-aos="fade-up"
            onClick={() => setSelectedEvent(event)}
            className="group relative bg-[#0a0a0a]/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] overflow-hidden hover:border-indigo-500/30 hover:shadow-[0_40px_80px_-20px_rgba(99,102,241,0.3)] transition-all duration-700 flex flex-col md:flex-row md:h-[350px] cursor-pointer"
        >
            {/* Left Side - Image Carousel */}
            <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden bg-white/5 flex-shrink-0">
                <ImageCarousel photos={event.photos} bannerImg={event.bannerImg} />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0a]/60 md:block hidden"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 to-transparent md:hidden"></div>
            </div>

            {/* Right Side - Content */}
            <div className="flex-1 p-5 flex flex-col relative text-justify">
                <div className="absolute top-6 right-6">
                    <span className={`px-4 py-1.5 rounded-full ${isUpcoming ? 'bg-indigo-600' : 'bg-neutral-800'} text-white text-[10px] uppercase tracking-[0.2em] font-black border border-white/10`}>
                        {isUpcoming ? 'Upcoming' : 'Completed'}
                    </span>
                </div>

                <h3 className="text-xl font-black mb-2 group-hover:text-indigo-400 transition-colors duration-300 pr-24 line-clamp-1">
                    {event.name}
                </h3>

                {/* Event Details */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-neutral-400">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                            <Calendar className="w-4 h-4 text-indigo-500" />
                        </div>
                        <div>
                            <p className="text-[8px] uppercase tracking-widest text-neutral-600 font-black">Date</p>
                            <p className="text-[10px] font-bold text-white whitespace-nowrap">{event.date}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-neutral-400">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                            <Clock className="w-4 h-4 text-indigo-500" />
                        </div>
                        <div>
                            <p className="text-[8px] uppercase tracking-widest text-neutral-600 font-black">Time</p>
                            <p className="text-[10px] font-bold text-white whitespace-nowrap">{event.time}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-neutral-400 col-span-2 lg:col-span-1">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                            <MapPin className="w-4 h-4 text-indigo-500" />
                        </div>
                        <div>
                            <p className="text-[8px] uppercase tracking-widest text-neutral-600 font-black">Venue</p>
                            <p className="text-[10px] font-bold text-white truncate">{event.vanue}</p>
                        </div>
                    </div>
                </div>

                {/* Sankalp Guidelines styled like modal */}
                {event.rules && (
                    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 mb-4 flex-1 overflow-hidden">
                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-2">
                            <ShieldCheck className="w-3 h-3" /> Sankalp Guidelines
                        </h4>
                        <div className="text-neutral-400 text-xs whitespace-pre-wrap" style={{ lineHeight: '3' }}>
                            {event.rules}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="mt-auto flex items-center justify-between">
                    {!isUpcoming && event.noOfAttendies > 0 && (
                        <div className="flex items-center gap-2 text-indigo-400 font-black uppercase tracking-widest text-[10px]">
                            <Users className="w-4 h-4" /> {event.noOfAttendies} Attendees
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-white font-black uppercase tracking-widest text-[10px] group-hover:gap-4 transition-all duration-300 ml-auto">
                        VIEW DETAILS <ArrowRight className="w-4 h-4 text-indigo-500" />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="pt-32 pb-40 px-6 max-w-7xl mx-auto min-h-screen">
            <div data-aos="fade-up" className="text-center mb-32">
                <h1 className="text-7xl md:text-9xl font-black tracking-[ -0.05em] text-white mb-10 uppercase">
                    Sankalp<span className="text-indigo-600">.</span>
                </h1>
                <p className="text-neutral-500 max-w-3xl mx-auto text-xl font-medium leading-relaxed">
                    The ultimate arena where innovation meets execution.
                </p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-8">
                    <div className="relative">
                        <div className="w-24 h-24 border-4 border-indigo-500/10 rounded-full"></div>
                        <div className="w-24 h-24 border-t-4 border-indigo-500 rounded-full animate-spin absolute top-0 left-0 shadow-[0_0_30px_rgba(99,102,241,0.4)]"></div>
                    </div>
                    <p className="text-indigo-400 font-black uppercase tracking-[0.5em] text-xs animate-pulse ml-4">Awakening Arena...</p>
                </div>
            ) : (
                <div className="space-y-32">
                    {/* Upcoming Events Section */}
                    {upcomingEvents.length > 0 && (
                        <section>
                            <div className="flex items-center gap-6 mb-12">
                                <h2 className="text-3xl font-bold uppercase tracking-tighter">Upcoming Events</h2>
                                <div className="h-[2px] flex-1 bg-gradient-to-r from-indigo-500/50 to-transparent"></div>
                            </div>
                            <div className="space-y-8">
                                {upcomingEvents.map(event => (
                                    <SankalpCard key={event._id} event={event} isUpcoming={true} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Past Events Section */}
                    <section>
                        <div className="flex items-center gap-6 mb-12">
                            <h2 className="text-3xl font-bold uppercase tracking-tighter text-neutral-500">Past Events</h2>
                            <div className="h-[2px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
                        </div>
                        <div className="space-y-8">
                            {pastEvents.map(event => (
                                <SankalpCard key={event._id} event={event} isUpcoming={false} />
                            ))}
                        </div>
                    </section>
                </div>
            )}

            <AnimatePresence>
                {selectedEvent && (
                    <SankalpDetailsModal
                        event={selectedEvent}
                        onClose={() => setSelectedEvent(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Sankalp;

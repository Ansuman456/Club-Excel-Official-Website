import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight, FileText } from 'lucide-react';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const upcomingEvents = events.filter(event => event.status === 'upcoming');
    const pastEvents = events.filter(event => event.status !== 'upcoming');

    const EventCard = ({ event, isUpcoming }) => (
        <div
            data-aos="fade-up"
            className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-blue-500/30 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] transition-all duration-500 flex h-full"
        >
            {/* Left Side - Image */}
            <div className="w-2/5 relative overflow-hidden flex-shrink-0">
                {event.photos?.[0] ? (
                    <img
                        src={event.photos[0]}
                        alt={event.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center">
                        <Calendar className="w-12 h-12 text-blue-500 opacity-20" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#050505]/60"></div>
            </div>

            {/* Right Side - Content */}
            <div className="flex-1 p-8 flex flex-col relative">
                <div className="absolute top-6 right-6">
                    <span className={`px-4 py-1.5 rounded-full ${isUpcoming ? 'bg-blue-600' : 'bg-neutral-800'} text-white text-[10px] uppercase tracking-[0.2em] font-black border border-white/10`}>
                        {isUpcoming ? 'Upcoming' : 'Completed'}
                    </span>
                </div>

                <h3 className="text-3xl font-black mb-6 group-hover:text-blue-400 transition-colors duration-300 pr-24">
                    {event.name}
                </h3>

                {/* Event Details */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-3 text-neutral-400">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-neutral-600 font-black">Date</p>
                            <p className="text-sm font-bold text-white">{event.date}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-neutral-400">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-neutral-600 font-black">Time</p>
                            <p className="text-sm font-bold text-white">{event.time}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-neutral-400">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-neutral-600 font-black">Venue</p>
                            <p className="text-sm font-bold text-white">{event.vanue || 'TBA'}</p>
                        </div>
                    </div>
                </div>

                {/* Event Description */}
                <div className="bg-white/[0.02] rounded-2xl p-6 mb-6 border border-white/5 flex-1">
                    <div className="flex items-center gap-2 mb-3 text-blue-500">
                        <FileText className="w-4 h-4" />
                        <span className="text-[10px] uppercase tracking-[0.2em] font-black">Event Details</span>
                    </div>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                        {event.description}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 mt-auto">
                    {/* Dedicated WhatsApp Group Link */}
                    {event.whatsappGroup && (
                        <a
                            href={event.whatsappGroup}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-green-600 text-white font-black py-4 rounded-2xl hover:bg-green-500 transition-all duration-300 flex items-center justify-center gap-3 group/btn shadow-xl"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            JOIN WHATSAPP GROUP
                        </a>
                    )}
                    {/* External Link shown as WhatsApp Button (as requested) */}
                    {event.link && (
                        <a
                            href={event.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-green-600 text-white font-black py-4 rounded-2xl hover:bg-green-500 transition-all duration-300 flex items-center justify-center gap-3 group/btn shadow-xl"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            JOIN WHATSAPP GROUP
                        </a>
                    )}
                    {isUpcoming && (
                        <Link
                            to={`/register/event/${event._id}`}
                            className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-white hover:text-black transition-all duration-500 flex items-center justify-center gap-4 group/btn shadow-xl text-center"
                        >
                            REGISTER NOW
                            <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform" />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen">
            <div data-aos="fade-up" className="text-center mb-24">
                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-8 uppercase">
                    Events<span className="text-blue-500">.</span>
                </h1>
                <p className="text-neutral-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                    Celebrating tech, innovation, and community through our various initiatives.
                </p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-6">
                    <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="text-blue-400 font-bold uppercase tracking-widest text-xs animate-pulse">Syncing events...</p>
                </div>
            ) : (
                <div className="space-y-32">
                    {/* Upcoming Events Section */}
                    {upcomingEvents.length > 0 && (
                        <section>
                            <div className="flex items-center gap-6 mb-12">
                                <h2 className="text-3xl font-bold uppercase tracking-tighter">Upcoming Events</h2>
                                <div className="h-[2px] flex-1 bg-gradient-to-r from-blue-500/50 to-transparent"></div>
                            </div>
                            <div className="space-y-8">
                                {upcomingEvents.map(event => (
                                    <EventCard key={event._id} event={event} isUpcoming={true} />
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
                                <EventCard key={event._id} event={event} isUpcoming={false} />
                            ))}
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
};

export default Events;

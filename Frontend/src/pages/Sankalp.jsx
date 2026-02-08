import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Trophy, ArrowRight, ShieldCheck } from 'lucide-react';

const Sankalp = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const SankalpCard = ({ event, isUpcoming }) => (
        <div
            data-aos="fade-up"
            className="group relative bg-[#0a0a0a]/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-indigo-500/30 hover:shadow-[0_40px_80px_-20px_rgba(99,102,241,0.3)] transition-all duration-700 flex h-full"
        >
            {/* Left Side - Banner Image */}
            <div className="w-2/5 relative overflow-hidden bg-white/5 flex-shrink-0">
                {event.bannerImg ? (
                    <img
                        src={event.bannerImg}
                        alt={event.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                    />
                ) : (
                    <div className="w-full h-full bg-indigo-500/5 flex items-center justify-center">
                        <Trophy className="w-16 h-16 text-indigo-500 opacity-20" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0a]/60"></div>
            </div>

            {/* Right Side - Content */}
            <div className="flex-1 p-8 flex flex-col relative">
                <div className="absolute top-6 right-6">
                    <span className={`px-4 py-1.5 rounded-full ${isUpcoming ? 'bg-indigo-600' : 'bg-neutral-800'} text-white text-[10px] uppercase tracking-[0.2em] font-black border border-white/10`}>
                        {isUpcoming ? 'Upcoming' : 'Completed'}
                    </span>
                </div>

                <h3 className="text-3xl font-black mb-6 group-hover:text-indigo-400 transition-colors duration-300 pr-24">
                    {event.name}
                </h3>

                {/* Event Details */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-3 text-neutral-400">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-indigo-500" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-neutral-600 font-black">Date</p>
                            <p className="text-sm font-bold text-white">{event.date}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-neutral-400">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-indigo-500" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-neutral-600 font-black">Time</p>
                            <p className="text-sm font-bold text-white">{event.time}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-neutral-400">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-indigo-500" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-neutral-600 font-black">Venue</p>
                            <p className="text-sm font-bold text-white">{event.vanue}</p>
                        </div>
                    </div>
                </div>

                {/* Event Rules */}
                <div className="bg-white/[0.02] rounded-2xl p-6 mb-6 border border-white/5 flex-1">
                    <div className="flex items-center gap-2 mb-3 text-indigo-500">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-[10px] uppercase tracking-[0.2em] font-black">Event Rules</span>
                    </div>
                    <ul className="text-neutral-400 text-sm leading-relaxed space-y-2">
                        {event.rules.split('\n').filter(rule => rule.trim()).map((rule, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                                <span className="text-indigo-500 mt-1">•</span>
                                <span>{rule.trim()}</span>
                            </li>
                        ))}
                    </ul>
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
                            to={`/register/sankalp/${event._id}`}
                            className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-white hover:text-black transition-all duration-500 flex items-center justify-center gap-4 group/btn shadow-xl text-center"
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
                <div className="space-y-40">
                    {/* Upcoming Events Section */}
                    {upcomingEvents.length > 0 && (
                        <section>
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20 px-4">
                                <div>
                                    <h2 className="text-5xl font-black uppercase tracking-tighter mb-4">Upcoming Events</h2>
                                </div>
                                <div className="h-px hidden md:block flex-1 mx-20 bg-indigo-500/20"></div>
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
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20 px-4">
                            <div>
                                <h2 className="text-5xl font-black uppercase tracking-tighter mb-4 text-neutral-700">Past Events</h2>
                            </div>
                            <div className="h-px hidden md:block flex-1 mx-20 bg-white/5"></div>
                        </div>
                        <div className="space-y-8">
                            {pastEvents.map(event => (
                                <SankalpCard key={event._id} event={event} isUpcoming={false} />
                            ))}
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
};

export default Sankalp;

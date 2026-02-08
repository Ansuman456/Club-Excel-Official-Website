import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Trophy, Settings, LogOut, Hexagon } from 'lucide-react';
import AdminMembers from '../components/dashboard/AdminMembers';
import AdminEvents from '../components/dashboard/AdminEvents';
import AdminSankalpEvents from '../components/dashboard/AdminSankalpEvents';
import AdminEventRegistrations from '../components/dashboard/AdminEventRegistrations';
import AdminSankalpRegistrations from '../components/dashboard/AdminSankalpRegistrations';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({
        members: 0,
        events: 0,
        sankalp: 0
    });

    useEffect(() => {
        const adminUser = localStorage.getItem('adminUser');
        if (!adminUser) {
            navigate('/admin-login');
        } else {
            setUser(JSON.parse(adminUser));
            fetchStats();
        }
    }, [navigate]);

    const fetchStats = async () => {
        try {
            const [mRes, eRes, sRes] = await Promise.all([
                fetch('http://localhost:5000/api/members'),
                fetch('http://localhost:5000/api/event'),
                fetch('http://localhost:5000/api/sankalpevent')
            ]);

            const [m, e, s] = await Promise.all([
                mRes.json(),
                eRes.json(),
                sRes.json()
            ]);

            setStats({
                members: m.length,
                events: e.length,
                sankalp: s.length
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/');
    };

    if (!user) return null;

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'members', label: 'Members', icon: Users },
        { id: 'events', label: 'Events', icon: Calendar },
        { id: 'event-regs', label: 'Event Regs', icon: Users },
        { id: 'sankalp', label: 'Sankalp', icon: Trophy },
        { id: 'sankalp-regs', label: 'Sankalp Regs', icon: Users },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white flex">
            {/* Sidebar */}
            <div className="w-64 border-r border-white/10 bg-white/5 backdrop-blur-xl p-6 flex flex-col sticky top-0 h-screen">
                <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer" onClick={() => navigate('/')}>
                    <Hexagon className="w-6 h-6 fill-white" />
                    <span className="font-bold tracking-tight text-lg">ADMIN</span>
                </div>

                <nav className="flex-1 space-y-3">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full group flex items-center gap-4 px-5 py-3.5 rounded-2xl text-[11px] uppercase tracking-[0.2em] font-black transition-all duration-300 relative overflow-hidden ${isActive
                                    ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                                    : 'text-neutral-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-0 w-1 h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)]"></div>
                                )}
                                <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                <span className="relative z-10">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <button
                    onClick={handleLogout}
                    className="mt-auto flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl text-sm font-medium transition-all w-full text-left"
                >
                    <LogOut className="w-4 h-4" /> Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-10 overflow-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">
                            {activeTab === 'dashboard' ? `Welcome back, ${user.name}` : navItems.find(i => i.id === activeTab).label}
                        </h1>
                        <p className="text-neutral-500">
                            {activeTab === 'dashboard'
                                ? "Here's what's happening in Club Excel today."
                                : `Manage your ${activeTab} content here.`
                            }
                        </p>
                    </div>
                </header>

                {activeTab === 'dashboard' && (
                    <div className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] hover:border-blue-500/30 hover:bg-white/[0.05] transition-all duration-500 cursor-pointer overflow-hidden" onClick={() => setActiveTab('members')}>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-all duration-700"></div>
                                <p className="text-neutral-400 text-[10px] mb-2 uppercase tracking-[0.2em] font-black">Total Members</p>
                                <h3 className="text-5xl font-bold mb-4">{stats.members}</h3>
                                <div className="flex items-center text-[10px] text-blue-400 gap-2 font-black uppercase tracking-widest group-hover:gap-3 transition-all duration-300">
                                    <Users className="w-3 h-3" /> Manage Members →
                                </div>
                            </div>

                            <div className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] hover:border-indigo-500/30 hover:bg-white/[0.05] transition-all duration-500 cursor-pointer overflow-hidden" onClick={() => setActiveTab('events')}>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/20 transition-all duration-700"></div>
                                <p className="text-neutral-400 text-[10px] mb-2 uppercase tracking-[0.2em] font-black">Active Events</p>
                                <h3 className="text-5xl font-bold mb-4">{stats.events}</h3>
                                <div className="flex items-center text-[10px] text-indigo-400 gap-2 font-black uppercase tracking-widest group-hover:gap-3 transition-all duration-300">
                                    <Calendar className="w-3 h-3" /> Manage Events →
                                </div>
                            </div>

                            <div className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] hover:border-purple-500/30 hover:bg-white/[0.05] transition-all duration-500 cursor-pointer overflow-hidden" onClick={() => setActiveTab('sankalp')}>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/20 transition-all duration-700"></div>
                                <p className="text-neutral-400 text-[10px] mb-2 uppercase tracking-[0.2em] font-black">Sankalp Events</p>
                                <h3 className="text-5xl font-bold mb-4">{stats.sankalp}</h3>
                                <div className="flex items-center text-[10px] text-purple-400 gap-2 font-black uppercase tracking-widest group-hover:gap-3 transition-all duration-300">
                                    <Trophy className="w-3 h-3" /> Manage Sankalp →
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                            <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                                <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                                System Infrastructure
                            </h2>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
                                <div className="space-y-2">
                                    <p className="text-neutral-500 text-[10px] uppercase font-black tracking-[0.2em]">Operational Status</p>
                                    <div className="flex items-center gap-3 text-blue-400 text-sm font-black uppercase tracking-widest">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                        Live & Synchronized
                                    </div>
                                </div>
                                <div className="space-y-2 border-l border-white/5 pl-8">
                                    <p className="text-neutral-500 text-[10px] uppercase font-black tracking-[0.2em]">Data Architecture</p>
                                    <p className="text-sm font-black uppercase tracking-widest text-white">Cloud Engine</p>
                                </div>
                                <div className="space-y-2 border-l border-white/5 pl-8">
                                    <p className="text-neutral-500 text-[10px] uppercase font-black tracking-[0.2em]">Media Assets</p>
                                    <p className="text-sm font-black uppercase tracking-widest text-white">Distributed Node</p>
                                </div>
                                <div className="space-y-2 border-l border-white/5 pl-8">
                                    <p className="text-neutral-500 text-[10px] uppercase font-black tracking-[0.2em]">Last Deployment</p>
                                    <p className="text-sm font-black uppercase tracking-widest text-white">{new Date().toLocaleDateString('en-GB')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'members' && <AdminMembers />}
                {activeTab === 'events' && <AdminEvents />}
                {activeTab === 'event-regs' && <AdminEventRegistrations />}
                {activeTab === 'sankalp' && <AdminSankalpEvents />}
                {activeTab === 'sankalp-regs' && <AdminSankalpRegistrations />}
            </div>
        </div>
    );
};

export default AdminDashboard;

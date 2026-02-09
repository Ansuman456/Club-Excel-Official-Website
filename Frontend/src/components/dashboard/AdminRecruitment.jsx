import React, { useState, useEffect } from 'react';
import { Trash2, MessageCircle, User, Mail, Phone, Hash, BookOpen, Code, MapPin, Globe, Save, Loader2, Search, X, Edit2 } from 'lucide-react';
import Popup from '../ui/Popup';

const AdminRecruitment = () => {
    const [recruits, setRecruits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState({ whatsappLink: '' });
    const [updatingSettings, setUpdatingSettings] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentRecruit, setCurrentRecruit] = useState(null);
    const [editFormData, setEditFormData] = useState({
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
    const [updatingRecruit, setUpdatingRecruit] = useState(false);
    const [popup, setPopup] = useState({
        show: false,
        type: 'success',
        message: '',
        isConfirm: false,
        onConfirm: () => { }
    });

    useEffect(() => {
        fetchData();
        fetchSettings();
    }, []);

    const fetchData = async () => {
        const token = localStorage.getItem('adminToken');
        try {
            const response = await fetch('http://localhost:5000/api/recruitment', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (response.ok) {
                // In case the API returns { recruits: [...] } or similar in the future
                const recruitsList = Array.isArray(data) ? data : (data.recruits || []);
                setRecruits(recruitsList);
            } else {
                console.error('Recruitment API error:', data.message);
                setRecruits([]);
            }
        } catch (error) {
            console.error('Error fetching recruitment data:', error);
            setRecruits([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchSettings = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/recruitment/settings');
            const data = await response.json();
            if (response.ok) {
                setSettings({ whatsappLink: data.whatsappLink || '' });
            }
        } catch (error) {
            console.error('Error fetching recruitment settings:', error);
        }
    };

    const handleUpdateSettings = async (e) => {
        e.preventDefault();
        setUpdatingSettings(true);
        const token = localStorage.getItem('adminToken');
        try {
            const response = await fetch('http://localhost:5000/api/recruitment/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(settings)
            });

            if (response.ok) {
                setPopup({
                    show: true,
                    type: 'success',
                    message: 'Recruitment settings updated successfully!',
                    isConfirm: false
                });
            } else {
                setPopup({
                    show: true,
                    type: 'error',
                    message: 'Failed to update settings.',
                    isConfirm: false
                });
            }
        } catch (error) {
            console.error('Error updating settings:', error);
        } finally {
            setUpdatingSettings(false);
        }
    };

    const handleOpenEditModal = (recruit) => {
        setCurrentRecruit(recruit);
        setEditFormData({
            name: recruit.name || '',
            rollno: recruit.rollno || '',
            registrationno: recruit.registrationno || '',
            nistemail: recruit.nistemail || '',
            personalemail: recruit.personalemail || '',
            gender: recruit.gender || 'male',
            branch: recruit.branch || '',
            hackerRankId: recruit.hackerRankId || '',
            techstack: recruit.techstack || '',
            phoneno: recruit.phoneno || '',
            locality: recruit.locality || 'localite'
        });
        setShowEditModal(true);
    };

    const handleUpdateRecruit = async (e) => {
        e.preventDefault();
        setUpdatingRecruit(true);
        const token = localStorage.getItem('adminToken');
        try {
            const response = await fetch(`http://localhost:5000/api/recruitment/${currentRecruit._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editFormData)
            });

            if (response.ok) {
                setShowEditModal(false);
                setPopup({
                    show: true,
                    type: 'success',
                    message: 'Recruit data updated successfully!',
                    isConfirm: false
                });
                fetchData();
            } else {
                const data = await response.json();
                setPopup({
                    show: true,
                    type: 'error',
                    message: data.message || 'Failed to update recruit.',
                    isConfirm: false
                });
            }
        } catch (error) {
            console.error('Error updating recruit:', error);
            setPopup({
                show: true,
                type: 'error',
                message: 'An error occurred while updating.',
                isConfirm: false
            });
        } finally {
            setUpdatingRecruit(false);
        }
    };

    const handleDeleteRecruit = async (id) => {
        setPopup({
            show: true,
            type: 'confirm',
            message: 'Are you sure you want to delete this application? This action cannot be undone.',
            isConfirm: true,
            onConfirm: async () => {
                const token = localStorage.getItem('adminToken');
                try {
                    const response = await fetch(`http://localhost:5000/api/recruitment/${id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (response.ok) {
                        setPopup({
                            show: true,
                            type: 'success',
                            message: 'Application deleted successfully!',
                            isConfirm: false
                        });
                        setRecruits(prev => prev.filter(r => r._id !== id));
                    } else {
                        setPopup({
                            show: true,
                            type: 'error',
                            message: 'Failed to delete application',
                            isConfirm: false
                        });
                    }
                } catch (error) {
                    console.error('Error deleting recruit:', error);
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

    const filteredRecruits = (Array.isArray(recruits) ? recruits : []).filter(r => {
        const search = searchTerm.toLowerCase().trim();
        if (!search) return true;

        return (
            (r.name && r.name.toLowerCase().includes(search)) ||
            (r.rollno && r.rollno.toLowerCase().includes(search)) ||
            (r.branch && r.branch.toLowerCase().includes(search))
        );
    });

    return (
        <div className="space-y-10 pb-20">
            {/* Header & Settings */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8">
                    <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Recruitment Control</h2>
                    <p className="text-neutral-500 text-sm">Monitor applications and manage global recruitment configurations.</p>
                </div>

                <div className="lg:col-span-4 self-end">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <input
                            type="text"
                            placeholder="SEARCH BY NAME, ROLL OR BRANCH..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-xs font-black uppercase tracking-widest focus:outline-none focus:border-blue-500/50 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Quick Settings Card */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                    <div className="w-2 h-6 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                    Global Settings
                </h3>

                <form onSubmit={handleUpdateSettings} className="space-y-6 relative z-10">
                    <div className="space-y-2 max-w-2xl">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-black ml-1">Recruitment WhatsApp Group Link</label>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                                <input
                                    type="url"
                                    value={settings.whatsappLink}
                                    onChange={(e) => setSettings({ ...settings, whatsappLink: e.target.value })}
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium focus:outline-none focus:border-green-500/50 transition-all"
                                    placeholder="https://chat.whatsapp.com/..."
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={updatingSettings}
                                className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 min-w-[200px]"
                            >
                                {updatingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {updatingSettings ? 'Saving...' : 'Update Link'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Applications List */}
            <div className="space-y-6">
                <div className="flex items-center gap-4 px-2">
                    <div className="w-2 h-6 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    <h3 className="text-xl font-bold uppercase tracking-tight">Active Applications ({filteredRecruits.length})</h3>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredRecruits.map((recruit) => (
                            <div key={recruit._id} className="group relative bg-[#080808] border border-white/10 rounded-[2.5rem] p-8 hover:border-blue-500/30 transition-all duration-500 overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 blur-[60px] translate-x-1/4 -translate-y-1/4 group-hover:bg-blue-500/10 transition-all duration-700"></div>

                                <div className="flex flex-col lg:flex-row justify-between gap-10 relative z-10">
                                    {/* Primary Info */}
                                    <div className="space-y-6 flex-1">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-3xl bg-blue-500/10 flex items-center justify-center border border-blue-500/10 group-hover:bg-blue-500/20 group-hover:scale-105 transition-all duration-500">
                                                <User className="w-8 h-8 text-blue-500" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h4 className="text-2xl font-black tracking-tight">{recruit.name}</h4>
                                                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-neutral-400">{recruit.gender}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-xs font-black uppercase tracking-widest text-neutral-500">
                                                    <span className="flex items-center gap-2"><Hash className="w-3 h-3 text-blue-500/50" /> {recruit.rollno}</span>
                                                    <span className="flex items-center gap-2"><BookOpen className="w-3 h-3 text-blue-500/50" /> {recruit.branch}</span>
                                                    <span className="flex items-center gap-2"><MapPin className="w-3 h-3 text-blue-500/50" /> {recruit.locality}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                                            <div className="space-y-2">
                                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-600">Contact Channels</p>
                                                <div className="space-y-1">
                                                    <p className="text-xs font-medium text-neutral-300 flex items-center gap-2"><Mail className="w-3 h-3 text-blue-400/50" /> {recruit.nistemail}</p>
                                                    <p className="text-[10px] text-neutral-500 flex items-center gap-2 ml-5">{recruit.personalemail}</p>
                                                    <p className="text-xs font-medium text-neutral-300 flex items-center gap-2 mt-2"><Phone className="w-3 h-3 text-green-400/50" /> {recruit.phoneno}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-2 border-l border-white/5 pl-6">
                                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-600">Academic / Technical</p>
                                                <div className="space-y-1">
                                                    <p className="text-xs font-medium text-neutral-300 flex items-center gap-2 uppercase italic tracking-wider"><Hash className="w-3 h-3 text-purple-400/50" /> Reg: {recruit.registrationno}</p>
                                                    <p className="text-xs font-medium text-neutral-300 flex items-center gap-2"><Code className="w-3 h-3 text-yellow-400/50" /> Hackerrank: {recruit.hackerRankId}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-2 border-l border-white/5 pl-6">
                                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-600">Interests / Focus</p>
                                                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                                                    <p className="text-[10px] text-neutral-400 leading-relaxed font-medium line-clamp-2">"{recruit.techstack}"</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex lg:flex-col gap-3 justify-center border-l border-white/5 pl-10">
                                        <button
                                            onClick={() => handleOpenEditModal(recruit)}
                                            className="p-5 bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white rounded-[1.5rem] transition-all duration-500 group/edit"
                                            title="Edit Application"
                                        >
                                            <Edit2 className="w-6 h-6 group-hover/edit:scale-110 transition-transform" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteRecruit(recruit._id)}
                                            className="p-5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-[1.5rem] transition-all duration-500 group/del"
                                            title="Delete Application"
                                        >
                                            <Trash2 className="w-6 h-6 group-hover/del:scale-110 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredRecruits.length === 0 && (
                            <div className="text-center py-20 bg-white/[0.03] rounded-[3rem] border border-dashed border-white/10">
                                <X className="w-10 h-10 text-neutral-700 mx-auto mb-4" />
                                <p className="text-neutral-500 uppercase font-black tracking-widest text-xs">No applications match your criteria.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowEditModal(false)}></div>
                    <div className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                            <div>
                                <h3 className="text-xl font-bold">Edit Application</h3>
                                <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-black mt-1">Ref ID: {currentRecruit?._id}</p>
                            </div>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="p-2 hover:bg-white/5 rounded-full transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateRecruit} className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
                            {/* Personal Info */}
                            <div className="space-y-6">
                                <h4 className="text-[10px] uppercase tracking-[0.2em] text-blue-500 font-black flex items-center gap-2">
                                    <User className="w-3 h-3" /> Personal Identity
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black text-neutral-500 ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={editFormData.name}
                                            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-all font-medium"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black text-neutral-500 ml-1">Gender</label>
                                        <select
                                            value={editFormData.gender}
                                            onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-all font-medium appearance-none cursor-pointer"
                                        >
                                            <option value="male" className="bg-[#121212]">Male</option>
                                            <option value="female" className="bg-[#121212]">Female</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Academic Details */}
                            <div className="space-y-6">
                                <h4 className="text-[10px] uppercase tracking-[0.2em] text-purple-500 font-black flex items-center gap-2">
                                    <BookOpen className="w-3 h-3" /> Academic Profile
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black text-neutral-500 ml-1">Roll No / SID</label>
                                        <input
                                            type="text"
                                            value={editFormData.rollno}
                                            onChange={(e) => setEditFormData({ ...editFormData, rollno: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-all font-medium"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black text-neutral-500 ml-1">Reg No</label>
                                        <input
                                            type="text"
                                            value={editFormData.registrationno}
                                            onChange={(e) => setEditFormData({ ...editFormData, registrationno: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-all font-medium"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black text-neutral-500 ml-1">Branch</label>
                                        <input
                                            type="text"
                                            value={editFormData.branch}
                                            onChange={(e) => setEditFormData({ ...editFormData, branch: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-all font-medium"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contact Details */}
                            <div className="space-y-6">
                                <h4 className="text-[10px] uppercase tracking-[0.2em] text-green-500 font-black flex items-center gap-2">
                                    <Phone className="w-3 h-3" /> Connectivity
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 shadow-sm">
                                        <label className="text-[10px] uppercase font-black text-neutral-500 ml-1">NIST Email</label>
                                        <input
                                            type="email"
                                            value={editFormData.nistemail}
                                            onChange={(e) => setEditFormData({ ...editFormData, nistemail: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-all font-medium"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black text-neutral-500 ml-1">Personal Email</label>
                                        <input
                                            type="email"
                                            value={editFormData.personalemail}
                                            onChange={(e) => setEditFormData({ ...editFormData, personalemail: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-all font-medium"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black text-neutral-500 ml-1">Phone No</label>
                                        <input
                                            type="tel"
                                            value={editFormData.phoneno}
                                            onChange={(e) => setEditFormData({ ...editFormData, phoneno: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-all font-medium"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black text-neutral-500 ml-1">Locality</label>
                                        <select
                                            value={editFormData.locality}
                                            onChange={(e) => setEditFormData({ ...editFormData, locality: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-all font-medium appearance-none cursor-pointer"
                                        >
                                            <option value="localite" className="bg-[#121212]">Localite</option>
                                            <option value="hostelite" className="bg-[#121212]">Hostelite</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Technical Details */}
                            <div className="space-y-6">
                                <h4 className="text-[10px] uppercase tracking-[0.2em] text-yellow-500 font-black flex items-center gap-2">
                                    <Code className="w-3 h-3" /> Skills & IDs
                                </h4>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black text-neutral-500 ml-1">HackerRank ID</label>
                                        <input
                                            type="text"
                                            value={editFormData.hackerRankId}
                                            onChange={(e) => setEditFormData({ ...editFormData, hackerRankId: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-all font-medium"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black text-neutral-500 ml-1">Tech Stack / Interest</label>
                                        <textarea
                                            value={editFormData.techstack}
                                            onChange={(e) => setEditFormData({ ...editFormData, techstack: e.target.value })}
                                            className="w-full min-h-[100px] bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-all font-medium resize-none"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={updatingRecruit}
                                    className="w-full bg-white text-black font-black uppercase tracking-widest text-xs py-5 rounded-2xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {updatingRecruit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    {updatingRecruit ? 'Updating Member Data...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
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

export default AdminRecruitment;

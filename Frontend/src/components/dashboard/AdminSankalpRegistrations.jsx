import React, { useState, useEffect } from 'react';
import { Users, Edit2, Trash2, X, User, Mail, Phone, Hash, Home, Search } from 'lucide-react';
import Popup from '../ui/Popup';

const AdminSankalpRegistrations = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentReg, setCurrentReg] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        eventname: '',
        fullname: '',
        email: '',
        phoneno: '',
        rollno: '',
        locality: 'hostelite'
    });
    const [submitting, setSubmitting] = useState(false);
    const [popup, setPopup] = useState({
        show: false,
        type: 'success',
        message: '',
        isConfirm: false,
        onConfirm: () => { }
    });

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        const token = localStorage.getItem('adminToken');
        try {
            const response = await fetch('http://localhost:5000/api/sankalpregisters', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setRegistrations(data);
        } catch (error) {
            console.error('Error fetching registrations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (reg = null) => {
        if (reg) {
            setCurrentReg(reg);
            setFormData({
                eventname: reg.eventname,
                fullname: reg.fullname,
                email: reg.email,
                phoneno: reg.phoneno,
                rollno: reg.rollno,
                locality: reg.locality
            });
        } else {
            setCurrentReg(null);
            setFormData({
                eventname: '',
                fullname: '',
                email: '',
                phoneno: '',
                rollno: '',
                locality: 'hostelite'
            });
        }
        setShowModal(true);
        setSubmitting(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const token = localStorage.getItem('adminToken');
        const url = currentReg
            ? `http://localhost:5000/api/sankalpregisters/${currentReg._id}`
            : 'http://localhost:5000/api/sankalpregisters';
        const method = currentReg ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setShowModal(false);
                setPopup({
                    show: true,
                    type: 'success',
                    message: currentReg ? 'Registration updated successfully!' : 'Registration added successfully!',
                    isConfirm: false
                });
                fetchRegistrations();
            } else {
                const error = await response.json();
                setPopup({
                    show: true,
                    type: 'error',
                    message: error.message || 'Something went wrong',
                    isConfirm: false
                });
            }
        } catch (error) {
            console.error('Error saving registration:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        setPopup({
            show: true,
            type: 'confirm',
            message: 'Are you sure you want to delete this registration? This action cannot be undone.',
            isConfirm: true,
            onConfirm: async () => {
                const token = localStorage.getItem('adminToken');
                try {
                    const response = await fetch(`http://localhost:5000/api/sankalpregisters/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        setPopup({
                            show: true,
                            type: 'success',
                            message: 'Registration deleted successfully!',
                            isConfirm: false
                        });
                        fetchRegistrations();
                    } else {
                        setPopup({
                            show: true,
                            type: 'error',
                            message: 'Failed to delete registration',
                            isConfirm: false
                        });
                    }
                } catch (error) {
                    console.error('Error deleting registration:', error);
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

    const filteredRegistrations = registrations.filter(reg =>
        reg.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.eventname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.rollno.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                        <Users className="w-5 h-5 text-indigo-500" />
                    </div>
                    <h2 className="text-2xl font-bold">Sankalp Registrations</h2>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, email, event, or roll number..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500/30"
                />
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-neutral-500 font-bold">Event</th>
                                <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-neutral-500 font-bold">Name</th>
                                <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-neutral-500 font-bold">Email</th>
                                <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-neutral-500 font-bold">Phone</th>
                                <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-neutral-500 font-bold">Roll No</th>
                                <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-neutral-500 font-bold">Locality</th>
                                <th className="text-right py-3 px-4 text-xs uppercase tracking-wider text-neutral-500 font-bold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRegistrations.map((reg) => (
                                <tr key={reg._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="py-3 px-4 text-sm font-medium">{reg.eventname}</td>
                                    <td className="py-3 px-4 text-sm">{reg.fullname}</td>
                                    <td className="py-3 px-4 text-sm text-neutral-400">{reg.email}</td>
                                    <td className="py-3 px-4 text-sm text-neutral-400">{reg.phoneno}</td>
                                    <td className="py-3 px-4 text-sm text-neutral-400">{reg.rollno}</td>
                                    <td className="py-3 px-4 text-sm">
                                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${reg.locality === 'hostelite' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-blue-500/10 text-blue-400'
                                            }`}>
                                            {reg.locality}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenModal(reg)}
                                                className="p-2 hover:bg-white/5 rounded-lg transition-all"
                                            >
                                                <Edit2 className="w-4 h-4 text-indigo-400" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(reg._id)}
                                                className="p-2 hover:bg-white/5 rounded-lg transition-all"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-400" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredRegistrations.length === 0 && (
                        <div className="text-center py-12 text-neutral-500">
                            No registrations found
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !submitting && setShowModal(false)}></div>
                    <div className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0a0a0a] sticky top-0 z-10">
                            <h3 className="text-xl font-bold">{currentReg ? 'Edit Registration' : 'Add Registration'}</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-white/5 rounded-full transition-all disabled:opacity-50"
                                disabled={submitting}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-1 p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Event Name</label>
                                        <input
                                            type="text"
                                            value={formData.eventname}
                                            onChange={(e) => setFormData({ ...formData, eventname: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/30 disabled:opacity-50"
                                            required
                                            disabled={submitting}
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={formData.fullname}
                                            onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/30 disabled:opacity-50"
                                            required
                                            disabled={submitting}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Email</label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/30 disabled:opacity-50"
                                                required
                                                disabled={submitting}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Phone</label>
                                            <input
                                                type="tel"
                                                value={formData.phoneno}
                                                onChange={(e) => setFormData({ ...formData, phoneno: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/30 disabled:opacity-50"
                                                required
                                                disabled={submitting}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Roll Number</label>
                                            <input
                                                type="text"
                                                value={formData.rollno}
                                                onChange={(e) => setFormData({ ...formData, rollno: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/30 disabled:opacity-50"
                                                required
                                                disabled={submitting}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Locality</label>
                                            <select
                                                value={formData.locality}
                                                onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500/30 disabled:opacity-50"
                                                disabled={submitting}
                                            >
                                                <option value="hostelite">Hostelite</option>
                                                <option value="localite">Localite</option>
                                            </select>
                                        </div>
                                    </div>

                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all disabled:opacity-50"
                                        disabled={submitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-all disabled:opacity-50"
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Saving...' : currentReg ? 'Update' : 'Add'}
                                    </button>
                                </div>
                            </form>
                        </div>
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

export default AdminSankalpRegistrations;

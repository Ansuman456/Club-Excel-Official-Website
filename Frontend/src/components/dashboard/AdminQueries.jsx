import React, { useState, useEffect } from 'react';
import { Mail, Phone, User, Trash2, Edit2, X, MessageSquare } from 'lucide-react';
import Popup from '../ui/Popup';

const AdminQueries = () => {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentQuery, setCurrentQuery] = useState(null);
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
        message: '',
        isConfirm: false,
        onConfirm: () => { }
    });

    useEffect(() => {
        fetchQueries();
    }, []);

    const fetchQueries = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('http://localhost:5000/api/contacts', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setQueries(data);
        } catch (error) {
            console.error('Error fetching queries:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (query) => {
        setCurrentQuery(query);
        setFormData({
            firstname: query.firstname,
            lastname: query.lastname,
            email: query.email,
            phone: query.phone,
            message: query.message
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const token = localStorage.getItem('adminToken');

        try {
            const response = await fetch(`http://localhost:5000/api/contacts/${currentQuery._id}`, {
                method: 'PUT',
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
                    message: 'Query updated successfully!',
                    isConfirm: false
                });
                fetchQueries();
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
            console.error('Error updating query:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        setPopup({
            show: true,
            type: 'confirm',
            message: 'Are you sure you want to delete this query? This action cannot be undone.',
            isConfirm: true,
            onConfirm: async () => {
                const token = localStorage.getItem('adminToken');
                try {
                    const response = await fetch(`http://localhost:5000/api/contacts/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        setPopup({
                            show: true,
                            type: 'success',
                            message: 'Query deleted successfully!',
                            isConfirm: false
                        });
                        fetchQueries();
                    } else {
                        setPopup({
                            show: true,
                            type: 'error',
                            message: 'Failed to delete query',
                            isConfirm: false
                        });
                    }
                } catch (error) {
                    console.error('Error deleting query:', error);
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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">User Queries</h2>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {queries.map((query) => (
                        <div key={query._id} className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 hover:border-blue-500/30 transition-all duration-500">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                                            <User className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">{query.firstname} {query.lastname}</h3>
                                            <p className="text-neutral-500 text-sm font-medium">{new Date(query.createdAt).toLocaleDateString()} at {new Date(query.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-6 mt-4">
                                        <div className="flex items-center gap-2 text-neutral-400 group-hover:text-blue-400/80 transition-colors">
                                            <Mail className="w-4 h-4" />
                                            <span className="text-sm font-medium tracking-tight">{query.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-neutral-400 group-hover:text-blue-400/80 transition-colors">
                                            <Phone className="w-4 h-4" />
                                            <span className="text-sm font-medium tracking-tight">{query.phone}</span>
                                        </div>
                                    </div>

                                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 mt-4 relative group-hover:bg-white/[0.04] transition-all duration-300">
                                        <div className="flex items-center gap-2 mb-2 text-blue-500/80 font-black uppercase tracking-[0.2em] text-[10px]">
                                            <MessageSquare className="w-3 h-3" /> Message
                                        </div>
                                        <p className="text-neutral-300 text-sm leading-relaxed italic">"{query.message}"</p>
                                    </div>
                                </div>

                                <div className="flex md:flex-col gap-3 justify-center">
                                    <button
                                        onClick={() => handleOpenModal(query)}
                                        className="p-4 bg-white/5 hover:bg-white text-white hover:text-black rounded-2xl transition-all duration-300"
                                        title="Edit Query"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(query._id)}
                                        className="p-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl transition-all duration-300"
                                        title="Delete Query"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {queries.length === 0 && (
                        <div className="text-center py-20 bg-white/[0.03] rounded-[2.5rem] border border-dashed border-white/10">
                            <p className="text-neutral-500 uppercase font-black tracking-widest text-xs">No queries found in the cloud.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !submitting && setShowModal(false)}></div>
                    <div className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center">
                            <h3 className="text-2xl font-black uppercase tracking-tighter">Edit Query</h3>
                            <button
                                onClick={() => !submitting && setShowModal(false)}
                                className="p-2 hover:bg-white/5 rounded-full transition-all"
                                disabled={submitting}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black ml-1">First Name</label>
                                    <input
                                        type="text"
                                        value={formData.firstname}
                                        onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-all font-medium"
                                        required
                                        disabled={submitting}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black ml-1">Last Name</label>
                                    <input
                                        type="text"
                                        value={formData.lastname}
                                        onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-all font-medium"
                                        required
                                        disabled={submitting}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black ml-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-all font-medium"
                                    required
                                    disabled={submitting}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black ml-1">Phone</label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-all font-medium"
                                    required
                                    disabled={submitting}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-black ml-1">Message</label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-all font-medium min-h-[120px] resize-none"
                                    required
                                    disabled={submitting}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-4 uppercase tracking-[0.2em] text-[11px]"
                            >
                                {submitting ? (
                                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                                ) : (
                                    'Update Query'
                                )}
                            </button>
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

export default AdminQueries;

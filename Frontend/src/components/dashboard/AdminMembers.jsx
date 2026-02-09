import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Upload, Linkedin } from 'lucide-react';
import Popup from '../ui/Popup';

const AdminMembers = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentMember, setCurrentMember] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        category: 'member',
        linkedin: '',
        color: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [submitting, setSubmitting] = useState(false);
    const [popup, setPopup] = useState({
        show: false,
        type: 'success',
        message: '',
        isConfirm: false,
        onConfirm: () => { }
    });

    const categories = ['member', 'alumni', 'advisor'];

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/members');
            const data = await response.json();
            setMembers(data);
        } catch (error) {
            console.error('Error fetching members:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (member = null) => {
        if (member) {
            setCurrentMember(member);
            setFormData({
                name: member.name,
                role: member.role,
                category: member.category,
                linkedin: member.linkedin || '',
                color: member.color || ''
            });
            setImagePreview(member.img);
        } else {
            setCurrentMember(null);
            setFormData({
                name: '',
                role: '',
                category: 'member',
                linkedin: '',
                color: ''
            });
            setImagePreview(null);
        }
        setImageFile(null);
        setShowModal(true);
        setSubmitting(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const token = localStorage.getItem('adminToken');

        const data = new FormData();
        data.append('name', formData.name);
        data.append('role', formData.role);
        data.append('category', formData.category);
        data.append('linkedin', formData.linkedin);
        data.append('color', formData.color);
        if (imageFile) {
            data.append('img', imageFile);
        }

        try {
            const url = currentMember
                ? `http://localhost:5000/api/members/${currentMember._id}`
                : 'http://localhost:5000/api/members';

            const method = currentMember ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: data
            });

            if (response.ok) {
                setShowModal(false);
                setPopup({
                    show: true,
                    type: 'success',
                    message: currentMember ? 'Member updated successfully!' : 'Member created successfully!',
                    isConfirm: false
                });
                fetchMembers();
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
            console.error('Error saving member:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        setPopup({
            show: true,
            type: 'confirm',
            message: 'Are you sure you want to delete this member? This action cannot be undone.',
            isConfirm: true,
            onConfirm: async () => {
                const token = localStorage.getItem('adminToken');
                try {
                    const response = await fetch(`http://localhost:5000/api/members/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        setPopup({
                            show: true,
                            type: 'success',
                            message: 'Member deleted successfully!',
                            isConfirm: false
                        });
                        fetchMembers();
                    } else {
                        setPopup({
                            show: true,
                            type: 'error',
                            message: 'Failed to delete member',
                            isConfirm: false
                        });
                    }
                } catch (error) {
                    console.error('Error deleting member:', error);
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
                <h2 className="text-2xl font-bold">Manage Members</h2>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-xl font-semibold hover:bg-neutral-200 transition-all"
                >
                    <Plus className="w-4 h-4" /> Add Member
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {members.map((member) => (
                        <div key={member._id} className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-blue-500/30 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] hover:-translate-y-2 transition-all duration-500 flex flex-col">
                            <div className="h-60 relative overflow-hidden bg-white/5">
                                <img src={member.img} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-4 backdrop-blur-[2px]">
                                    <button
                                        onClick={() => handleOpenModal(member)}
                                        className="p-3 bg-white/10 hover:bg-white text-black rounded-full backdrop-blur-md transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(member._id)}
                                        className="p-3 bg-red-500/10 hover:bg-red-500 text-white rounded-full backdrop-blur-md transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <span className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold mb-2 inline-block">{member.category}</span>
                                <h3 className="text-xl font-bold mb-1 group-hover:text-blue-400 transition-colors duration-300">{member.name}</h3>
                                <p className="text-neutral-400 text-sm font-medium mb-4">{member.role}</p>

                                {member.linkedin && (
                                    <a
                                        href={member.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-auto pt-5 border-t border-white/5 flex items-center justify-between text-neutral-500 hover:text-blue-400 transition-all duration-300 group/link"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover/link:bg-blue-400 group-hover/link:text-black transition-colors">
                                                <Linkedin className="w-4 h-4" />
                                            </div>
                                            <span className="text-xs font-bold uppercase tracking-widest">Connect</span>
                                        </div>
                                        <div className="opacity-0 group-hover/link:opacity-100 transform -translate-x-2 group-hover/link:translate-x-0 transition-all">→</div>
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                    <div className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center">
                            <h3 className="text-xl font-bold">{currentMember ? 'Edit Member' : 'Add New Member'}</h3>
                            <button
                                onClick={() => !submitting && setShowModal(false)}
                                className={`p-2 hover:bg-white/5 rounded-full transition-all ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={submitting}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="flex justify-center mb-6">
                                <div className="relative group">
                                    <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-dashed border-white/20 group-hover:border-white/40 transition-all">
                                        {imagePreview ? (
                                            <img src={imagePreview} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500">
                                                <Upload className="w-6 h-6 mb-2" />
                                                <span className="text-[10px] uppercase font-bold">Upload Photo</span>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        onChange={handleImageChange}
                                        className={`absolute inset-0 opacity-0 cursor-pointer ${submitting ? 'cursor-not-allowed' : ''}`}
                                        required={!currentMember}
                                        disabled={submitting}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-white/20 disabled:opacity-50"
                                        required
                                        disabled={submitting}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-white/20 appearance-none cursor-pointer disabled:opacity-50"
                                        disabled={submitting}
                                    >
                                        {categories.map(cat => <option key={cat} value={cat} className="bg-[#121212] text-white">{cat}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold ml-1">Role / Designation</label>
                                <input
                                    type="text"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-white/20 disabled:opacity-50"
                                    required
                                    placeholder="e.g. Core Member, President"
                                    disabled={submitting}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold ml-1">LinkedIn URL</label>
                                <input
                                    type="url"
                                    value={formData.linkedin}
                                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-white/20 disabled:opacity-50"
                                    placeholder="https://linkedin.com/in/..."
                                    disabled={submitting}
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                                            {currentMember ? 'Updating...' : 'Creating...'}
                                        </>
                                    ) : (
                                        currentMember ? 'Update Member' : 'Create Member'
                                    )}
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

export default AdminMembers;

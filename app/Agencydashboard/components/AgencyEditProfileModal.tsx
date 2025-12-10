'use client';

import { useState, useRef } from 'react';
import { X, Save, Building2, Phone, MapPin, Globe, Calendar, Users, Briefcase, Upload, Loader2, Facebook, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface AgencyEditProfileModalProps {
    agencyData: any; 
    onClose: () => void;
    onUpdateSuccess: () => void;
}

const API_BASE_URL = 'http://localhost:5000/api';

export function AgencyEditProfileModal({ agencyData, onClose, onUpdateSuccess }: AgencyEditProfileModalProps) {
    const [loading, setLoading] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [rcDocumentFile, setRcDocumentFile] = useState<File | null>(null);

    const getInitialUrl = (path: string | undefined) => {
        if (!path) return null;
        return path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
    };
    
    const [logoPreview, setLogoPreview] = useState<string | null>(getInitialUrl(agencyData.logo));
    
    const [rcDocumentName, setRcDocumentName] = useState<string>(
        agencyData.rcDocument 
            ? (agencyData.rcDocument.startsWith('http') ? 'Current document uploaded' : 'Current document selected')
            : 'No document selected'
    );

    const logoInputRef = useRef<HTMLInputElement>(null);
    const rcDocumentInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        agencyName: agencyData.agencyName || '',
        email: agencyData.email || '',
        phoneNumber: agencyData.phoneNumber || '',
        websiteUrl: agencyData.websiteUrl || '',
        country: agencyData.country || '',
        city: agencyData.city || '',
        streetAddress: agencyData.streetAddress || '',
        postalCode: agencyData.postalCode || '',
        businessRegistrationNumber: agencyData.businessRegistrationNumber || '',
        industry: agencyData.industry || '',
        companySize: agencyData.companySize || '',
        yearEstablished: agencyData.yearEstablished || '',
        fullName: agencyData.fullName || '',
        jobTitle: agencyData.jobTitle || '',
        servicesOffered: JSON.stringify(agencyData.servicesOffered || []),
        facebookUrl: agencyData.facebookUrl || '',
        linkedinUrl: agencyData.linkedinUrl || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setLogoFile(file);
        
        const reader = new FileReader();
        reader.onloadend = () => setLogoPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleRcDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setRcDocumentFile(file || null);
        setRcDocumentName(file ? file.name : (agencyData.rcDocument ? 'Current document uploaded' : 'No document selected'));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const submissionData = new FormData();
            
            Object.keys(formData).forEach(key => {
                submissionData.append(key, (formData as any)[key]);
            });

            if (logoFile) {
                submissionData.append('logo', logoFile); 
            }
            if (rcDocumentFile) {
                submissionData.append('rcDocument', rcDocumentFile); 
            }

            const token = localStorage.getItem('token');

            const response = await fetch(`${API_BASE_URL}/agencies/profile`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
                body: submissionData,
            });

            if (response.ok) {
                alert('Agency profile updated successfully!');
                onUpdateSuccess();
            } else {
                const data = await response.json();
                throw new Error(data.error || 'Profile update failed.');
            }
        } catch (error) {
            console.error('Update error:', error);
            alert('Update failed. Please check the console.');
        } finally {
            setLoading(false);
        }
    };
    
    const CompanySizeOptions = ['1-10', '11-50', '51-200', '201-500', '500+'];

    return (
        // CRITICAL FIX: Increase Z-index significantly to overlay the map (z-[9999])
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-teal-500/30 shadow-2xl shadow-teal-500/20">
                
                {/* Header */}
                <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Building2 className="w-6 h-6 text-teal-400" />
                        <h2 className="text-2xl font-bold text-white">Edit Agency Profile</h2>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 hover:bg-slate-800/50 rounded-lg transition-all text-slate-400 hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                {/* Form Content */}
                <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-88px)] p-6 space-y-6">

                    {/* === 1. Logo and Documents Upload === */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-slate-700/50 pb-6">
                        
                        {/* Logo Upload */}
                        <div className="flex flex-col items-center col-span-1">
                            <label className="text-sm font-medium text-slate-300 mb-3">Agency Logo (Image)</label>
                            <div
                                className="w-24 h-24 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center cursor-pointer hover:border-teal-400 transition-all relative overflow-hidden group bg-slate-900/50"
                                onClick={() => logoInputRef.current?.click()}
                            >
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <Upload className="w-10 h-10 text-teal-400" />
                                )}
                                <input type="file" ref={logoInputRef} className="hidden" name="logo" accept="image/*" onChange={handleLogoFileChange} />
                            </div>
                            <p className="text-xs text-slate-400 mt-2">{logoFile ? logoFile.name : (agencyData.logo ? 'Current logo uploaded' : 'Click to upload')}</p>
                        </div>
                        
                        {/* RC Document Upload */}
                        <div className="flex flex-col justify-center col-span-2 space-y-2">
                            <label className="text-sm font-medium text-slate-300 mb-1">Business Registration Document (RC)</label>
                            <div
                                className="flex items-center justify-between p-3 rounded-lg border border-slate-700 bg-slate-800 cursor-pointer hover:border-teal-400 transition-all"
                                onClick={() => rcDocumentInputRef.current?.click()}
                            >
                                <span className="text-sm text-slate-400 truncate flex-1">{rcDocumentName}</span>
                                <Upload className="w-5 h-5 text-teal-400 flex-shrink-0 ml-4" />
                                <input type="file" ref={rcDocumentInputRef} className="hidden" name="rcDocument" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={handleRcDocumentChange} />
                            </div>
                            <p className="text-xs text-gray-500">Max 10MB. PDF, DOCX, or Image formats preferred.</p>
                        </div>
                    </div>


                    {/* === 2. Core Contact and Location === */}
                    <h3 className="text-lg font-semibold text-white pt-2">Core Contact Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup Icon={Building2} label="Agency Name" name="agencyName" value={formData.agencyName} onChange={handleChange} required={true} />
                        <InputGroup Icon={Mail} label="Contact Email" name="email" value={formData.email} onChange={handleChange} required={true} type="email" />
                        <InputGroup Icon={Phone} label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required={true} />
                        <InputGroup Icon={Globe} label="Website URL" name="websiteUrl" value={formData.websiteUrl} onChange={handleChange} required={false} type="url" />
                        <InputGroup Icon={MapPin} label="Country" name="country" value={formData.country} onChange={handleChange} required={true} />
                        <InputGroup Icon={MapPin} label="City/Address" name="city" value={formData.city} onChange={handleChange} required={true} />
                    </div>

                    {/* === 3. Company Details and Socials === */}
                    <h3 className="text-lg font-semibold text-white pt-4 border-t border-slate-700/50">Details & Socials</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup Icon={Briefcase} label="Industry" name="industry" value={formData.industry} onChange={handleChange} required={true} />
                        
                        {/* Company Size Select */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Company Size</label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 z-10" />
                                <select
                                    name="companySize"
                                    value={formData.companySize}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-700/50 bg-slate-800/50 text-white focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20 transition-all"
                                >
                                    <option value="">Select size</option>
                                    {CompanySizeOptions.map(size => <option key={size} value={size}>{size} employees</option>)}
                                </select>
                            </div>
                        </div>

                        <InputGroup Icon={Calendar} label="Year Established" name="yearEstablished" value={formData.yearEstablished} onChange={handleChange} required={false} type="number" />
                        <InputGroup Icon={Building2} label="Reg. Number" name="businessRegistrationNumber" value={formData.businessRegistrationNumber} onChange={handleChange} required={true} />
                        <InputGroup Icon={Facebook} label="Facebook URL" name="facebookUrl" value={formData.facebookUrl} onChange={handleChange} required={false} type="url" />
                        <InputGroup Icon={Linkedin} label="LinkedIn URL" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} required={false} type="url" />
                    </div>
                    
                    {/* === 4. Submit Button === */}
                    <div className="flex gap-4 pt-6 border-t border-slate-700/50">
                        <Button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-lg bg-slate-800/50 text-slate-300 hover:bg-slate-800 border border-slate-700/50 transition-all font-medium"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 rounded-lg bg-teal-500 hover:bg-teal-600 text-white transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-500/30"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Reusable Input Component Group (Used in both modal and viewing section)
const InputGroup = ({ Icon, label, name, value, onChange, required = false, type = 'text' }: any) => (
    <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
            {label} {required && <span className="text-red-400">*</span>}
        </label>
        <div className="relative">
            <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 z-10" />
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={label}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-700/50 bg-slate-800/50 text-white placeholder-slate-500 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20 transition-all"
            />
        </div>
    </div>
);
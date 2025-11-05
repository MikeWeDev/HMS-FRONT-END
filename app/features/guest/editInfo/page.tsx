'use client';

import React, { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Phone, Loader2, Save, AlertTriangle, ArrowLeft,Edit3 } from 'lucide-react';
import Link from 'next/link';

// --- INTERFACES (Re-used/Modified) ---
interface GuestProfile {
    _id: string;
    name: string;
    email: string;
    phone: string;
    loyaltyPoints: number; // Read-only on the edit page
}

// State for the form, which only includes editable fields
interface EditProfileForm {
    name: string;
    email: string;
    phone: string;
}

// --- COMPONENT ---

const EditGuestProfilePage = () => {
    const [formData, setFormData] = useState<EditProfileForm>({ name: '', email: '', phone: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const API_URL_FETCH = process.env.NEXT_PUBLIC_API_URL || "https://hms-backend-2k1m.onrender.com/api/guest/profile";
    const API_URL_UPDATE = process.env.NEXT_PUBLIC_API_URL_UPDATE || "https://hms-backend-2k1m.onrender.com/api/guest/update"; // New Update Endpoint

    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

    // --- 1. FETCH CURRENT DATA (Reusing the logic from the GuestProfilePage) ---
    useEffect(() => {
        if (!userId) {
            setError("User ID not found. Please log in.");
            setIsLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await fetch(API_URL_FETCH, {
                    method: 'POST', // POST for security (sending userId in body)
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId }),
                });

                if (!response.ok) {
                    const errorDetail = await response.json().catch(() => ({ message: response.statusText }));
                    throw new Error(`Failed to fetch profile: ${errorDetail.message}`);
                }

                const data: { user: GuestProfile } = await response.json();
                
                // Set the form state with the fetched data
                setFormData({
                    name: data.user.name,
                    email: data.user.email,
                    phone: data.user.phone,
                });
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError(`Could not load profile data for editing. ${err instanceof Error ? err.message : ""}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [userId, API_URL_FETCH]);
    
    // --- 2. HANDLE FORM CHANGES ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null); // Clear errors on change
        setSuccess(null); // Clear success on change
    };

    // --- 3. HANDLE FORM SUBMISSION (NEW LOGIC) ---
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        setSuccess(null);

        if (!userId) {
            setError("User ID is missing for update.");
            setIsSaving(false);
            return;
        }

        try {
            const updatePayload = {
                userId,
                ...formData, // name, email, phone
            };

            const response = await fetch(API_URL_UPDATE, {
                method: 'PUT', // Use PUT or PATCH for updates
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatePayload),
            });

            if (!response.ok) {
                const errorDetail = await response.json().catch(() => ({ message: response.statusText }));
                throw new Error(errorDetail.message || 'Failed to update profile.');
            }

            // Success!
            setSuccess("Profile updated successfully!");
         /*   setTimeout(() => {
                router.push('/'); // Redirect back to the main profile page
            }, 2000);*/

        } catch (err) {
            console.error("Error updating profile:", err);
            setError(`Update failed: ${err instanceof Error ? err.message : "Unknown error."}`);
        } finally {
            setIsSaving(false);
        }
    };

    // --- RENDERING LOGIC ---


    if (isLoading)
  return (
    // Loading Screen: Minimalist and centered with a clear spinner or animation (represented by text here)
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-indigo-500 text-2xl font-light">
      <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="mt-4">Loading Profile Data...</p>
    </div>
  );


    if (error && !success) { // Show persistent error if no form data loaded
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="text-center p-8 bg-white shadow-xl rounded-lg border-l-4 border-red-500">
                    <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-4" />
                    <p className="text-2xl font-semibold text-red-600 mb-4">Error</p>
                    <p className="text-gray-600">{error}</p>
                    <Link href="/" className="mt-4 inline-flex items-center text-blue-500 hover:text-blue-700">
                        <ArrowLeft className="h-4 w-4 mr-1" /> Go Back to Profile
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto w-full bg-white p-8 rounded-xl shadow-2xl">
                
                <header className="text-center mb-8 border-b pb-4">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center justify-center">
                        <Edit3 className="h-7 w-7 mr-3 text-blue-600" /> Edit Your Profile
                    </h1>
                    <p className="mt-2 text-gray-500">Update your account details below.</p>
                </header>

                {/* Status Messages */}
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <p className="font-bold">Success!</p>
                        <p className="text-sm">{success}</p>
                    </div>
                )}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <p className="font-bold">Error!</p>
                        <p className="text-sm">{error}</p>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Full Name Input */}
                    <InputField 
                        Icon={UserIcon} 
                        label="Full Name" 
                        name="name" 
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={isSaving}
                    />
                    
                    {/* Email Input */}
                    <InputField 
                        Icon={Mail} 
                        label="Email Address" 
                        name="email" 
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isSaving}
                    />

                    {/* Phone Number Input */}
                    <InputField 
                        Icon={Phone} 
                        label="Phone Number" 
                        name="phone" 
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={isSaving}
                    />

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white 
                                ${isSaving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}
                                transition duration-150`}
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="animate-spin h-5 w-5 mr-3" />
                                    Saving Changes...
                                </>
                            ) : (
                                <>
                                    <Save className="h-5 w-5 mr-3" />
                                    Save Profile
                                </>
                            )}
                        </button>
                    </div>

                    {/* Back Button */}
                    <div className="text-center pt-4">
                        <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center justify-center">
                            <ArrowLeft className="h-4 w-4 mr-1" /> Cancel and Go Back
                        </Link>
                    </div>

                </form>
            </div>
        </div>
    );
};

// --- Sub-Component for a reusable form input field ---
const InputField = ({ Icon, label, name, value, onChange, type, disabled }: 
    { Icon: React.ElementType, label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type: string, disabled: boolean }) => (
    <div>
        <label htmlFor={name} className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <Icon className="h-4 w-4 mr-2 text-blue-500" /> {label}
        </label>
        <input
            id={name}
            name={name}
            type={type}
            required
            value={value}
            onChange={onChange}
            disabled={disabled}
            className="appearance-none block w-full px-4 py-3 border border-gray-300 text-black rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder={`Enter your ${label.toLowerCase()}`}
        />
    </div>
);


export default EditGuestProfilePage;
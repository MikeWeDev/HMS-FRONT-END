'use client';

import React, { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Phone, Gem, History, Loader2, Edit3, BedDouble, AlertTriangle, Calendar, DollarSign, ArrowRight } from 'lucide-react';
import Link from "next/link";

// --- INTERFACES (Remain the same) ---
interface GuestProfile {
    _id: string; // The user ID from the backend
    name: string;
    email: string;
    phone: string;
    loyaltyPoints: number;
}

interface Booking {
    id: string;
    roomNumber: string;
    roomType: string; 
    checkIn: string;
    checkOut: string;
    status: 'pending' | 'Available' | 'Booked' | 'Checked-In' | 'Checked-Out';
    totalPrice: number;
}

interface ProfileData {
    user: GuestProfile;
    recentBookings: Booking[];
}

// --- UTILITY (Remains the same) ---
const getStatusStyles = (status: Booking['status']) => {
    switch (status) {
        case 'Checked-Out':
            return 'bg-gray-200 text-gray-700 border-gray-300';
        case 'Checked-In':
            return 'bg-green-100 text-green-700 font-bold border-green-300';
        case 'Booked':
            return 'bg-blue-100 text-blue-700 font-bold border-blue-300';
        case 'pending':
        default:
            return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    }
};

// --- SUB-COMPONENTS (Improved) ---

// ➡️ IMPROVED: Detail component for the Profile Card
const ProfileDetail = ({ Icon, label, value }: { Icon: React.ElementType, label: string, value: string }) => (
    <div className="flex items-start space-x-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md">
        <div className="p-2 rounded-full bg-blue-50 flex-shrink-0">
            <Icon className="h-5 w-5 text-blue-600" />
        </div>
        {/* 💡 FIX APPLIED HERE: Added w-full and changed break-words to break-all */}
        <div className="w-full"> 
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-base font-semibold text-gray-800 break-all">{value}</p> 
        </div>
    </div>
)

// ➡️ IMPROVED: Card component for each Booking
const BookingCard = ({ booking }: { booking: Booking }) => {
    return (
        <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-0.5">
            
            {/* Room Info & Status */}
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                <div className="flex items-center">
                    <BedDouble className="h-6 w-6 text-blue-600 mr-3" />
                    <div>
                        <p className="text-xl font-extrabold text-gray-900">Room {booking.roomNumber}</p>
                        <p className="text-sm text-gray-500 capitalize">{booking.roomType}</p>
                    </div>
                </div>
                {/* Status Badge - Added border for definition */}
                <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase border ${getStatusStyles(booking.status)}`}>
                    {booking.status.replace('-', ' ')}
                </span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-3 gap-y-4 gap-x-6 text-sm">
                
                {/* Check-in */}
                <div className="col-span-1 flex flex-col">
                    <div className='flex items-center text-xs font-medium text-gray-500 mb-1'>
                        <Calendar className='h-3 w-3 mr-1 text-gray-400'/> Check-in
                    </div>
                    <p className="font-bold text-gray-800">{booking.checkIn}</p>
                </div>
                
                {/* Check-out */}
                <div className="col-span-1 flex flex-col">
                    <div className='flex items-center text-xs font-medium text-gray-500 mb-1'>
                        <Calendar className='h-3 w-3 mr-1 text-gray-400'/> Check-out
                    </div>
                    <p className="font-bold text-gray-800">{booking.checkOut}</p>
                </div>
                
                {/* Total Price */}
                <div className="col-span-1 flex flex-col">
                    <div className='flex items-center text-xs font-medium text-gray-500 mb-1'>
                        <DollarSign className='h-3 w-3 mr-1 text-gray-400'/> Total Price
                    </div>
                    <p className="text-lg font-extrabold text-green-600">${booking.totalPrice.toFixed(2)}</p>
                </div>

                {/* View Details Link */}
                <div className="col-span-3 flex justify-end pt-3 border-t border-gray-50">
                    <Link 
                        href="/features/guest/my-bookings" 
                        className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
                    >
                        View Details <ArrowRight className="h-4 w-4 ml-1"/>
                    </Link>
                </div>
            </div>
        </div>
    );
};


// --- MAIN COMPONENT (Updated JSX) ---

const GuestProfilePage = () => {
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://hms-backend-2k1m.onrender.com/api/guest/profile";

    useEffect(() => {
        const fetchProfile = async () => {
            const userId = localStorage.getItem('userId');
            
            if (!userId) {
                setIsLoading(false);
                setError("User ID required. Please ensure the user ID is saved in localStorage."); 
                return;
            }

            try {
                const response = await fetch(API_URL, {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: userId }), 
                });

                if (!response.ok) {
                    const errorDetail = await response.json().catch(() => ({ message: response.statusText }));
                    throw new Error(`Failed to fetch profile: ${response.status} - ${errorDetail.message}`);
                }

                const data: ProfileData = await response.json();
                setProfileData(data);
            } catch (err) {
                console.error("Error during fetch:", err);
                setError(`Could not load profile data. ${err instanceof Error ? err.message : "Check backend connection and userId."}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [API_URL]);
    
    const handleEditProfile = () => {
        console.log('Edit profile modal/page triggered.');
    };

    // --- RENDERING LOGIC ---

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <Loader2 className="animate-spin text-blue-600 h-8 w-8 mr-3" />
                <span className="text-xl text-gray-600">Loading Profile...</span>
            </div>
        );
    }

    if (error || !profileData) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-center p-8 bg-white shadow-xl rounded-lg border-l-4 border-red-500 max-w-lg mx-auto">
                    <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-4" />
                    <p className="text-2xl font-bold text-red-600 mb-4">Error Loading Profile</p>
                    <p className="text-gray-600">{error || "No profile data available."}</p>
                    <p className="mt-4 text-sm text-gray-500">
                        **HINT**: Ensure the **userId** is correctly stored and the backend is running.
                    </p>
                </div>
            </div>
        );
    }
    
    const { user, recentBookings } = profileData;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto w-full">
                
                {/* Header Section */}
                <header className="text-center mb-12 bg-white p-8 rounded-xl shadow-lg border-t-4 border-blue-600">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-md">
                        <UserIcon size={32} strokeWidth={2.5}/>
                    </div>
                    <h1 className="mt-4 text-4xl font-extrabold text-gray-900 tracking-tight">
                        Welcome, <span className='text-blue-600'>{user.name.split(' ')[0]}</span>!
                    </h1>
                    <p className="mt-2 text-xl text-gray-500">Your Guest Dashboard</p>
                </header>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* Profile Card (Left/Top) */}
                    <div className="lg:col-span-1 space-y-8">

                        <div className="bg-white p-6 rounded-xl shadow-2xl border-t-4 border-yellow-600">
                            <div className="flex justify-between items-center border-b pb-4 mb-4">
                                <h2 className="text-2xl font-bold text-gray-800">Account Details</h2>
                                <Link 
                                    href="/features/guest/editInfo" 
                                    className="text-sm font-medium text-blue-600 hover:text-blue-800 transition duration-150 flex items-center p-2 rounded-lg bg-blue-50 hover:bg-blue-100"
                                >
                                    <Edit3 className="h-4 w-4 mr-1" /> Edit Profile
                                </Link>
                            </div>

                            <div className="space-y-4 ">
                                {/* Name, Email, Phone, User ID */}
                                <ProfileDetail Icon={UserIcon} label="Full Name" value={user.name} />
                                <ProfileDetail Icon={Mail} label="Email Address" value={user.email} />
                                <ProfileDetail Icon={Phone} label="Phone Number" value={user.phone} />
                                <ProfileDetail Icon={UserIcon} label="User ID (Dev Ref.)" value={user._id} />
                            </div>
                        </div>

                        {/* Loyalty Card/Points - ➡️ IMPROVED: Looks more like a distinct badge/card */}
                        <div className="p-6 bg-yellow-500 rounded-xl shadow-xl flex flex-col items-center justify-center text-white border-b-4 border-yellow-700">
                            <Gem className="h-10 w-10 mb-2" />
                            <p className="text-lg font-semibold uppercase tracking-wider">Loyalty Rewards</p>
                            <p className="text-5xl font-extrabold mt-1">{user.loyaltyPoints.toLocaleString()}</p>
                            <p className="text-sm font-medium mt-1">Points Earned</p>
                            <span className="mt-3 px-3 py-1 bg-white text-yellow-600 text-xs font-bold rounded-full">
                                VIP Gold Tier
                            </span>
                        </div>
                    </div>

                    {/* Recent Bookings (Right/Bottom) */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-2xl">
                        <div className="flex items-center border-b pb-4 mb-6">
                            <History className="h-7 w-7 text-gray-700 mr-3" />
                            <h2 className="text-3xl font-bold text-gray-800">Your Recent Activity</h2>
                        </div>
                        
                        {recentBookings.length === 0 ? (
                            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                <p className="text-lg font-medium">You haven't made any recent bookings yet.</p>
                                <Link href="/features/guest" passHref>
                                    <button className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition shadow-lg text-lg font-semibold">
                                        Book Your First Stay Now
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {recentBookings.slice(0, 5).map((booking) => (
                                    <BookingCard key={booking.id} booking={booking} />
                                ))}
                                {recentBookings.length > 5 && (
                                    <div className="text-center pt-4">
                                        <Link href="/features/guest/my-bookings" passHref>
                                            <p className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer flex items-center justify-center">
                                                View All Bookings <ArrowRight className="h-4 w-4 ml-2"/>
                                            </p>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuestProfilePage;
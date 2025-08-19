'use client'; // This directive marks the component as a Client Component

import React, { useState } from 'react';
// Removed: import Head from 'next/head'; // No longer needed here as fonts are loaded globally

// Define an interface for the guest profile data
interface GuestProfile {
  name: string;
  email: string;
  phone: string;
  loyaltyPoints: number;
  recentBookings: {
    id: string;
    roomNumber: string;
    checkIn: string;
    checkOut: string;
    status: string;
  }[];
}

const GuestProfilePage = () => {
  // Sample static guest data (will be dynamic later)
  // setGuestProfile is kept here as you'll likely use it for editing in the future.
  const [guestProfile] = useState<GuestProfile>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    loyaltyPoints: 1250,
    recentBookings: [
      {
        id: 'bk001',
        roomNumber: '201',
        checkIn: '2024-07-10',
        checkOut: '2024-07-15',
        status: 'Checked-Out',
      },
      {
        id: 'bk002',
        roomNumber: '305',
        checkIn: '2024-08-20',
        checkOut: '2024-08-25',
        status: 'Checked-In',
      },
      {
        id: 'bk003',
        roomNumber: '102',
        checkIn: '2024-09-01',
        checkOut: '2024-09-03',
        status: 'Booked',
      },
    ],
  });

  // Handler for editing profile details (placeholder)
  const handleEditProfile = () => {
    console.log('Edit profile functionality will be implemented later!'); // Replaced alert()
    // In a real application, this would open a modal or navigate to an edit page
  };

  return (
    // Removed 'font-inter' class as it should be applied globally in layout.tsx
    <div className="flex flex-col min-h-screen bg-gray-100 antialiased p-8">
      {/* Removed the <Head> component and its content related to fonts */}

      <div className="max-w-4xl mx-auto w-full bg-white rounded-lg shadow-xl p-8 space-y-8">
        <h1 className="text-4xl font-bold text-gray-800 border-b pb-4 mb-6">Your Profile</h1>

        {/* Profile Information Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-700">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
              <p className="text-gray-600 font-medium">Name:</p>
              <p className="text-gray-800 text-lg">{guestProfile.name}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
              <p className="text-gray-600 font-medium">Email:</p>
              <p className="text-gray-800 text-lg">{guestProfile.email}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
              <p className="text-gray-600 font-medium">Phone:</p>
              <p className="text-gray-800 text-lg">{guestProfile.phone}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
              <p className="text-gray-600 font-medium">Loyalty Points:</p>
              <p className="text-gray-800 text-lg">{guestProfile.loyaltyPoints}</p>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleEditProfile}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-lg font-semibold shadow-md hover:bg-blue-700 transition-colors transform hover:scale-105"
            >
              Edit Profile
            </button>
          </div>
        </section>

        {/* Recent Bookings Section */}
        <section className="space-y-6 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-700">Recent Bookings</h2>
          {guestProfile.recentBookings.length === 0 ? (
            <div className="text-center text-gray-500 p-4">No recent bookings found.</div>
          ) : (
            <div className="space-y-4">
              {guestProfile.recentBookings.map((booking) => (
                <div key={booking.id} className="bg-gray-50 rounded-lg shadow-sm p-4 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                  <div>
                    <p className="text-gray-600 font-medium">Room:</p>
                    <p className="text-gray-800">{booking.roomNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Check-in:</p>
                    <p className="text-gray-800">{booking.checkIn}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Check-out:</p>
                    <p className="text-gray-800">{booking.checkOut}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Status:</p>
                    <p className={`font-semibold ${
                      booking.status === 'Checked-Out' ? 'text-gray-500' :
                      booking.status === 'Checked-In' ? 'text-green-600' :
                      'text-blue-500'
                    }`}>
                      {booking.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Other Sections (e.g., Payment Methods, Preferences) can be added here */}
        <section className="space-y-6 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-700">Other Information</h2>
          <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
            <p className="text-gray-600">
              Additional guest preferences or payment methods can be managed here. (Coming Soon)
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GuestProfilePage;
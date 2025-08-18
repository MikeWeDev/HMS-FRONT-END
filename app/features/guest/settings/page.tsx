'use client'; // This directive marks the component as a Client Component in Next.js

import React, { useState } from 'react';
import Head from 'next/head'; // For managing document head tags like title

// Define an interface for any settings state you might manage locally
interface SettingsState {
  notificationsEnabled: boolean;
  theme: 'light' | 'dark';
  // Add other settings as needed
}

const GustSettingsPage = () => {
  // Initialize settings state with default values
  const [settings, setSettings] = useState<SettingsState>({
    notificationsEnabled: true,
    theme: 'light',
  });

  // Handler for changing settings
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Use a type guard to correctly handle checkbox vs. other input types
    const newValue = e.target instanceof HTMLInputElement && e.target.type === 'checkbox'
      ? e.target.checked
      : value;

    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: newValue,
    }));
    // In a real application, you'd also want to send this update to a backend API
    // or save it to local storage here.
    console.log(`Setting '${name}' updated to: ${newValue}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-inter antialiased p-8">
      <Head>
        <title>Settings | Receptionist Panel</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="max-w-3xl mx-auto w-full bg-white rounded-lg shadow-xl p-8 space-y-8">
        <h1 className="text-4xl font-bold text-gray-800 border-b pb-4 mb-6">Receptionist Settings</h1>

        {/* General Settings Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-700">General</h2>
          
          {/* Notifications Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
            <label htmlFor="notificationsEnabled" className="text-lg text-gray-700 font-medium">
              Enable Notifications
            </label>
            <input
              type="checkbox"
              id="notificationsEnabled"
              name="notificationsEnabled"
              checked={settings.notificationsEnabled}
              onChange={handleChange}
              className="form-checkbox h-6 w-6 text-blue-600 rounded-md focus:ring-blue-500"
            />
          </div>

          {/* Theme Selector */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
            <label htmlFor="theme" className="text-lg text-gray-700 font-medium">
              Theme
            </label>
            <select
              id="theme"
              name="theme"
              value={settings.theme}
              onChange={handleChange}
              className="mt-1 block w-48 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </section>

        {/* Account Settings (Placeholder) */}
        <section className="space-y-6 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-700">Account</h2>
          <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
            <p className="text-gray-600">
              Manage your account details and password. (Coming Soon)
            </p>
            <button className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              Edit Account
            </button>
          </div>
        </section>

        {/* Save Changes Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            onClick={() => console.log('Saving settings:', settings)}
            className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-green-700 transition-colors transform hover:scale-105"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default GustSettingsPage;

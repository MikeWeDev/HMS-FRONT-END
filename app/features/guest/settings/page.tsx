'use client';

import React, { useState, useEffect } from 'react';
import {Bell, Key, Settings as SettingsIcon, Info } from 'lucide-react';
import Link from "next/link";


// Define an interface for any settings state you might manage locally
interface SettingsState {
    notificationsEnabled: boolean;
    // Initialize theme to a value guaranteed to be the same on the server.
    // We'll update this on the client immediately after hydration.
    theme: 'light' | 'dark'; 
}

/**
 * NEW UTILITY: Function to safely apply the theme class to the document 
 * and update localStorage. This should only be called on the client.
 */
const applyThemeToDOM = (theme: 'light' | 'dark') => {
    if (typeof document !== 'undefined') {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('theme', theme);
    }
};

/**
 * NEW UTILITY: Function to safely read the client's preferred theme 
 * from localStorage or system settings.
 */
const getClientPreferredTheme = (): 'light' | 'dark' => {
    if (typeof localStorage === 'undefined') return 'light'; // Should not happen in useEffect

    const storedTheme = localStorage.getItem('theme');
    
    // 1. Check localStorage first
    if (storedTheme === 'dark' || storedTheme === 'light') {
        return storedTheme;
    } 
    // 2. Check system preference
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    
    // 3. Default
    return 'light';
};


const ReceptionistSettingsPage = () => {
    // 1. Initialize state with a guaranteed value ('light') for SSR consistency.
    const [settings, setSettings] = useState<SettingsState>(() => ({
        notificationsEnabled: true,
        theme: 'light', // Consistent default for Server Render (SSR)
    }));
    
    // State to track if the component has mounted (i.e., we are on the client after hydration)
    const [mounted, setMounted] = useState(false);

    // 2. useEffect to correct the theme state AFTER hydration.
    useEffect(() => {
        // This runs only once on the client after mounting.
        const clientTheme = getClientPreferredTheme();
        
        setSettings(prevSettings => ({
            ...prevSettings,
            theme: clientTheme,
        }));
        
        applyThemeToDOM(clientTheme);
        setMounted(true); // Indicate that we are now fully client-side and ready
    }, []);

    // 3. useEffect to handle DOM/Storage updates on subsequent user interaction.
    useEffect(() => {
        // Only run this for theme changes caused by user interaction *after* initial mount.
        if (mounted) {
            applyThemeToDOM(settings.theme);
        }
    }, [settings.theme, mounted]);


    // Handler for changing simple settings (like checkbox)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        
        setSettings((prevSettings) => ({
            ...prevSettings,
            [name]: checked,
        }));
    };
    
    // =========================================================
    // COMMENTED OUT: Dedicated handler for theme toggle
    // const handleThemeToggle = () => {
    //     setSettings(prevSettings => {
    //         const newTheme = prevSettings.theme === 'light' ? 'dark' : 'light';
    //         return {
    //             ...prevSettings,
    //             theme: newTheme,
    //         };
    //     });
    // };
    // =========================================================


    return (
        // Main container and background
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 antialiased p-4 sm:p-8 transition-colors duration-300">
            
            <div className="max-w-3xl mx-auto w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8 space-y-8 transition-colors duration-300">
                
                {/* Header: Changed to 'Gust Settings' */}
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-4 mb-6 flex items-center transition-colors">
                    <SettingsIcon className="h-8 w-8 mr-3 text-blue-600 dark:text-blue-400" />
                    Gust Settings
                </h1>

                {/* General Settings Section */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 transition-colors">General Preferences</h2>

                    {/* Notifications Toggle */}
                    <SettingItem
                        label="Enable Notifications"
                        description="Receive alerts for new bookings and check-in/out updates."
                        icon={Bell}
                    >
                        <input
                            type="checkbox"
                            id="notificationsEnabled"
                            name="notificationsEnabled"
                            checked={settings.notificationsEnabled}
                            onChange={handleChange}
                            // Custom toggle styling
                            className="h-6 w-12 appearance-none rounded-full bg-gray-300 dark:bg-gray-600 checked:bg-blue-600 transition duration-300 ease-in-out cursor-pointer relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:bg-white after:rounded-full after:shadow-md after:transition after:translate-x-0 checked:after:translate-x-6"
                        />
                    </SettingItem>

                    {/* 
                    <SettingItem
                        label="Color Theme"
                        description={`Currently using the ${isDarkMode ? 'Dark' : 'Light'} theme from your saved preferences.`}
                        icon={isDarkMode ? Moon : Sun}
                    >
                        {/* Theme Toggle is commented out as requested. 
                            This section is now for display/info only.
                       
                      <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold shadow-md border ${
                                isDarkMode 
                                    ? 'bg-gray-700 text-white border-gray-600' 
                                    : 'bg-gray-200 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600'
                            }`}>
                            {isDarkMode ? (
                                <Moon className="h-5 w-5" />
                            ) : (
                                <Sun className="h-5 w-5" />
                            )}
                            <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
                        </div>
                    </SettingItem>
                    */}
                    
                </section>

                {/* Demo Information Section (NEW) */}
                <section className="space-y-6 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 transition-colors">Demo Information</h2>
                    
                    <SettingItem
                        label="System Status"
                        description="View current health and connectivity of the Gust services."
                        icon={Info}
                    >
                        <div className="text-sm font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900 px-3 py-1.5 rounded-full">
                            Operational
                        </div>
                    </SettingItem>
                    
                    <SettingItem
                        label="Current Version"
                        description="The software version deployed on this instance."
                        icon={Info}
                    >
                        <span className="text-gray-700 dark:text-gray-300 font-mono text-sm">v3.1.2-beta</span>
                    </SettingItem>
                </section>


                {/* Account Settings (Placeholder) */}
                <section className="space-y-6 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 transition-colors">Account & Security</h2>
                    
                    <SettingItem
                        label="Manage Credentials"
                        description="Update your password and login information."
                        icon={Key}
                    >
                        <Link href="/features/guest/editInfo" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-colors">
                            Edit Account
                        </Link>
                    </SettingItem>
                </section>

                {/* Save Changes Button */}
                <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => console.log('Settings successfully saved to local storage.')}
                        className="bg-green-600 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-xl hover:bg-green-700 transition-all transform hover:scale-[1.02]"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

// Helper component for clean settings layout
const SettingItem = ({ label, description, icon: Icon, children }: { label: string, description: string, icon: React.ElementType, children: React.ReactNode }) => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-lg border border-gray-100 dark:border-gray-600 transition-colors duration-300">
        <div className="flex items-start sm:items-center mb-4 sm:mb-0">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-800 mr-4 flex-shrink-0">
                <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
                <label className="text-xl font-semibold text-gray-800 dark:text-gray-100 block transition-colors">{label}</label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 transition-colors">{description}</p>
            </div>
        </div>
        <div className="flex-shrink-0 mt-3 sm:mt-0">
            {children}
        </div>
    </div>
);

export default ReceptionistSettingsPage;
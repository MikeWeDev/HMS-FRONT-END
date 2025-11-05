'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, TrendingUp, RefreshCw, Loader2, AlertTriangle } from 'lucide-react';

// Define the interface based on the simplified data returned by the backend:
// Booking data mapped as a transaction record.
interface TransactionRecord {
    id: string;
    amount: number;
    date: string; 
    method: string; 
    status: 'Completed' | 'Pending' | 'Failed' | 'Refunded' | string; // Allow string to handle defaults
    description?: string;
}

const PaymentHistoryPage = () => {
    // 1. Explicitly type history state as an array of TransactionRecord
    const [history, setHistory] = useState<TransactionRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    // 2. Explicitly type error state to allow both string messages and null
    const [error, setError] = useState<string | null>(null);

    // Define the API URL for the new endpoint
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://hms-backend-2k1m.onrender.com/api/guest/payments"; 

    // Function to fetch the payment data
    const fetchHistory = async () => {
        setIsLoading(true);
        setError(null);

        // Get the User ID from local storage. NOTE: You need to set 'userId' in localStorage 
        // upon login/authentication for this to work.
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
            setIsLoading(false);
            // Error argument is now typed as string | null
            setError("User ID not found in localStorage. Please ensure you are logged in and the ID is saved."); 
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                // Send the userId in the request body
                body: JSON.stringify({ userId: userId }), 
            });

            if (!response.ok) {
                const errorDetail = await response.json().catch(() => ({ message: response.statusText }));
                // Handle 404 specifically
                if (response.status === 404) {
                     // Error argument is now typed as string | null
                     throw new Error(`User not found. Status: ${response.status}`);
                }
                // Error argument is now typed as string | null
                throw new Error(`Failed to fetch history: ${response.status} - ${errorDetail.message}`);
            }

            const data: TransactionRecord[] = await response.json();
            setHistory(data);
        } catch (err) {
            console.error("Error during fetch:", err);
            // Error argument is now typed as string | null
            setError(`Could not load transaction history. ${err instanceof Error ? err.message : "Check backend connection."}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch data on initial component mount
    useEffect(() => {
        fetchHistory();
    }, []);

    // 3. Explicitly type the status parameter
    const getStatusStyles = (status: TransactionRecord['status']) => {
        switch (status) {
            case 'Completed':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'Pending':
                return 'text-orange-500 bg-orange-50 border-orange-200';
            case 'Failed':
            case 'Refunded':
                return 'text-red-500 bg-red-50 border-red-200';
            default:
                return 'text-gray-800 bg-gray-50 border-gray-200';
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
    

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="text-center p-8 bg-white rounded-xl shadow-2xl border-l-4 border-red-500">
                    <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-4" />
                    <p className="text-2xl font-semibold text-red-600 mb-4">Error Loading Data</p>
                    <p className="text-gray-600">{error}</p>
                    <button 
                        onClick={fetchHistory}
                        className="mt-6 flex items-center mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" /> Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 font-inter antialiased p-4 sm:p-8">
            
            <div className="max-w-4xl mx-auto w-full bg-white rounded-xl shadow-2xl p-6 sm:p-8 space-y-8">
                <div className="flex items-center border-b pb-4 mb-6">
                    <CreditCard className="h-8 w-8 text-blue-600 mr-3" />
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Booking Transaction History</h1>
                </div>

                {history.length === 0 ? (
                    <div className="text-center text-gray-500 p-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <p className="text-lg font-medium">No booking transactions found for this user.</p>
                        <p className="text-sm mt-2">All your completed bookings will show here as payments.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {history.map((transaction) => (
                            // TypeScript now correctly infers the properties (id, amount, date, etc.)
                            <div key={transaction.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 transition duration-300 hover:shadow-md">
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
                                    
                                    {/* Amount */}
                                    <div className="col-span-1">
                                        <p className="text-xs font-medium text-gray-500 uppercase">Amount</p>
                                        <p className="text-xl font-bold text-green-600">
                                            ${transaction.amount.toFixed(2)}
                                        </p>
                                    </div>
                                    
                                    {/* Date (Check-In) */}
                                    <div className="col-span-1 flex items-center">
                                        <Calendar className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0 hidden sm:inline" />
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 uppercase">Date (Check-In)</p>
                                            <p className="text-sm font-semibold text-gray-800">{transaction.date}</p>
                                        </div>
                                    </div>

                                    {/* Method */}
                                    <div className="col-span-1">
                                        <p className="text-xs font-medium text-gray-500 uppercase">Method</p>
                                        <p className="text-sm font-semibold text-gray-800">{transaction.method}</p>
                                    </div>
                                    
                                    {/* Status */}
                                    <div className="col-span-1">
                                        <p className="text-xs font-medium text-gray-500 uppercase">Status</p>
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusStyles(transaction.status)}`}>
                                            {transaction.status}
                                        </span>
                                    </div>
                                    
                                    {/* Icon */}
                                    <div className="col-span-1 flex justify-end">
                                        {/* FIX: Replaced unsupported 'title' prop with 'aria-label' for accessibility */}
                                        {transaction.status === 'Completed' ? (
                                            <TrendingUp className="h-6 w-6 text-green-500" aria-label="Completed Transaction" />
                                        ) : (
                                            <RefreshCw className="h-6 w-6 text-orange-500 animate-pulse" aria-label="Pending Transaction" />
                                        )}
                                    </div>

                                    {/* Description */}
                                    {transaction.description && (
                                        <div className="col-span-2 md:col-span-5 pt-2 border-t mt-3 border-gray-100">
                                            <p className="text-xs text-gray-600 font-medium">Description:</p>
                                            <p className="text-gray-800 text-sm">{transaction.description}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentHistoryPage;

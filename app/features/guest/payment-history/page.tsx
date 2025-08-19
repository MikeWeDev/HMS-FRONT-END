'use client';

import React, { useState } from 'react';
// Removed: import Head from 'next/head';

// Define an interface for a single payment record
interface PaymentRecord {
  id: string;
  amount: number;
  date: string;
  method: string;
  status: 'Completed' | 'Pending' | 'Failed';
  description?: string;
}

const PaymentHistoryPage = () => {
  // Use a constant for static data or keep useState without the setter if not needed
  const [paymentHistory] = useState<PaymentRecord[]>([
    {
      id: 'pay001',
      amount: 250.00,
      date: '2024-07-15',
      method: 'Credit Card',
      status: 'Completed',
      description: 'Payment for Room 201 booking bk001',
    },
    {
      id: 'pay002',
      amount: 300.00,
      date: '2024-08-20',
      method: 'Debit Card',
      status: 'Completed',
      description: 'Payment for Room 305 booking bk002',
    },
    {
      id: 'pay003',
      amount: 150.00,
      date: '2024-09-01',
      method: 'Online Transfer',
      status: 'Pending',
      description: 'Advance payment for Room 102 booking bk003',
    },
    {
      id: 'pay004',
      amount: 50.00,
      date: '2024-06-01',
      method: 'Cash',
      status: 'Completed',
      description: 'Mini-bar charges',
    },
    {
      id: 'pay005',
      amount: 75.00,
      date: '2024-06-05',
      method: 'Credit Card',
      status: 'Failed',
      description: 'Laundry service charge',
    },
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-inter antialiased p-8">
      {/* Removed: Head component with font link */}
      
      <div className="max-w-4xl mx-auto w-full bg-white rounded-lg shadow-xl p-8 space-y-8">
        <h1 className="text-4xl font-bold text-gray-800 border-b pb-4 mb-6">Payment History</h1>

        {paymentHistory.length === 0 ? (
          <div className="text-center text-gray-500 p-4">No payment records found.</div>
        ) : (
          <div className="space-y-4">
            {paymentHistory.map((payment) => (
              <div key={payment.id} className="bg-gray-50 rounded-lg shadow-sm p-4 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                <div>
                  <p className="text-gray-600 font-medium">Amount:</p>
                  <p className="text-gray-800 text-lg">${payment.amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Date:</p>
                  <p className="text-gray-800">{payment.date}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Method:</p>
                  <p className="text-gray-800">{payment.method}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Status:</p>
                  <p className={`font-semibold ${
                    payment.status === 'Completed' ? 'text-green-600' :
                    payment.status === 'Pending' ? 'text-orange-500' :
                    'text-red-500'
                  }`}>
                    {payment.status}
                  </p>
                </div>
                {payment.description && (
                  <div className="col-span-2 md:col-span-4">
                    <p className="text-gray-600 font-medium">Description:</p>
                    <p className="text-gray-800 text-sm">{payment.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistoryPage;
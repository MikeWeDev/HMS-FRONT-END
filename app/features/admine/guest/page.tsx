'use client'
import React, { useEffect, useState, useCallback, useMemo } from "react";
// Replaced unavailable 'react-icons/hi' with available 'lucide-react' icons
import { Loader2, X, AlertCircle, CheckCircle, User, Trash2, RefreshCw } from 'lucide-react';

// Interfaces (kept outside the component body for best practice, even in a single file)
interface User {
  _id: string;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface NotificationState {
  message: string;
  type: 'success' | 'error' | null;
}

// --- Utility Components (Defined inside the file for single-file mandate) ---

/**
 * Custom Notification Banner for errors and success messages.
 */
const NotificationBanner = ({ notification, setNotification }: {
  notification: NotificationState;
  setNotification: React.Dispatch<React.SetStateAction<NotificationState>>;
}) => {
  const bgColor = notification.type === 'error' ? 'bg-red-500' : 'bg-green-500';
  const Icon = notification.type === 'error' ? AlertCircle : CheckCircle;

  if (!notification.message) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-xl text-white flex items-center space-x-3 ${bgColor} transition-all duration-300 ease-in-out transform`}>
      <Icon className="w-5 h-5" />
      <p className="text-sm font-medium">{notification.message}</p>
      <button
        onClick={() => setNotification({ message: '', type: null })}
        className="ml-auto p-1 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

/**
 * Custom Confirmation Modal to replace window.confirm()
 */
const ConfirmModal = ({ show, title, message, onConfirm, onCancel }: {
  show: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 transform transition-all scale-100 opacity-100">
        <h3 className="text-xl font-bold text-red-600 mb-4">{title}</h3>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-white bg-red-600 rounded-lg font-medium hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
export default function App() {
  const [guests, setGuests] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [guestToDelete, setGuestToDelete] = useState<string | null>(null);

  // Notification State (replaces alert)
  const [notification, setNotification] = useState<NotificationState>({ message: '', type: null });

  const showNotification = useCallback((message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    // Auto-hide after 4 seconds
    setTimeout(() => setNotification({ message: '', type: null }), 4000);
  }, []);

  const fetchGuests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://hms-backend-2k1m.onrender.com/api/auth/admin/users");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch users");
      }

      // ✅ Only guests
      const guestUsers = data.data.filter((u: User) => u.role === "guest");
      setGuests(guestUsers);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during fetch.";
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

  // --- Delete Logic ---

  // 1. Initiates the deletion process (shows modal)
  const handleDeleteClick = (id: string) => {
    setGuestToDelete(id);
    setShowConfirmModal(true);
  };

  // 2. Confirms and executes the deletion
  const confirmDelete = useCallback(async () => {
    if (!guestToDelete) return;

    setShowConfirmModal(false);
    setRefreshing(true);

    try {
      const res = await fetch(`https://hms-backend-2k1m.onrender.com/api/auth/admin/users/${guestToDelete}`, {
        method: "DELETE"
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete user");
      }

      // Update state without refreshing
      setGuests(prevGuests => prevGuests.filter(u => u._id !== guestToDelete));
      showNotification("Guest deleted successfully.", 'success');

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during deletion.";
      showNotification(`Deletion failed: ${errorMessage}`, 'error');
    } finally {
      setRefreshing(false);
      setGuestToDelete(null);
    }
  }, [guestToDelete, showNotification]);

  const totalGuests = useMemo(() => guests.length, [guests]);

  const GuestTable = () => (
    <div className="bg-white shadow-xl rounded-2xl overflow-hidden mt-8 ring-1 ring-gray-100  w-full overflow-x-auto">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-700 to-blue-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Role</th>
              {/* Hide ID on small screens, show on medium and up */}
              <th className="hidden md:table-cell px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">User ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Registered At</th>
              <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {guests.map((guest, index) => (
              <tr key={guest._id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-green-50'} hover:bg-green-100 transition duration-150`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{guest.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {guest.role}
                  </span>
                </td>
                <td className="hidden md:table-cell px-6 py-4 text-xs text-gray-500 truncate max-w-[150px]">{guest._id}</td>
                {/* Removed whitespace-nowrap to allow wrapping on mobile, fixing x-axis scroll */}
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(guest.createdAt).toLocaleDateString()}
                  <span className="block text-xs text-gray-400">{new Date(guest.createdAt).toLocaleTimeString()}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => handleDeleteClick(guest._id)}
                    disabled={refreshing}
                    className="p-2 rounded-full text-red-600 bg-red-100 hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={`Delete guest ${guest.username}`}
                  >
                    {/* Replaced HiOutlineTrash with Trash2 */}
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {totalGuests === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-500 text-lg">
                  No registered guests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans w-[100vw] md:w-[calc(100vw-22rem)]">
      <NotificationBanner notification={notification} setNotification={setNotification} />
      <ConfirmModal
        show={showConfirmModal}
        title="Confirm Deletion"
        message="This action will permanently delete the guest account. Are you absolutely sure you want to proceed?"
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowConfirmModal(false);
          setGuestToDelete(null);
        }}
      />

      <header className="bg-white shadow-md p-4 sticky top-0 z-10 border-b border-blue-100 w-full">
        <h1 className="text-xl md:text-3xl font-extrabold text-blue-800 tracking-tight">Guest Management Dashboard</h1>
      </header>

      <main className="p-4  w-[90%] md:w-full mx-auto md:mx-0">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">All Registered Guests</h2>
          <button
            onClick={fetchGuests}
            disabled={loading || refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-green-700 transition duration-200 disabled:bg-gray-400"
            aria-label="Refresh guest list"
          >
            {loading || refreshing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              // Replaced HiRefresh with RefreshCw
              <RefreshCw className="w-5 h-5" />
            )}
            <span className="hidden sm:inline">Refresh Data</span>
          </button>
        </div>

        {/* Summary Card - Responsive layout */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <div className="bg-white border-b-4 border-blue-500 rounded-xl shadow-xl p-6 flex flex-col items-start hover:shadow-2xl transition-all duration-300 transform hover:translate-y-[-2px]">
            <div className="flex items-center gap-3 text-blue-600">
              {/* Replaced HiOutlineUser with User */}
              <User className="w-8 h-8 p-1 rounded-full bg-blue-100" />
              <span className="text-4xl font-extrabold tracking-tight">{totalGuests}</span>
            </div>
            <span className="text-gray-600 mt-3 text-lg font-medium">Total Registered Guests</span>
            <p className="text-sm text-gray-400 mt-1">Snapshot of all guest accounts in the system.</p>
          </div>
        </div>

        {/* Guest List Area */}
        {loading ? (
          <div className="flex items-center justify-center p-10 bg-white rounded-xl shadow-xl w-[80%] md:w-full">
            <Loader2 className="animate-spin w-8 h-8 text-green-500 mr-3" />
            <p className="text-lg font-medium text-gray-600">Fetching guest data...</p>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md">
            <p className="font-semibold">Error Loading Guests:</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : (
          <GuestTable />
        )}
      </main>

      <footer className="p-4 text-center text-sm text-gray-500 border-t mt-10">
        Guest Data Management Interface &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

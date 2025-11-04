'use client'
import React, { useEffect, useState, useCallback, useMemo } from "react";
// Removed 'Menu' import
import { Loader2, X, AlertCircle, CheckCircle, User, Trash2, RefreshCw, Users } from 'lucide-react';

// Interfaces (kept outside the component body for best practice)
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

// --- Utility Components ---

/**
 * Custom Notification Banner for errors and success messages.
 */
const NotificationBanner = ({ notification, setNotification }: {
  notification: NotificationState;
  setNotification: React.Dispatch<React.SetStateAction<NotificationState>>;
}) => {
  const bgColor = notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500';
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
export default function StaffPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  // Removed [isSidebarOpen, setIsSidebarOpen] state
  
  // Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // Notification State (replaces alert/confirm)
  const [notification, setNotification] = useState<NotificationState>({ message: '', type: null });

  const showNotification = useCallback((message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: null }), 4000);
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://hms-backend-2k1m.onrender.com/api/auth/admin/users");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch users");
      }
      
      // Keep original logic to filter out guests
      const staff = data.data.filter((u: User) => u.role !== "guest");
      setUsers(staff || []);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during fetch.";
      setError(errorMessage);
      showNotification(`Fetch failed: ${errorMessage}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // --- Deletion Logic Adapter ---

  // 1. Initiates the deletion process (shows modal, replaces native confirm)
  const handleDeleteClick = (id: string) => {
    setUserToDelete(id);
    setShowConfirmModal(true);
  };

  // 2. Confirms and executes the deletion (called by the modal)
  const confirmDelete = useCallback(async () => {
    if (!userToDelete) return;

    setShowConfirmModal(false);
    setRefreshing(true);

    try {
      const res = await fetch(`https://hms-backend-2k1m.onrender.com/api/auth/admin/users/${userToDelete}`, {
        method: "DELETE"
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete user");
      }

      // Update state without refreshing
      setUsers(prevUsers => prevUsers.filter(u => u._id !== userToDelete));
      showNotification("Staff member deleted successfully.", 'success');

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during deletion.";
      showNotification(`Deletion failed: ${errorMessage}`, 'error');
    } finally {
      setRefreshing(false);
      setUserToDelete(null);
    }
  }, [userToDelete, showNotification]);

  // Counts for cards (keeping original logic)
  const totalStaff = useMemo(() => users.length, [users]);
  const receptionists = useMemo(() => users.filter(u => u.role === "receptionist").length, [users]);
  const admins = useMemo(() => users.filter(u => u.role === "admin").length, [users]);

  // Card Data adapted to match the GuestsPage single card style but for three items
  const cardData = [
    {
      title: "Total Staff",
      count: totalStaff,
      icon: User,
      color: "text-blue-600", // Using blue theme
      bgColor: "bg-blue-100",
      description: "Count of all active staff accounts."
    },
    {
      title: "Administrators",
      count: admins,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: "Total number of admin accounts."
    },
    {
      title: "Receptionists",
      count: receptionists,
      icon: User,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: "Total number of receptionist accounts."
    },
  ];

  const StaffTable = () => (
    <div className="bg-white shadow-xl rounded-2xl overflow-hidden mt-8 ring-1 ring-gray-100">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-700 to-blue-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Role</th>
              {/* Added ID column to match GuestsPage table structure */}
              <th className="hidden md:table-cell px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">User ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Registered At</th>
              <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user, index) => (
              <tr key={user._id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100 transition duration-150`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </td>
                <td className="hidden md:table-cell px-6 py-4 text-xs text-gray-500 truncate max-w-[150px]">{user._id}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                  <span className="block text-xs text-gray-400">{new Date(user.createdAt).toLocaleTimeString()}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => handleDeleteClick(user._id)} // Using modal trigger
                    disabled={refreshing}
                    className="p-2 rounded-full text-red-600 bg-red-100 hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={`Delete staff member ${user.username}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {totalStaff === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-500 text-lg">
                  No staff members registered.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    // Changed main container class to remove flex and ensure full width
    <div className="min-h-screen bg-gray-50 font-sans w-[100vw] md:w-[calc(100vw-22rem)]">
      <NotificationBanner notification={notification} setNotification={setNotification} />
      <ConfirmModal
        show={showConfirmModal}
        title="Confirm Staff Deletion"
        message="This action will permanently delete the staff member's account. Are you absolutely sure you want to proceed?"
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowConfirmModal(false);
          setUserToDelete(null);
        }}
      />
      
      {/* Main Content Area: Now full width (w-full) */}
      <div className="w-full overflow-y-auto">
         <header className="bg-white shadow-md p-4 sticky top-0 z-10 border-b border-blue-100 w-full">
        <h1 className="text-xl md:text-3xl font-extrabold text-blue-800 tracking-tight">Stough Management Dashboard</h1>
      </header>

        <main className="p-4  w-[90%] md:w-full mx-auto md:mx-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">All Registered Staff</h2>
            <button
              onClick={fetchUsers}
              disabled={loading || refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition duration-200 disabled:bg-gray-400"
              aria-label="Refresh staff list"
            >
              {loading || refreshing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <RefreshCw className="w-5 h-5" />
              )}
              <span className="hidden sm:inline">Refresh Data</span>
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {cardData.map((card, index) => (
              <div key={index} className="bg-white border-b-4 border-blue-500 rounded-xl shadow-xl p-6 flex flex-col items-start hover:shadow-2xl transition-all duration-300 transform hover:translate-y-[-2px]">
                <div className="flex items-center gap-3 text-blue-600">
                  <card.icon className={`w-8 h-8 p-1 rounded-full ${card.bgColor}`} />
                  <span className="text-4xl font-extrabold tracking-tight">{card.count}</span>
                </div>
                <span className="text-gray-600 mt-3 text-lg font-medium">{card.title}</span>
                <p className="text-sm text-gray-400 mt-1">{card.description}</p>
              </div>
            ))}
          </div>

          {/* Staff List Area */}
          {loading ? (
            <div className="flex items-center justify-center p-10 bg-white rounded-xl shadow-xl">
              <Loader2 className="animate-spin w-8 h-8 text-blue-500 mr-3" />
              <p className="text-lg font-medium text-gray-600">Fetching staff data...</p>
            </div>
          ) : error ? (
            <div className="p-6 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md">
              <p className="font-semibold">Error Loading Staff:</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : (
            <StaffTable />
          )}
        </main>

        <footer className="p-4 text-center text-sm text-gray-500 border-t mt-10">
          Staff Data Management Interface &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}

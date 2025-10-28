'use client';

import { useState } from 'react';
// import { useRouter } from 'next/navigation'; // REMOVED: Caused "Could not resolve next/navigation" error
import { User, Lock, Mail, Phone, Briefcase, Loader2, Hotel } from 'lucide-react'; // Icons for better UI
import { useRouter } from 'next/navigation';

// Reusable Input Field component for cleaner JSX
const InputField = ({ id, label, type, required, placeholder, value, onChange, Icon, autoComplete = 'off' }: {
    id: string;
    label: string;
    type: string;
    required?: boolean;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    Icon: React.ElementType;
    autoComplete?: string;
}) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {Icon && <Icon className="inline w-4 h-4 mr-1 text-indigo-500" />} {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={type}
          required={required}
          className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
        />
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
);


export default function RegisterPage() {
    // UPDATED STATE TO INCLUDE EMAIL AND PHONE
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter(); 

    // Base URL for the backend API
    const API_URL = 'https://hms-backend-2k1m.onrender.com/api/auth/register';

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Ensure all mandatory fields are filled
      if (!username || !email || !password || !role) {
        setMessage('Please fill in all mandatory fields (Username, Email, Password, and Role).');
        return;
      }

      setLoading(true);
      setMessage('');

      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // UPDATED PAYLOAD
          body: JSON.stringify({ username, email, phone, password, role }),
        });

        const data = await response.json();

        if (response.ok) {
          // Updated message since automatic redirect is not possible due to environment constraints
          setMessage(data.message || 'Registration successful! You can now sign in.');
          // Clear form fields
          setUsername('');
          setEmail('');
          setPhone('');
          setPassword('');
          setRole('');
          router.push('/auth/login');

} else {
          setMessage(data.message || 'Registration failed. Please try again.');
        }
      } catch (error) {
        setMessage('An unexpected error occurred. Please try again later.');
        console.error('Frontend registration error:', error);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        {/* Modern Card Design */}
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 space-y-8 border-t-8 border-indigo-600">
          <div className="flex flex-col items-center">
            <Hotel className="w-10 h-10 text-indigo-600 mb-2" />
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Register New User
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Fill in your profile details to create an account.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Username */}
              <InputField
                id="username"
                label="Username"
                type="text"
                required
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                Icon={User}
              />

              {/* Email Address (MANDATORY) */}
              <InputField
                id="email"
                label="Email Address"
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                Icon={Mail}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <InputField
                id="password"
                label="Password"
                type="password"
                required
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                Icon={Lock}
                autoComplete="new-password"
              />

              {/* Phone Number (OPTIONAL) */}
              <InputField
                id="phone"
                label="Phone (Optional)"
                type="tel"
                required={false}
                placeholder="e.g., +1 555-123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                Icon={Phone}
              />
            </div>

            {/* Role Select */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                <Briefcase className="inline w-4 h-4 mr-1 text-indigo-500" /> Role <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                name="role"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="block w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out cursor-pointer"
              >
                <option value="" disabled>Select role</option>
                <option value="guest">Guest</option>
                <option value="receptionist">Receptionist</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-semibold rounded-lg text-white shadow-lg
                  ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 transform hover:scale-[1.01]'}
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out`}
              >
                {loading ? (<><Loader2 className="animate-spin w-5 h-5 mr-3" /> Registering...</>) : 'Register Account'}
              </button>
            </div>
          </form>

          {message && (
            <p className={`mt-4 text-center text-sm font-medium ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}

          <div className="text-center text-sm">
            <a href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150">
              Already have an account? Sign in
            </a>
          </div>
        </div>
      </div>
    );
}

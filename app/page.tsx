'use client'; 
import React, { useState } from 'react'; 
import Link from 'next/link'; 
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter(); 
    const [isLoading, setIsLoading] = useState(false);
    const [loadingRole, setLoadingRole] = useState<string | null>(null);
    const resetLoading = () => {
   resetLoading();
};
    const handleDemoLogin = async (role: string, redirectPath: string) => {
        
        if (isLoading) return; 

        // 1. Set loading state before starting the process (always)
        setIsLoading(true);
        setLoadingRole(role);

        const existingUserId = localStorage.getItem('userId');
        const existingUserRole = localStorage.getItem('userRole');

        // *--- CRUCIAL CHANGE AREA ---*
        // The loading state is now intentionally *NOT* cleared immediately here.
        // The state will remain TRUE until the router.push() takes over and unmounts the component.
        
        if (existingUserId && existingUserRole === role) {
            
            // Simulating a minimal processing delay for a better UX when redirecting from cache
            // This is optional but prevents an instantaneous flicker if the component is mounted very quickly.
            await new Promise(resolve => setTimeout(resolve, 300)); 
            
            router.push(redirectPath);
            // DO NOT clear state here. The component will unmount.
            return;
        }

        try {
            const response = await fetch('https://hms-backend-2k1m.onrender.com/api/auth/demo-login', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role }),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.userId) {
                    localStorage.setItem('userId', data.userId); 
                    localStorage.setItem('userRole', role); 
                }
                
                // Navigation will unmount this component, so loading state is naturally stopped.
                router.push(redirectPath);
                
            } else {
                console.error('Demo Login failed:', data.message);
                alert(`Demo login failed: ${data.message}`); 
                
                // Only clear state on failure so the user can try again
               resetLoading(); 
        
            }
        } catch (error) {
    console.error('Network or system error during demo login:', error);
    alert('Unable to connect to the demo server. Please try again in a moment.');
    
   resetLoading();
}
    };


    // ... (Rest of the component, Spinner, getDemoButtonContent, and JSX remains the same)
    const Spinner = () => (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    );

    const getDemoButtonContent = (role: string, icon: string, label: string) => {
        const isCurrentLoading = isLoading && loadingRole === role;
        
        const baseClasses = "flex flex-col items-center justify-center h-full p-4 rounded-xl font-semibold shadow-md transition-all duration-200";

        let roleClasses = "";
        switch (role) {
            case 'guest':
                roleClasses = 'bg-green-50 text-green-800 border-2 border-green-300 hover:bg-green-100 transform hover:scale-[1.05]';
                break;
            case 'receptionist':
                roleClasses = 'bg-blue-50 text-blue-800 border-2 border-blue-300 hover:bg-blue-100 transform hover:scale-[1.05]';
                break;
            case 'admin':
                roleClasses = 'bg-red-50 text-red-800 border-2 border-red-300 hover:bg-red-100 transform hover:scale-[1.05]';
                break;
            default:
                roleClasses = 'bg-gray-50 text-gray-800 border-2 border-gray-300 hover:bg-gray-100 transform hover:scale-[1.05]';
        }

        const loadingClasses = isCurrentLoading 
            ? 'opacity-70 cursor-not-allowed scale-100 bg-opacity-70'
            : ''; 

        return {
            className: `${baseClasses} ${roleClasses} ${loadingClasses}`,
            content: (
                <>
                    {isCurrentLoading ? (
                        <div className="flex items-center">
                            <Spinner /> 
                            <span className="text-sm font-bold">Loading...</span>
                        </div>
                    ) : (
                        <>
                            <span className="text-3xl mb-1">{icon}</span>
                            <span className="text-sm font-bold">{label}</span>
                        </>
                    )}
                </>
            ),
            disabled: isLoading, 
        };
    };

    const guestProps = getDemoButtonContent('guest', '👤', 'Guest Portal');
    const receptionistProps = getDemoButtonContent('receptionist', '👩‍💼', 'Reception Panel');
    const adminProps = getDemoButtonContent('admin', '👑', 'Admin Dashboard');

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 antialiased p-4 sm:p-8">

            <div className="bg-white rounded-3xl shadow-2xl shadow-blue-200 p-8 sm:p-12 max-w-4xl w-full text-center border border-gray-100 transform transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-300/50">
                
               <header className="mb-10">
  <h1 className="text-5xl sm:text-6xl font-black text-gray-900 mb-2 tracking-tight">
    <span className="text-indigo-600">HMS</span> Access Portal 🛎️
  </h1>

  {/* Dynamic animated message */}
  <p
    className={`text-lg mt-4 transition-all duration-300 ${
      isLoading 
        ? "text-red-600 animate-pulse" 
        : "text-gray-500"
    }`}
  >
    ☁️ Running on a shared cloud — loading might take a few seconds...
  </p>
</header>


                <hr className="border-gray-200 mb-10" />

                <div className="flex flex-col md:flex-row gap-8 lg:gap-12 text-left">

                    <section className="flex-1 md:w-1/3 p-6 bg-white rounded-xl border border-gray-200 shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Official Access</h2>
                        <div className="space-y-4 flex flex-col gap-2">
                            <Link href="/auth/login" passHref>
                                <button className="w-full bg-indigo-600 text-white py-3 px-6 rounded-xl text-lg font-bold shadow-lg shadow-indigo-500/50 hover:bg-indigo-700 transition duration-300 hover:scale-[1.01] border-b-4 border-indigo-800"
                                >
                                    Log In
                                </button>
                            </Link>

                            <Link href="/auth/register" passHref>
                                <button className="w-full bg-purple-600 text-white py-3 px-6 rounded-xl text-lg font-bold shadow-lg shadow-purple-500/50 hover:bg-purple-700 transition duration-300 hover:scale-[1.01] border-b-4 border-purple-800"
                                >
                                    Register New Account
                                </button>
                            </Link>
                        </div>
                    </section>

                    <section className="md:w-2/3 p-6 bg-white rounded-xl border border-gray-200 shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Quick Demo Access</h2>
                        <p className="text-base text-gray-500 mb-6">
                            Select a role to instantly view the corresponding dashboard (no login required).
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            
                            <button 
                                onClick={() => handleDemoLogin('guest', '/features/guest')}
                                className={guestProps.className}
                                disabled={guestProps.disabled}
                            >
                                {guestProps.content}
                            </button>

                            <button 
                                onClick={() => handleDemoLogin('receptionist', '/features/receptionist')}
                                className={receptionistProps.className}
                                disabled={receptionistProps.disabled}
                            >
                                {receptionistProps.content}
                            </button>

                            <button 
                                onClick={() => handleDemoLogin('admin', '/features/admine')}
                                className={adminProps.className}
                                disabled={adminProps.disabled}
                            >
                                {adminProps.content}
                            </button>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
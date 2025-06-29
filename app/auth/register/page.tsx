'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '../../lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await registerUser({ name, email, password });
      router.push('/rooms');
    } catch {
      alert('Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="w-full border px-3 py-2" />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border px-3 py-2" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border px-3 py-2" />
        <button type="submit" className="bg-green-500 text-white px-4 py-2">Register</button>
      </form>
    </div>
  );
}

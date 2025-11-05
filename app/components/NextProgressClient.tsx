"use client"; // REQUIRED: Makes this component run on the client side

import NextNProgress from 'nextjs-progressbar';
import 'nprogress/nprogress.css';

export function NextProgressClient() {
  return (
    <NextNProgress 
      // Customize these props to match your application's design
      color="#3b82f6"     // Tailwind blue-500 for a professional look
      startPosition={0.3}  // Bar starts at 30% width
      stopDelayMs={200}    // Wait 200ms after completion before hiding
      height={3}           // 3px thickness
      showOnShallow={true} // Crucial for client-side fetches
      options={{ showSpinner: false }} // Hide the small loading spinner
    />
  );
}
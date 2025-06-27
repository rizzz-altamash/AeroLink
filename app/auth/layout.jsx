import { Suspense } from 'react';

export default function AuthLayout({ children }) {
  return (
    <Suspense fallback={<div className="text-white p-10">Loading...</div>}>
      {children}
    </Suspense>
  );
}
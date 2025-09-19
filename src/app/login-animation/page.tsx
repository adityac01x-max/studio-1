
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/logo';
import './login-animation.css';

export default function LoginAnimationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role');

  useEffect(() => {
    const timer = setTimeout(() => {
      switch (role) {
        case 'tourist':
          router.push('/dashboard');
          break;
        case 'agency':
          router.push('/agency/dashboard');
          break;
        case 'admin':
          router.push('/admin');
          break;
        default:
          router.push('/login');
          break;
      }
    }, 2500); // 2.5 seconds delay

    return () => clearTimeout(timer);
  }, [router, role]);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background p-4">
      <div className="animation-container">
        <Logo className="text-6xl" />
      </div>
    </div>
  );
}


'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/logo';
import './login-animation.css';

function LoginAnimation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role');
  
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
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
    }, 1500); // Wait for animation to finish

    return () => {
        clearTimeout(redirectTimer);
    };
  }, [router, role]);

  return (
    <div className="animation-container">
        <Logo className="text-6xl" />
    </div>
  );
}


export default function LoginAnimationPage() {

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background p-4 overflow-hidden">
        <Suspense fallback={<div>Loading...</div>}>
            <LoginAnimation />
        </Suspense>
    </div>
  );
}


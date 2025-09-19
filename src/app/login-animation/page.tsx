
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useEmblaCarousel from 'embla-carousel-react';
import { Logo } from '@/components/logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import './login-animation.css';

const carouselImages = PlaceHolderImages.filter(p => p.id.startsWith('location-'));

export default function LoginAnimationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role');
  const [animationStage, setAnimationStage] = useState('logo');

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollNext = useCallback(() => {
    if (emblaApi) {
        emblaApi.scrollNext();
    }
  }, [emblaApi]);

  useEffect(() => {
    // Stage 1: Logo animation
    const logoTimer = setTimeout(() => {
      setAnimationStage('carousel');
    }, 1500); // Show logo for 1.5s

    // Total animation time before redirect
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
    }, 5000); // Total time: 5 seconds

    return () => {
        clearTimeout(logoTimer);
        clearTimeout(redirectTimer);
    };
  }, [router, role]);

  useEffect(() => {
     if (animationStage === 'carousel' && emblaApi) {
        const interval = setInterval(scrollNext, 800); // Fast transition
        return () => clearInterval(interval);
     }
  }, [animationStage, emblaApi, scrollNext])

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background p-4 overflow-hidden">
      <div className={cn(
        "absolute inset-0 transition-opacity duration-500",
        animationStage === 'logo' ? 'opacity-100' : 'opacity-0'
      )}>
        <div className="flex h-full w-full items-center justify-center">
            <div className="animation-container">
                <Logo className="text-6xl" />
            </div>
        </div>
      </div>
      
       <div className={cn(
        "absolute inset-0 transition-opacity duration-500",
        animationStage === 'carousel' ? 'opacity-100' : 'opacity-0'
      )}>
        <div className="embla" ref={emblaRef}>
            <div className="embla__container">
                {carouselImages.map((img, index) => (
                    <div className="embla__slide" key={index}>
                        <Image
                            src={img.imageUrl}
                            alt={img.description}
                            fill
                            className="object-cover"
                            priority={index === 0}
                            data-ai-hint={img.imageHint}
                        />
                         <div className="absolute inset-0 bg-black/30" />
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}

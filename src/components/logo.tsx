import { Compass } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 text-xl font-bold font-headline text-primary", className)}>
      <Compass className="h-6 w-6" />
      <span>Questify</span>
    </Link>
  );
}

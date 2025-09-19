'use client';

import { useState, useEffect } from 'react';
import { Siren, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

export function SosButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const { toast } = useToast();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isOpen && countdown === 0) {
      handleSosConfirm();
    }
    return () => clearTimeout(timer);
  }, [isOpen, countdown]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setCountdown(5);
    }
  };

  const handleSosConfirm = () => {
    // In a real app, this would trigger a server action to notify admins
    console.log('SOS Alert Triggered!');
    toast({
      title: 'SOS Alert Sent',
      description: 'Your alert has been sent to our support team. Help is on the way.',
      variant: 'destructive',
    });
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="icon"
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl z-50 animate-pulse"
        >
          <Siren className="h-8 w-8" />
          <span className="sr-only">SOS</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 font-headline">
            <ShieldAlert className="text-destructive" />
            Confirm SOS Alert
          </AlertDialogTitle>
          <AlertDialogDescription>
            You are about to send an emergency alert. This action should only be used in genuine emergencies. An alert will be sent in {countdown} seconds.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
            <Progress value={((5 - countdown) / 5) * 100} className="h-2" />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/90"
            onClick={handleSosConfirm}
          >
            Confirm Now
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

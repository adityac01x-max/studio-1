

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { ArrowRight, Shield, User, Building2 } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background p-4 overflow-hidden">
        <div className="absolute top-8 left-8 animate-slide-in-from-left">
            <Logo />
        </div>
      <Card className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Choose your role to sign in.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <Button asChild className="w-full" size="lg">
                <Link href="/login-animation?role=tourist">
                    <User className="mr-2"/>
                    Login as a Tourist
                    <ArrowRight className="ml-auto" />
                </Link>
            </Button>
            <Button asChild className="w-full" size="lg" variant="outline">
                <Link href="/login-animation?role=agency">
                    <Building2 className="mr-2"/>
                    Login as an Agency
                    <ArrowRight className="ml-auto" />
                </Link>
            </Button>
            <Button asChild className="w-full" variant="outline" size="lg">
                <Link href="/login-animation?role=admin">
                    <Shield className="mr-2"/>
                    Login as an Admin
                    <ArrowRight className="ml-auto" />
                </Link>
            </Button>
        </CardContent>
      </Card>
      <div className="mt-6 text-center animate-slide-in-from-right">
        <p className="text-muted-foreground">
          Want to partner with us?{' '}
          <Link href="/enlist-agency" className="text-primary hover:underline font-semibold">
            Enlist your agency
          </Link>
        </p>
      </div>
    </div>
  );
}


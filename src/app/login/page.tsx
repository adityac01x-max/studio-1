

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { ArrowRight, Shield, User, Building2 } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background p-4">
        <div className="absolute top-8 left-8">
            <Logo />
        </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl">Welcome Back</CardTitle>
          <CardDescription>Choose your role to sign in.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <Button asChild className="w-full" size="lg">
                <Link href="/dashboard">
                    <User className="mr-2"/>
                    Login as a Tourist
                    <ArrowRight className="ml-auto" />
                </Link>
            </Button>
            <Button asChild className="w-full" variant="outline" size="lg">
                <Link href="/admin">
                    <Shield className="mr-2"/>
                    Login as an Admin
                    <ArrowRight className="ml-auto" />
                </Link>
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Compass, Shield, Languages } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'landing-hero');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Logo />
        <Button asChild>
          <Link href="/login">Get Started <ArrowRight className="ml-2" /></Link>
        </Button>
      </header>

      <main className="flex-grow">
        <section className="relative py-20 md:py-32 flex items-center">
          <div className="absolute inset-0">
            <Image
              src={heroImage?.imageUrl || "https://picsum.photos/seed/bharat/1800/1200"}
              alt="Indian Landscape"
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImage?.imageHint}
            />
            <div className="absolute inset-0 bg-background/60 dark:bg-background/80" />
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
            <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight text-foreground">
              Discover Your Next Adventure
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-foreground/80">
              Your ultimate travel companion for exploring vibrant cultures, breathtaking landscapes, and hidden gems around the world.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild>
                <Link href="/login">
                  Start Your Journey
                  <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 bg-background/80">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-headline text-3xl font-bold text-center mb-12">Features Designed for the Modern Traveler</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                    <Compass className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline mt-4">Smart Itinerary Planner</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Get AI-powered itinerary suggestions based on your interests and explore locations with detailed insights on weather, news, and attractions.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline mt-4">SOS & Safety</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Travel with peace of mind. Our SOS alert system ensures help is just a tap away, connecting you to our support team instantly.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                    <Languages className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline mt-4">Multilingual Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Communicate effortlessly with our multilingual AI chatbot, ready to assist you in your native language anytime, anywhere.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-secondary-foreground">
          <p>&copy; {new Date().getFullYear()} Questify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

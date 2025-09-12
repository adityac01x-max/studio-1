
import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AgencyDashboardPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold font-headline">Agency Dashboard</h1>
        <Card>
            <CardHeader>
                <CardTitle>Welcome, Agency Partner!</CardTitle>
                <CardDescription>This is your dashboard to manage your services and bookings.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>More features coming soon!</p>
            </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

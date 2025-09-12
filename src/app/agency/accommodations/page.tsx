
'use client';

import { useState } from 'react';
import { PlusCircle, MoreHorizontal, Hotel, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';
import { AppShell } from '@/components/app-shell';
import { AccommodationForm } from './accommodation-form';

type Accommodation = {
    id: string;
    name: string;
    location: string;
    price: number;
    status: 'Listed' | 'Unlisted';
    imageUrl: string;
    imageHint: string;
};

const mockAccommodations: Accommodation[] = [
  {
    id: '1',
    name: 'Sunrise Resort',
    location: 'Goa',
    price: 8000,
    status: 'Listed',
    imageUrl: `https://picsum.photos/seed/sunrise-resort/200/150`,
    imageHint: 'beach resort',
  },
  {
    id: '2',
    name: 'Mountain View Homestay',
    location: 'Shimla',
    price: 4500,
    status: 'Listed',
    imageUrl: `https://picsum.photos/seed/mountain-view/200/150`,
    imageHint: 'mountain homestay',
  },
  {
    id: '3',
    name: 'City Palace Hotel',
    location: 'Jaipur',
    price: 12000,
    status: 'Unlisted',
    imageUrl: `https://picsum.photos/seed/city-palace/200/150`,
    imageHint: 'heritage hotel',
  },
];

export default function ManageAccommodationsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAccommodation, setSelectedAccommodation] = useState<Accommodation | null>(null);

  const handleAddClick = () => {
    setSelectedAccommodation(null);
    setDialogOpen(true);
  }

  const handleEditClick = (accommodation: Accommodation) => {
    setSelectedAccommodation(accommodation);
    setDialogOpen(true);
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-headline">Manage Accommodations</h1>
            <p className="text-muted-foreground">Add, edit, or remove your property listings.</p>
          </div>
          <Button onClick={handleAddClick}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Accommodation
          </Button>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>
                        {selectedAccommodation ? 'Edit Accommodation' : 'Add a New Accommodation'}
                    </DialogTitle>
                </DialogHeader>
                <AccommodationForm accommodationToEdit={selectedAccommodation} setDialogOpen={setDialogOpen} />
            </DialogContent>
        </Dialog>

        <Card>
          <CardHeader>
            <CardTitle>Your Properties</CardTitle>
            <CardDescription>A list of all accommodations managed by your agency.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Price (per night)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAccommodations.map((acc) => (
                  <TableRow key={acc.id}>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <Image src={acc.imageUrl} alt={acc.name} width={100} height={75} className="rounded-md object-cover" data-ai-hint={acc.imageHint} />
                        <span className="font-medium">{acc.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{acc.location}</TableCell>
                    <TableCell>₹{acc.price.toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                      <Badge variant={acc.status === 'Listed' ? 'default' : 'secondary'}>{acc.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onSelect={() => handleEditClick(acc)}>
                            <Edit className="mr-2 h-4 w-4"/> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4"/> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

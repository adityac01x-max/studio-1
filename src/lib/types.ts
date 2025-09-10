export type Trip = {
  id: string;
  tripNumber: string;
  origin: string;
  destination: string;
  startTime: Date;
  mode: 'flight' | 'train' | 'bus' | 'car';
  travelers: string[];
  status: 'Completed' | 'Upcoming' | 'In Progress';
};

export type SOSAlert = {
  id: string;
  location: string;
  time: Date;
  userName: string;
  status: 'Pending' | 'Resolved' | 'In Progress';
};

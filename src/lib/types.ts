

export type DailyDetail = {
  date: Date;
  accommodation?: string;
  placesVisited?: string;
  notes?: string;
  cost?: number;
  food?: string;
  foodCost?: number;
  localTravelCost?: number;
  media?: any[];
};

export type Trip = {
  id: string;
  tripNumber: string;
  origin: string;
  destination: string;
  startTime: Date;
  mode: 'flight' | 'train' | 'bus' | 'car';
  travelers: string[];
  status: 'Completed' | 'Upcoming' | 'In Progress';
  accommodation?: {
    name: string;
    type: string; // Keep as string to accommodate generated data e.g. "Hotel", "Resort"
  };
  visitedPlaces?: {
    name: string;
    rating: number;
    review: string;
  }[];
  tripExperience?: string;
  dailyDetails?: DailyDetail[];
  travelCost?: number;
  totalCost?: number;
  media?: any[];
};

export type SOSAlert = {
  id: string;
  location: string;
  time: Date;
  userName: string;
  status: 'Pending' | 'Resolved' | 'In Progress';
  resolution?: string;
  caseId?: string;
};

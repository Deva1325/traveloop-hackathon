export const mockUser = {
  id: 'u1',
  name: 'Alex Traveler',
  email: 'alex@traveloop.com',
  avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
};

export const mockTrips = [
  {
    id: 't1',
    title: 'Summer in Europe',
    description: 'Backpacking through Italy, France, and Spain',
    coverImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80',
    startDate: '2026-06-10',
    endDate: '2026-07-15',
    budget: 5000,
    status: 'planned',
    destinations: ['Rome', 'Paris', 'Barcelona'],
  },
  {
    id: 't2',
    title: 'Tokyo Adventures',
    description: 'Exploring the neon streets of Tokyo',
    coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
    startDate: '2026-10-05',
    endDate: '2026-10-20',
    budget: 3500,
    status: 'draft',
    destinations: ['Tokyo', 'Kyoto'],
  }
];

export const mockCities = [
  { id: 'c1', name: 'Rome', country: 'Italy', costIndex: '$$$', popularity: 98, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=400&q=80' },
  { id: 'c2', name: 'Paris', country: 'France', costIndex: '$$$$', popularity: 99, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80' },
  { id: 'c3', name: 'Barcelona', country: 'Spain', costIndex: '$$', popularity: 95, image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=400&q=80' },
  { id: 'c4', name: 'Tokyo', country: 'Japan', costIndex: '$$$$', popularity: 97, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=400&q=80' },
];

export const mockActivities = [
  { id: 'a1', title: 'Colosseum Tour', cityId: 'c1', category: 'Culture', duration: '3h', cost: 50, rating: 4.8, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=400&q=80' },
  { id: 'a2', title: 'Eiffel Tower Sunrise', cityId: 'c2', category: 'Sightseeing', duration: '2h', cost: 30, rating: 4.9, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80' },
];

import { mockTrips } from '@/data/mockData';

// Simulated delay to mimic network request
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getTrips = async () => {
  await delay(500);
  return mockTrips;
};

export const getTripById = async (id) => {
  await delay(500);
  const trip = mockTrips.find((t) => t.id === id);
  if (!trip) throw new Error('Trip not found');
  return trip;
};

export const createTrip = async (tripData) => {
  await delay(800);
  const newTrip = {
    ...tripData,
    id: `t${Date.now()}`,
    status: 'draft',
    destinations: tripData.destinations || [],
  };
  mockTrips.push(newTrip);
  return newTrip;
};

export const updateTrip = async (id, tripData) => {
  await delay(500);
  const index = mockTrips.findIndex((t) => t.id === id);
  if (index === -1) throw new Error('Trip not found');
  mockTrips[index] = { ...mockTrips[index], ...tripData };
  return mockTrips[index];
};

export const deleteTrip = async (id) => {
  await delay(500);
  const index = mockTrips.findIndex((t) => t.id === id);
  if (index === -1) throw new Error('Trip not found');
  mockTrips.splice(index, 1);
  return { success: true };
};

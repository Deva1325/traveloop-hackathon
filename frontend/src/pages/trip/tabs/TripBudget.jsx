import { useOutletContext } from 'react-router-dom';
import TripBudgetTab from '@/components/trips/TripBudgetTab';

export default function TripBudget() {
  const { trip } = useOutletContext();
  return <TripBudgetTab tripId={trip.id} />;
}

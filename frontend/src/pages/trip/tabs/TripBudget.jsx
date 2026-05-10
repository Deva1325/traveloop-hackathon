import { useOutletContext } from 'react-router-dom';

export default function TripBudget() {
  const { trip } = useOutletContext();
  return (
    <div className="p-4 bg-card rounded-2xl shadow-sm border">
      <h2 className="text-xl font-bold">Budget</h2>
      <p className="text-muted-foreground mt-2">Total Budget: ${trip.budget}</p>
    </div>
  );
}

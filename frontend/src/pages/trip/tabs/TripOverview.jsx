import { useOutletContext } from 'react-router-dom';

export default function TripOverview() {
  const { trip } = useOutletContext();
  
  return (
    <div className="space-y-6 animate-in fade-in">
      <h2 className="text-2xl font-bold">Trip Overview</h2>
      <div className="bg-card p-6 rounded-2xl shadow-sm border">
        <p className="text-muted-foreground">{trip.description || 'No description provided.'}</p>
      </div>
      {/* More overview content here */}
    </div>
  );
}

import { useOutletContext } from 'react-router-dom';

export default function TripNotes() {
  const { trip } = useOutletContext();
  return (
    <div className="p-4 bg-card rounded-2xl shadow-sm border">
      <h2 className="text-xl font-bold">Notes & Journal</h2>
    </div>
  );
}

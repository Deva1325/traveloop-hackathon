import { useOutletContext } from 'react-router-dom';

export default function TripChecklist() {
  const { trip } = useOutletContext();
  return (
    <div className="p-4 bg-card rounded-2xl shadow-sm border">
      <h2 className="text-xl font-bold">Packing Checklist</h2>
    </div>
  );
}

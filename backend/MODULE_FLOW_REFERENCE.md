# Module Flow Reference

## Modules

- **Auth**: Login, Register, Refresh Token (creates UserSession).
- **Trips**: Trip CRUD. Interacts with Cities.
- **Itinerary**: TripStops, StopActivities. Requires transaction when reordering.
- **Expenses**: Bound to TripId. Summing expenses gives current budget.
- **Checklist**: Bound to TripId. Simple PackingItems.

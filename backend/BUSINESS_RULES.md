# Business Rules

- StartDate must be earlier than EndDate.
- Soft Deletes via `IsActive` or Paranoid tables where specified.
- Public Sharing: requires unique ShareSlug generation.
- Owner Checks: Only the UserId matching the Trip's UserId can mutate the Trip.

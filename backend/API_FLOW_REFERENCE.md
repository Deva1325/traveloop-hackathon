# API Flow Reference

## Route -> Controller -> Service -> Repository

1. **Route Level (`/routes`)**: Defines endpoints and attaches middlewares (Auth, Rate Limit, Validation).
2. **Controller Level (`/controllers`)**: Parses req/res, extracts data, calls services, sends standard response.
3. **Service Level (`/services`)**: Core business logic, transaction boundaries, orchestration of multiple repositories.
4. **Repository Level (`/repositories`)**: Abstract DB operations, raw Sequelize calls, ensures separation from DB syntax in services.

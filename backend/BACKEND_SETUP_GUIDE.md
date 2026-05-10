# Setup Guide

1. `npm install`
2. Copy `.env.example` to `.env` and configure DB credentials.
3. Setup local SQL Server or use Docker: `docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=your_password" -p 1433:1433 -d mcr.microsoft.com/mssql/server:2022-latest`
4. Run `npm run dev`

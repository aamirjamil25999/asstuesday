# Food Order Lifecycle (Node.js Microservices + React)

Implements the assignment with 3 services + React SPA and Docker Compose.
follow

## Services
- **order-service (3001)**: State machine + persistence (JSON). RBAC & transitions.
- **restaurant-service (3002)**: Facade → forwards to order-service with RESTAURANT role.
- **delivery-service (3003)**: Facade → forwards to order-service with DRIVER role.
- **frontend-react (3000)**: React UI with 3 panels (User/Restaurant/Driver).

## Lifecycle
`PENDING → ACCEPTED → PREPARED → PICKED_UP → DELIVERED`  
Cancellation allowed **only from PENDING**.

## Run with Docker
```bash
docker compose up --build
# Frontend → http://localhost:3000
# Order    → http://localhost:3001
# Restaurant → http://localhost:3002
# Delivery → http://localhost:3003
```

## Run locally (no Docker)
```bash
# Order
cd order-service && npm i
ROLE_USER_TOKEN=usertoken123 ROLE_RESTAURANT_TOKEN=resttoken123 ROLE_DRIVER_TOKEN=drivertoken123 npm start

# Restaurant
cd ../restaurant-service && npm i
ORDER_BASE=http://localhost:3001 ROLE_RESTAURANT_TOKEN=resttoken123 npm start

# Delivery
cd ../delivery-service && npm i
ORDER_BASE=http://localhost:3001 ROLE_DRIVER_TOKEN=drivertoken123 npm start

# Frontend
cd ../frontend-react && npm i
cp .env.example .env
npm run dev  # http://localhost:3000
```

## Tokens (defaults)
- USER: `usertoken123`
- RESTAURANT: `resttoken123`
- DRIVER: `drivertoken123`
You can override via env.

## Notes
- Persistence via JSON file for simplicity.
- State rules centralized in order-service.
- Facade services demonstrate inter-service communication.
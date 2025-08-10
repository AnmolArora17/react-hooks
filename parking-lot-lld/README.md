# Parking Lot - Low Level Design (Node.js)

This project provides a clean, extensible low-level design (LLD) for a Parking Lot system in Node.js using modular classes and clear separation of concerns.

Key components:

- Vehicles and Parking Spots with compatibility rules
- Floors and Parking Lot composition
- Spot allocation strategies (Strategy Pattern)
- Tickets, Rate calculation, and Payment processing
- Entry/Exit gates mediated by a Parking Manager

Run the demo:

```
npm start
```

High-level Modules:

- `src/constants.js`: Types/enums and compatibility matrix
- `src/core/*.js`: Core domain entities (Vehicle, ParkingSpot, Ticket, RateCard, Payment, Gate)
- `src/lot/*.js`: Composition for Floor and ParkingLot
- `src/allocators/*.js`: Spot allocation strategies
- `src/managers/*.js`: ParkingManager orchestrates flows
- `src/demo.js`: Runnable example

Design choices:

- Strategy pattern for spot allocation allows swapping algorithms without changing domain code
- RateCard encapsulates pricing logic separately from flow control
- ParkingManager is the façade for entry/exit interactions, keeping `ParkingLot` as a composition object
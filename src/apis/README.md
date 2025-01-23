# Apis Layer

## Overview
The `apis` layer is responsible for defining and managing the application's RESTful API endpoints. This layer includes controllers, DTOs (Data Transfer Objects), and other components that directly handle HTTP requests and responses.

### Key Responsibilities:
- Define controllers for handling API requests and returning responses.
- Implement DTOs to validate and structure incoming and outgoing data.
- Ensure adherence to RESTful principles, including endpoint versioning.

## Usage Guidelines

### Structure
The `apis` folder typically contains controllers and DTOs organized by namespaces:
```
apis/
├── health/
│ ├── health.controller.ts
│ ├── health.api.ts
│ ├── health-status.dto.ts
├── user/
│ ├── user.controller.ts
│ ├── user.api.ts
│ ├── user.dto.ts
```

# Bus Counter API - Coding Standards

This document outlines the coding standards and architectural patterns for the Bus Counter API project. Following these standards ensures consistency, maintainability, and scalability across the codebase.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Domain-Driven Design (DDD)](#domain-driven-design-ddd)
4. [Dependency Injection](#dependency-injection)
5. [Error Handling](#error-handling)
6. [File Naming Conventions](#file-naming-conventions)
7. [Code Style Conventions](#code-style-conventions)
8. [Validation](#validation)
9. [Response Formatting](#response-formatting)
10. [Date/Time Handling](#datetime-handling)
11. [Database Operations](#database-operations)
12. [Unit of Work Pattern](#unit-of-work-pattern)

## Architecture Overview

The Bus Counter API follows a Domain-Driven Design (DDD) architecture with clear separation of concerns:

- **Domain-driven design** with bounded contexts
- **Dependency injection** using Awilix
- **Layered architecture** with handlers, services, and repositories
- **Error handling** at multiple layers
- **Unit of Work pattern** for transaction management

## Project Structure

```
├── cmd/                    # Application entry points
│   ├── main.js            # Main application entry point
│   ├── route.js           # Route definitions with DI
│   ├── config.js          # Configuration management
│   └── di.js              # Dependency injection setup
├── domain/                # Domain modules
│   ├── auth/              # Authentication domain
│   ├── bus/               # Bus management domain
│   └── counter/           # Counter management domain
├── middleware/            # Express middleware
├── prisma/               # Database schema and client
├── util/                 # Utility functions
└── generated/            # Generated files
```

## Domain-Driven Design (DDD)

The project is organized into three distinct domains, each with its own responsibilities:

### Auth Domain
- **Location**: [`domain/auth/`](domain/auth/)
- **Responsibilities**:
  - Key generation
  - Device registration
  - Validation

### Bus Manager Domain
- **Location**: [`domain/bus/`](domain/bus/)
- **Responsibilities**:
  - Bus management
  - Door management
  - Device management

### Counter Domain
- **Location**: [`domain/counter/`](domain/counter/)
- **Responsibilities**:
  - Device communication
  - Count management
  - Data export

Each domain follows a consistent structure:
- `domainname.handler.js` - HTTP request handlers
- `domainname.service.js` - Business logic
- `domainname.repo.js` - Data access layer
- `domainname.validate.js` - Validation schemas (if applicable)

## Dependency Injection

The project uses [Awilix](https://github.com/jeffijoe/awilix) for dependency injection:

- **Configuration**: [`cmd/di.js`](cmd/di.js)
- **Usage in Routes**: [`cmd/route.js`](cmd/route.js)

```javascript
import { makeInvoker } from "awilix-express";
import BusHandler from "../domain/bus/bus.handler.js";

const setupRoutes = () => {
  const router = express.Router();
  const busApi = makeInvoker(BusHandler);
  
  router.get("/bus/:id", busApi("getBus"));
  
  return router;
};
```

## Error Handling

Error handling is implemented at two layers: handlers and repositories.

### Service Layer
Services use the [`AppError`](util/error.js:4) class to send errors to handlers:

```javascript
import { AppError } from "../util/error.js";

// In service
if (!device) {
  throw AppError.NotFound("Device not found");
}
```

### Repository Layer
Repositories throw Prisma errors which are handled by the service layer:

```javascript
// In repository
const device = await this.db.device.findUnique({ where: { id } });
if (!device) {
  throw new Prisma.PrismaClientKnownRequestError("Record not found", "P2025");
}
```

### Handler Layer
Handlers use [`AppError.handleError()`](util/error.js:151) to handle all errors:

```javascript
import { AppError } from "../util/error.js";

// In handler
try {
  const result = await this.busService.getBus(id);
  res.json(ResponseFormatter.success(result));
} catch (error) {
  AppError.handleError(res, error);
}
```

### Error Class Features
The [`AppError`](util/error.js:4) class provides:
- HTTP status code mapping
- Static factory methods for common errors
- Prisma error conversion
- Consistent error response format

## File Naming Conventions

- **Pattern**: `feature.duty.js`
- **Examples**:
  - `bus.service.js`
  - `bus.handler.js`
  - `bus.repo.js`
  - `auth.validate.js`

## Code Style Conventions

- **Naming**: CamelCase for variables and functions
- **Imports**: ES6 module syntax
- **Classes**: PascalCase for class names
- **Constants**: UPPER_SNAKE_CASE for constants

## Validation

Validation is implemented using [Yup](https://github.com/jquense/yup):

- **Location**: `domainname/domainname.validate.js`
- **Example**:

```javascript
import * as yup from 'yup';

export const busSchema = yup.object({
  name: yup.string().required(),
  capacity: yup.number().positive().required(),
  route: yup.string().required()
});
```

## Response Formatting

All API responses use the [`ResponseFormatter`](util/response.js:1) class:

```javascript
import ResponseFormatter from "../util/response.js";

// Success response
res.json(ResponseFormatter.success(data));

// Paginated response
res.json(ResponseFormatter.pagination(data, total, limit, page));
```

## Date/Time Handling

All date/time operations use the [`Helper`](util/helper.js:3) class with [Day.js](https://day.js.org/):

```javascript
import Helper from "../util/helper.js";

// Current timestamp
const now = Helper.getCurrentTimestamp();

// Format date
const formatted = Helper.formatDate(date, "YYYY-MM-DD");

// Date operations
const future = Helper.addToDate(date, 7, "day");
```

## Database Operations

### Repository Pattern
All repositories follow these guidelines:
- Use [`getDBFromContext()`](util/uow.js:67) to get the database client
- Handle Prisma errors appropriately
- Follow the repository pattern for data access

```javascript
import { getDBFromContext } from "../util/uow.js";

class BusRepo {
  async getBus(id) {
    const db = getDBFromContext();
    return await db.bus.findUnique({ where: { id } });
  }
}
```

## Unit of Work Pattern

The project implements a Unit of Work pattern using [`util/uow.js`](util/uow.js):

### In Service Layer
For data manipulation operations (create, update, delete), use the Unit of Work:

```javascript
import { uow } from "../util/uow.js";

class BusService {
  async createBus(busData) {
    return await uow.execute(async () => {
      // All operations here will be in a single transaction
      const bus = await this.busRepo.create(busData);
      await this.auditRepo.logCreation(bus.id);
      return bus;
    });
  }
}
```

### Unit of Work Features
- Automatic transaction management
- Transaction context propagation
- Nested transaction support
- Database client context management

## Best Practices

1. **Always use the Unit of Work** for operations that modify data
2. **Handle errors consistently** using the AppError class
3. **Follow the naming conventions** for files and functions
4. **Validate all inputs** using Yup schemas
5. **Use dependency injection** instead of direct instantiation
6. **Keep domains isolated** - avoid cross-domain dependencies
7. **Use the Helper class** for all date/time operations
8. **Format responses consistently** using ResponseFormatter

## Code Examples

### Complete Handler Example

```javascript
import { AppError } from "../../util/error.js";
import ResponseFormatter from "../../util/response.js";

class BusHandler {
  constructor({ busService }) {
    this.busService = busService;
  }

  async getBus(req, res) {
    try {
      const { id } = req.params;
      const bus = await this.busService.getBus(id);
      
      if (!bus) {
        return AppError.handleError(res, AppError.NotFound("Bus not found"));
      }
      
      res.json(ResponseFormatter.success(bus));
    } catch (error) {
      AppError.handleError(res, error);
    }
  }
}

export default BusHandler;
```

### Complete Service Example

```javascript
import { AppError } from "../../util/error.js";
import { uow } from "../../util/uow.js";

class BusService {
  constructor({ busRepo, auditRepo }) {
    this.busRepo = busRepo;
    this.auditRepo = auditRepo;
  }

  async getBus(id) {
    const bus = await this.busRepo.getBus(id);
    
    if (!bus) {
      throw AppError.NotFound("Bus not found");
    }
    
    return bus;
  }

  async createBus(busData) {
    return await uow.execute(async () => {
      const bus = await this.busRepo.create(busData);
      await this.auditRepo.logCreation(bus.id);
      return bus;
    });
  }
}

export default BusService;
```

### Complete Repository Example

```javascript
import { getDBFromContext } from "../../util/uow.js";

class BusRepo {
  async getBus(id) {
    const db = getDBFromContext();
    return await db.bus.findUnique({ where: { id } });
  }

  async create(busData) {
    const db = getDBFromContext();
    return await db.bus.create({ data: busData });
  }
}

export default BusRepo;
```

## Conclusion

Following these coding standards ensures a consistent, maintainable, and scalable codebase. All team members should adhere to these guidelines when working on the Bus Counter API project.
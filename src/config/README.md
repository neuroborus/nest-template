# Config Layer

## Overview
The `config` layer is responsible for managing the application's configuration settings.  
This includes both dynamic configurations and a static configuration for scenarios where dependency injection is unavailable.

### Key Responsibilities:
- Load environment variables using `dotenv` and provide them through the `ConfigModule`.
- Serve as the single source of truth for application configuration.
- Provide a static fallback (`staticConfig`) for rare edge cases where dependency injection does not work.

### Best Practices
1. **Environment Variables:** Use `.env` files to define all required environment variables. Ensure sensitive data (e.g., API keys, secrets) is not hardcoded.
2. **Dynamic Configuration:** Use the `ConfigModule` to manage and provide configuration settings across the application via dependency injection.
3. **Static Fallback:** Use `staticConfig` sparingly for cases where dependency injection is not available, such as during the initial application bootstrap.
4. **Manual Mapping:** All variables added to `.env` must be explicitly mapped in `staticConfig`, which can then be reused across the application.
5. **Dynamic Loading:** For dynamically loading environment variables, you can use the `configuration()` function.
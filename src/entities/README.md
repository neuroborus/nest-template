# Entities Layer

## Overview
The `entities` layer is a centralized location for defining and managing core application entities. These entities are fundamental to the application and are designed for global access across various layers and modules.

### Key Responsibilities:
- Define the data models and structures that represent the core concepts of the application.
- Serve as a shared resource, accessible across the application.
- Ensure consistency and reusability of entity definitions.

## Usage Guidelines
### Structure
The `entities` folder should contain folders/files representing the key entities of the application.  
Each file typically defines an entity class and any associated interfaces or types.

Example structure:

```
entities/  
├── health  
├── product  
├── order 
```

### Best Practices
1. **Global Accessibility:** Ensure that entities are designed for use across different layers and modules without requiring duplication.
2. **Consistency:** Use consistent naming conventions and structure for all entity files.
3. **Keep Entities Simple:** Avoid embedding complex business logic within entities; focus on defining the structure and relationships of data.

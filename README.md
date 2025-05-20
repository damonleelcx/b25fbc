# Journey Builder

A Next.js application for rendering form-based workflows with prefill configuration.

## Features

- Display a list of forms from a blueprint graph
- Configure form field prefill values from various data sources:
  - Direct dependencies
  - Transitive dependencies
  - Global data sources
- Extensible architecture for adding new prefill data sources

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/journey-builder.git
cd journey-builder
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Prepare the data:
- Copy the provided JSON file to `public/graph.json`

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `src/app/api/blueprint/route.ts`: Mock API endpoint for retrieving the blueprint data
- `src/components/`: React components for the UI
- `src/hooks/`: Custom React hooks for data management
- `src/lib/`: Utility functions and type definitions
- `public/graph.json`: Blueprint data in JSON format

## Extending the Application

### Adding New Prefill Data Sources

The application is designed to be easily extensible with new prefill data sources. To add a new data source:

1. Create a new class that implements the `DataSourceProvider` interface in `src/lib/prefillDataSources.ts`:

```typescript
export class MyNewDataSourceProvider implements DataSourceProvider {
  getDataSources(formNodeId: string, graph: BlueprintGraph): PrefillSource[] {
    // Implement your logic to provide data sources
    return [
      {
        type: PrefillSourceType.MY_NEW_TYPE, // Add a new type to the PrefillSourceType enum
        id: 'my_source_id',
        name: 'My New Data Source',
        fields: [
          { id: 'field1', name: 'Field 1' },
          { id: 'field2', name: 'Field 2' }
        ]
      }
    ];
  }
}
```

2. Register your new provider in the `PrefillDataSourceFactory` constructor:

```typescript
constructor() {
  // Register default providers
  this.registerProvider(new DirectDependencyProvider());
  this.registerProvider(new TransitiveDependencyProvider());
  this.registerProvider(new GlobalDataProvider());
  this.registerProvider(new MyNewDataSourceProvider()); // Add your new provider
}
```

3. If needed, update the `PrefillSourceType` enum in `src/lib/types.ts` to include your new source type.

### Adding New UI Components

To extend the UI with new components:

1. Create your component in the `src/components/` directory
2. Import and use it where needed

### Modifying Form Display

If you want to change how forms are displayed:

1. Modify the `FormItem.tsx` component for individual form display
2. Update the `FormList.tsx` component for the overall list layout

## Design Patterns

This project uses several key design patterns:

1. **Provider Pattern**: Data sources are implemented as providers that can be registered with a factory.

2. **Factory Pattern**: The `PrefillDataSourceFactory` creates and manages different data source providers.

3. **Composite Pattern**: The graph utilities allow traversing and manipulating the form graph structure.

4. **Hooks Pattern**: Custom React hooks separate data fetching and state management from UI components.

## License

MIT
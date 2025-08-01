# NextJS Editor

A modern editor package for Next.js applications.

## Installation

```bash
npm install nextjs-editor
# or
yarn add nextjs-editor
# or
pnpm add nextjs-editor
```

## Usage

```tsx
import { Editor } from 'nextjs-editor'

function MyComponent() {
  return (
    <Editor
      value="Hello World"
      onChange={(value) => console.log(value)}
    />
  )
}
```

## Development

### Prerequisites

- Node.js >= 16.0.0
- npm, yarn, or pnpm

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Available Scripts

- `npm run build` - Build the package for production
- `npm run dev` - Build in watch mode for development
- `npm run clean` - Clean the dist folder
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking

### Building

The package uses [tsup](https://github.com/egoist/tsup) for building. It generates:

- CommonJS bundle (`dist/index.js`)
- ES Module bundle (`dist/index.mjs`)
- TypeScript declarations (`dist/index.d.ts`)
- Source maps

### Publishing

1. Update the version in `package.json`
2. Run `npm run build`
3. Run `npm publish`

## License

MIT #   n e x t j s - e d i t o r  
 
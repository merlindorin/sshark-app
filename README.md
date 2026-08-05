# SSHark Web Application

> Modern web interface for searching SSH and GPG public keys. Built with Next.js 16, React 19, and Tailwind CSS 4.

## Features

- Real-time SSH and GPG key search
- Advanced query syntax with field filtering
- Responsive design with shadcn/ui components
- Type-safe API integration with TanStack Query
- Component library via Storybook

## Requirements

- Node.js 20+
- Running SSHark API backend (see `../api/README.md`)

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Development

### Available Commands

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm run storybook` - Launch component library (port 6006)
- `npm run lint` - Run Biome linter

### Code Quality

This project uses Biome for linting and formatting:

- Tab indentation (4 spaces equivalent)
- Line width: 120 characters
- Strict TypeScript mode

Run checks before committing:

```bash
npm run lint
```

Husky pre-commit hooks will automatically run Biome checks.

## Architecture

The application follows Atomic Design principles:

- `components/atoms/` - Basic building blocks (Logo, buttons)
- `components/molecules/` - Composed components (SearchBox, Pills)
- `components/templates/` - Layout components (Navbar, Footer)
- `components/pages/` - Full page components
- `components/providers/` - React contexts (Query, Theme)
- `components/ui/` - shadcn/ui components (new-york style)

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **UI**: React 19, TypeScript 5, Tailwind CSS 4
- **Components**: shadcn/ui (new-york style), Radix UI primitives
- **Data Fetching**: TanStack Query v5
- **Documentation**: Fumadocs (MDX-based)
- **Component Development**: Storybook 10

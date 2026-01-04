# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SSHark App is a Next.js frontend for searching and displaying SSH public keys. It connects to a separate backend API service (`sshark-api`) that indexes SSH keys from platforms like GitHub and GitLab.

## Commands

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production
npm run lint         # Run ESLint
npm run storybook    # Start Storybook on port 6006
```

## Architecture

### API Integration
- The app proxies API requests to an external `sshark-api` service at `/api/v1/*`
- In Kubernetes, the ingress routes `/api` to the backend service configured in `helm/sshark-app/values.yaml`
- Search endpoint: `/api/v1/search/{query}` with pagination via `limit` and `offset` query params

### Component Structure
Components follow atomic design principles:
- `components/atoms/` - Basic building blocks (logo, etc.)
- `components/molecules/` - Composed components (SearchBox, pills)
- `components/pages/` - Page-level components
- `components/templates/` - Layout templates
- `components/ui/` - shadcn/ui components (new-york style)
- `components/kibo-ui/` - Components from kibo-ui registry

### Data Fetching
- Uses TanStack Query for server state management
- Custom hooks in `hooks/` directory:
  - `use-ssh-keys.ts` - Search SSH keys with pagination
  - `use-stats.ts` - Fetch platform statistics
  - `use-validate-query.ts` - Query validation

### Search Query Syntax
The backend uses Redis Query Engine syntax:
- Text fields: `@username`, `@comment`, `@updated_at`
- Tag fields: `@id`, `@key`, `@source`, `@type`
- Wildcards: `merl*`
- Exact phrase: `"merlindorin"`
- Fuzzy: `%typo%`

## Release Workflow

1. **Commit changes**
   ```bash
   git add <files> && git commit -m "feat/fix: message"
   ```

2. **Update Helm chart** (`helm/sshark-app/Chart.yaml`)
   - Bump `version` and `appVersion` to match the new version

3. **Commit chart update**
   ```bash
   git add helm/sshark-app/Chart.yaml && git commit -m "chore: bump chart version to 0.x.x"
   ```

4. **Tag and push**
   ```bash
   git tag v0.x.x && git push && git push --tags
   ```

5. **GitHub Actions** builds and pushes Docker image to `ghcr.io/merlindorin/sshark-app`

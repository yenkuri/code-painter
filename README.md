# code-painter

Schema-first architecture mapping for diagrams stored as JSON and rendered later by a frontend grid/canvas system.

This initial scaffold focuses on the data model only:

- logical nodes and edges live separately from visual layout data
- layouts use grid coordinates: `x`, `y`, `z`, `w`, `h`
- multiple views can be added over time, such as physical, logical, external access, and service dependency maps
- validation is intentionally lightweight and dependency-free for now

## Files

- `src/schema/types.ts` - TypeScript schema types
- `src/schema/example-architecture.json` - sample architecture document
- `src/schema/validate.ts` - simple schema validator
- `dev-notes/codex/001-initial-schema.md` - handoff notes

## Scripts

```bash
npm run typecheck
```


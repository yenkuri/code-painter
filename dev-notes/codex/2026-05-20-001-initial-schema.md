# 2026-05-20-001 - Initial Schema

## Summary

Created the initial TypeScript project structure for `code-painter`, focused on a schema-first architecture mapping model. The project stores diagrams as JSON and keeps rendering concerns deferred for a later frontend grid/canvas layer.

## Files inspected

- Workspace root
- `README.md`
- `package.json`
- `tsconfig.json`
- `src/schema/types.ts`
- `src/schema/example-architecture.json`
- `src/schema/validate.ts`

## Files changed

- `README.md`
- `package.json`
- `tsconfig.json`
- `src/schema/types.ts`
- `src/schema/example-architecture.json`
- `src/schema/validate.ts`
- `dev-notes/codex/2026-05-20-001-initial-schema.md`

## Decisions

- Logical architecture data is modeled separately from visual layout data.
- Nodes represent systems, services, devices, storage, network equipment, and apps.
- Edges represent relationships such as `LAN`, `WAN`, `DNS`, `reverse_proxy`, `SMB`, `API`, `docker_network`, and `dependency`.
- Layouts are independent named views with grid coordinates: `x`, `y`, `z`, `w`, `h`.
- Multiple future view types are represented by `LayoutViewKind`, currently including `physical`, `logical`, `external-access`, and `service-dependency`.
- Metadata fields on nodes include `hostname`, `displayName`, `role`, `ip`, `services`, `tags`, `criticality`, and `notes`.

## Validation

- `validateArchitecture` checks required document metadata and schema version.
- The validator checks that node, edge, and layout IDs exist and are unique.
- Edge `from` and `to` references must point to known nodes.
- Layout items must reference known nodes and cannot duplicate a node within the same layout.
- Layout coordinates must be finite numbers, and layout width/height must be positive.
- No external validation library is used yet.
- `npm.cmd run typecheck` passed.
- `src/schema/example-architecture.json` parsed successfully as JSON.

## Risks / open questions

- Runtime validation is intentionally shallow and assumes the caller passes an object shaped close to `ArchitectureDocument`.
- Enum-like string values are enforced by TypeScript at compile time, but the validator does not yet check them at runtime.
- IP address and hostname formats are not validated yet.
- Edges are not scoped per layout, so every edge is globally available to future renderers unless a view filtering model is added.

## Suggested next step

Add a small loader or test harness that imports `example-architecture.json`, runs `validateArchitecture`, and establishes the first automated check for schema regressions.

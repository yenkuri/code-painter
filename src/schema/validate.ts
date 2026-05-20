import type {
  ArchitectureDocument,
  ArchitectureEdge,
  ArchitectureLayout,
  ArchitectureNode,
  LayoutItem,
} from "./types.js";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateArchitecture(document: ArchitectureDocument): ValidationResult {
  const errors: string[] = [];

  if (!document.metadata?.id) {
    errors.push("metadata.id is required.");
  }

  if (!document.schemaVersion) {
    errors.push("schemaVersion is required.");
  }

  const nodeIds = collectRequiredIds(document.nodes, "node", errors);
  collectRequiredIds(document.edges, "edge", errors);
  collectRequiredIds(document.layouts, "layout", errors);

  for (const edge of document.edges ?? []) {
    validateEdgeReferences(edge, nodeIds, errors);
  }

  for (const layout of document.layouts ?? []) {
    validateLayoutReferences(layout, nodeIds, errors);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function collectRequiredIds<T extends { id?: string }>(
  items: T[] | undefined,
  label: string,
  errors: string[],
): Set<string> {
  const ids = new Set<string>();

  if (!Array.isArray(items)) {
    errors.push(`${label}s must be an array.`);
    return ids;
  }

  for (const item of items) {
    if (!item.id) {
      errors.push(`${label}.id is required.`);
      continue;
    }

    if (ids.has(item.id)) {
      errors.push(`Duplicate ${label} id: ${item.id}.`);
      continue;
    }

    ids.add(item.id);
  }

  return ids;
}

function validateEdgeReferences(
  edge: ArchitectureEdge,
  nodeIds: Set<ArchitectureNode["id"]>,
  errors: string[],
): void {
  if (!edge.from) {
    errors.push(`edge ${edge.id || "(missing id)"} is missing from.`);
  } else if (!nodeIds.has(edge.from)) {
    errors.push(`edge ${edge.id} references missing from node: ${edge.from}.`);
  }

  if (!edge.to) {
    errors.push(`edge ${edge.id || "(missing id)"} is missing to.`);
  } else if (!nodeIds.has(edge.to)) {
    errors.push(`edge ${edge.id} references missing to node: ${edge.to}.`);
  }
}

function validateLayoutReferences(
  layout: ArchitectureLayout,
  nodeIds: Set<ArchitectureNode["id"]>,
  errors: string[],
): void {
  if (!Array.isArray(layout.items)) {
    errors.push(`layout ${layout.id || "(missing id)"} items must be an array.`);
    return;
  }

  const seenLayoutNodes = new Set<string>();

  for (const item of layout.items) {
    validateLayoutItem(layout, item, nodeIds, seenLayoutNodes, errors);
  }
}

function validateLayoutItem(
  layout: ArchitectureLayout,
  item: LayoutItem,
  nodeIds: Set<ArchitectureNode["id"]>,
  seenLayoutNodes: Set<string>,
  errors: string[],
): void {
  const layoutId = layout.id || "(missing id)";

  if (!item.nodeId) {
    errors.push(`layout ${layoutId} has an item without nodeId.`);
    return;
  }

  if (!nodeIds.has(item.nodeId)) {
    errors.push(`layout ${layoutId} references missing node: ${item.nodeId}.`);
  }

  if (seenLayoutNodes.has(item.nodeId)) {
    errors.push(`layout ${layoutId} contains duplicate node: ${item.nodeId}.`);
  }

  seenLayoutNodes.add(item.nodeId);

  for (const key of ["x", "y", "z", "w", "h"] as const) {
    if (!Number.isFinite(item[key])) {
      errors.push(`layout ${layoutId} item ${item.nodeId} has invalid ${key}.`);
    }
  }

  if (item.w <= 0 || item.h <= 0) {
    errors.push(`layout ${layoutId} item ${item.nodeId} must have positive w and h.`);
  }
}

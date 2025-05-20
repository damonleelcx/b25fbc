import { BlueprintGraph, Edge, Form, Node } from './types';

/**
 * Find a node by its ID in the blueprint graph
 */
export function findNodeById(graph: BlueprintGraph, nodeId: string): Node | undefined {
  return graph.nodes.find(node => node.id === nodeId);
}

/**
 * Find a form by its ID in the blueprint graph
 */
export function findFormById(graph: BlueprintGraph, formId: string): Form | undefined {
  return graph.forms.find(form => form.id === formId);
}

/**
 * Find a form by component key (node ID) in the blueprint graph
 */
export function findFormByComponentKey(graph: BlueprintGraph, componentKey: string): Form | undefined {
  const node = findNodeById(graph, componentKey);
  if (!node) return undefined;
  
  return findFormById(graph, node.data.component_id);
}

/**
 * Get all direct dependencies for a form node
 */
export function getDirectDependencies(graph: BlueprintGraph, nodeId: string): Node[] {
  // Find all prerequisite node IDs
  const node = findNodeById(graph, nodeId);
  if (!node) return [];
  
  const prerequisites = node.data.prerequisites || [];
  
  // Return all nodes that match the prerequisites
  return prerequisites.map(preq => findNodeById(graph, preq)).filter(Boolean) as Node[];
}

/**
 * Get all transitive dependencies for a form node
 */
export function getTransitiveDependencies(graph: BlueprintGraph, nodeId: string): Node[] {
  const directDeps = getDirectDependencies(graph, nodeId);
  if (directDeps.length === 0) return [];
  
  const transitiveDeps: Node[] = [];
  const visited = new Set<string>();
  
  // Recursive function to find all transitive dependencies
  const findDeps = (currentNodeId: string) => {
    if (visited.has(currentNodeId)) return;
    visited.add(currentNodeId);
    
    const deps = getDirectDependencies(graph, currentNodeId);
    deps.forEach(dep => {
      if (!visited.has(dep.id)) {
        transitiveDeps.push(dep);
        findDeps(dep.id);
      }
    });
  };
  
  // Start from direct dependencies
  directDeps.forEach(dep => {
    findDeps(dep.id);
  });
  
  return transitiveDeps;
}

/**
 * Get all form nodes in a blueprint graph
 */
export function getAllFormNodes(graph: BlueprintGraph): Node[] {
  return graph.nodes.filter(node => node.type === 'form');
}

/**
 * Get all source nodes in a blueprint graph (nodes with no prerequisites)
 */
export function getSourceNodes(graph: BlueprintGraph): Node[] {
  return graph.nodes.filter(node => 
    node.data.prerequisites && node.data.prerequisites.length === 0
  );
}

/**
 * Get all fields for a form
 */
export function getFormFields(form: Form) {
  if (!form || !form.field_schema || !form.field_schema.properties) {
    return [];
  }
  
  return Object.entries(form.field_schema.properties).map(([fieldId, field]) => ({
    id: fieldId,
    name: field.title || fieldId,
    type: field.avantos_type,
    required: form.field_schema.required?.includes(fieldId) || false
  }));
}

/**
 * Get all edges starting from a node
 */
export function getOutgoingEdges(graph: BlueprintGraph, nodeId: string): Edge[] {
  return graph.edges.filter(edge => edge.source === nodeId);
}

/**
 * Get all edges ending at a node
 */
export function getIncomingEdges(graph: BlueprintGraph, nodeId: string): Edge[] {
  return graph.edges.filter(edge => edge.target === nodeId);
}
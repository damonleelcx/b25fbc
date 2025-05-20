// Types for the Journey Builder application

// Blueprint Types
export interface BlueprintGraph {
    id: string;
    tenant_id: string;
    name: string;
    description: string;
    category: string;
    nodes: Node[];
    edges: Edge[];
    forms: Form[];
    branches: any[];
    triggers: any[];
  }
  
  export interface Node {
    id: string;
    type: string;
    position: {
      x: number;
      y: number;
    };
    data: {
      id: string;
      component_key: string;
      component_type: string;
      component_id: string;
      name: string;
      prerequisites: string[];
      permitted_roles: string[];
      input_mapping: Record<string, any>;
      sla_duration: {
        number: number;
        unit: string;
      };
      approval_required: boolean;
      approval_roles: string[];
    };
  }
  
  export interface Edge {
    source: string;
    target: string;
  }
  
  export interface Form {
    id: string;
    name: string;
    description: string;
    is_reusable: boolean;
    field_schema: {
      type: string;
      properties: Record<string, FormField>;
      required: string[];
    };
    ui_schema: any;
    dynamic_field_config: Record<string, any>;
  }
  
  export interface FormField {
    avantos_type: string;
    title: string;
    type: string;
    format?: string;
    items?: {
      enum: string[];
      type: string;
    };
    enum?: any[] | null;
    uniqueItems?: boolean;
  }
  
  // Prefill Configuration Types
  export interface PrefillConfig {
    sourceType: PrefillSourceType;
    sourceId: string;
    fieldId: string;
  }
  
  export enum PrefillSourceType {
    DIRECT_DEPENDENCY = 'direct_dependency',
    TRANSITIVE_DEPENDENCY = 'transitive_dependency',
    GLOBAL = 'global'
  }
  
  export interface PrefillSource {
    type: PrefillSourceType;
    id: string;
    name: string;
    fields: Array<{
      id: string;
      name: string;
    }>;
  }
  
  export interface PrefillConfigMap {
    [formId: string]: {
      [fieldId: string]: PrefillConfig | null;
    };
  }
  
  // Prefill Data Source Types
  export interface DataSourceProvider {
    getDataSources(formId: string, graph: BlueprintGraph): PrefillSource[];
  }
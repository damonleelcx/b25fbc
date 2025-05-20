import {
    findFormByComponentKey,
    getDirectDependencies,
    getFormFields,
    getTransitiveDependencies
} from './graphUtils';
import {
    BlueprintGraph,
    DataSourceProvider,
    PrefillSource,
    PrefillSourceType
} from './types';
  
  /**
   * Provider for direct dependency data sources
   */
  export class DirectDependencyProvider implements DataSourceProvider {
    getDataSources(formNodeId: string, graph: BlueprintGraph): PrefillSource[] {
      const directDeps = getDirectDependencies(graph, formNodeId);
      
      return directDeps.map(node => {
        const form = findFormByComponentKey(graph, node.id);
        
        if (!form) return null;
        
        const fields = getFormFields(form);
        
        return {
          type: PrefillSourceType.DIRECT_DEPENDENCY,
          id: node.id,
          name: node.data.name,
          fields: fields.map(field => ({
            id: field.id,
            name: field.name
          }))
        };
      }).filter(Boolean) as PrefillSource[];
    }
  }
  
  /**
   * Provider for transitive dependency data sources
   */
  export class TransitiveDependencyProvider implements DataSourceProvider {
    getDataSources(formNodeId: string, graph: BlueprintGraph): PrefillSource[] {
      const transitiveDeps = getTransitiveDependencies(graph, formNodeId);
      
      return transitiveDeps.map(node => {
        const form = findFormByComponentKey(graph, node.id);
        
        if (!form) return null;
        
        const fields = getFormFields(form);
        
        return {
          type: PrefillSourceType.TRANSITIVE_DEPENDENCY,
          id: node.id,
          name: node.data.name,
          fields: fields.map(field => ({
            id: field.id,
            name: field.name
          }))
        };
      }).filter(Boolean) as PrefillSource[];
    }
  }
  
  /**
   * Provider for global data sources
   */
  export class GlobalDataProvider implements DataSourceProvider {
    getDataSources(_formNodeId: string, _graph: BlueprintGraph): PrefillSource[] {
      // For demo purposes, create some mock global data sources
      return [
        {
          type: PrefillSourceType.GLOBAL,
          id: 'global_user',
          name: 'User Properties',
          fields: [
            { id: 'user_id', name: 'User ID' },
            { id: 'user_email', name: 'User Email' },
            { id: 'user_name', name: 'User Name' }
          ]
        },
        {
          type: PrefillSourceType.GLOBAL,
          id: 'organization',
          name: 'Organization Properties',
          fields: [
            { id: 'org_id', name: 'Organization ID' },
            { id: 'org_name', name: 'Organization Name' }
          ]
        }
      ];
    }
  }
  
  /**
   * Factory class to create and manage data source providers
   */
  export class PrefillDataSourceFactory {
    private providers: DataSourceProvider[] = [];
  
    constructor() {
      // Register default providers
      this.registerProvider(new DirectDependencyProvider());
      this.registerProvider(new TransitiveDependencyProvider());
      this.registerProvider(new GlobalDataProvider());
    }
  
    registerProvider(provider: DataSourceProvider): void {
      this.providers.push(provider);
    }
  
    getAllDataSources(formNodeId: string, graph: BlueprintGraph): PrefillSource[] {
      return this.providers.flatMap(provider => 
        provider.getDataSources(formNodeId, graph)
      );
    }
  }
  
  // Export a singleton instance
  export const prefillDataSourceFactory = new PrefillDataSourceFactory();
"use client";

import FormList from '../components/FormList';
import { useFormGraph } from '../hooks/useFormGraph';
import { usePrefillConfig } from '../hooks/usePrefillConfig';

export default function Home() {
  const { graph, loading, error } = useFormGraph();
  const { 
    prefillConfigs, 
    setPrefillForField, 
    clearPrefillForField,
    getFormPrefillConfig
  } = usePrefillConfig();

  const handleSetPrefill = (formNodeId: string, fieldId: string, config: any) => {
    setPrefillForField(formNodeId, fieldId, config);
  };

  const handleClearPrefill = (formNodeId: string, fieldId: string) => {
    clearPrefillForField(formNodeId, fieldId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading blueprint data...</p>
        </div>
      </div>
    );
  }

  if (error || !graph) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Error</h1>
          <p className="text-gray-600">{error || 'Failed to load blueprint data'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{graph.name}</h1>
          <p className="text-gray-600">{graph.description}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              Category: {graph.category}
            </span>
            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
              Tenant ID: {graph.tenant_id}
            </span>
          </div>
        </div>
        
        <FormList
          graph={graph}
          prefillConfigs={prefillConfigs}
          onSetPrefill={handleSetPrefill}
          onClearPrefill={handleClearPrefill}
        />
      </div>
    </main>
  );
}
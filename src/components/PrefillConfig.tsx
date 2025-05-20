import React, { useState } from 'react';
import { findFormByComponentKey, findNodeById, getFormFields } from '../lib/graphUtils';
import { BlueprintGraph, PrefillSourceType, PrefillConfig as TPrefillConfig } from '../lib/types';
import PrefillModal from './PrefillModal';

interface PrefillConfigProps {
  formNodeId: string;
  graph: BlueprintGraph;
  prefillConfig: Record<string, TPrefillConfig | null>;
  onSetPrefill: (fieldId: string, config: TPrefillConfig | null) => void;
  onClearPrefill: (fieldId: string) => void;
}

const PrefillConfig: React.FC<PrefillConfigProps> = ({
  formNodeId,
  graph,
  prefillConfig,
  onSetPrefill,
  onClearPrefill
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  
  // Get the current form
  const node = findNodeById(graph, formNodeId);
  const form = node ? findFormByComponentKey(graph, node.id) : undefined;
  
  if (!form) {
    return <div>Form not found</div>;
  }
  
  // Get all fields for this form
  const formFields = getFormFields(form);
  
  const handleOpenPrefillModal = (fieldId: string) => {
    setSelectedField(fieldId);
    setModalOpen(true);
  };
  
  const handleSelectSource = (sourceId: string, sourceType: PrefillSourceType, sourceFieldId: string) => {
    if (!selectedField) return;
    
    onSetPrefill(selectedField, {
      sourceType: sourceType,
      sourceId: sourceId,
      fieldId: sourceFieldId
    });
    
    setSelectedField(null);
  };
  
  const getSourceDisplayName = (config: TPrefillConfig): string => {
    if (!config) return '';
    
    const { sourceType, sourceId, fieldId } = config;
    
    if (sourceType === PrefillSourceType.GLOBAL) {
      // For global sources, we'd need to look up from a registry
      // This is simplified for the example
      return `Global: ${sourceId} > ${fieldId}`;
    }
    
    // For form dependencies
    const sourceNode = findNodeById(graph, sourceId);
    if (!sourceNode) return 'Unknown source';
    
    const sourceForm = findFormByComponentKey(graph, sourceId);
    if (!sourceForm) return 'Unknown form';
    
    const sourceField = sourceForm.field_schema.properties[fieldId];
    
    return `${sourceNode.data.name} > ${sourceField?.title || fieldId}`;
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Prefill Configuration</h2>
      
      {formFields.length > 0 ? (
        <div className="space-y-2">
          {formFields.map(field => {
            const currentConfig = prefillConfig[field.id];
            
            return (
              <div key={field.id} className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <h3 className="font-medium">{field.name}</h3>
                  <p className="text-sm text-gray-600">{field.type}</p>
                </div>
                
                <div className="flex items-center">
                  {currentConfig ? (
                    <>
                      <span className="mr-3 text-sm text-gray-700">
                        {getSourceDisplayName(currentConfig)}
                      </span>
                      <button
                        onClick={() => onClearPrefill(field.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Remove prefill"
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleOpenPrefillModal(field.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
                    >
                      Configure
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">No fields available for prefill configuration.</p>
      )}
      
      {/* Prefill Source Modal */}
      {selectedField && (
        <PrefillModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          formNodeId={formNodeId}
          fieldId={selectedField}
          graph={graph}
          onSelectSource={handleSelectSource}
        />
      )}
    </div>
  );
};

export default PrefillConfig;
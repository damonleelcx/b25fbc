import React from 'react';
import { prefillDataSourceFactory } from '../lib/prefillDataSources';
import { BlueprintGraph, PrefillSource, PrefillSourceType } from '../lib/types';
import PrefillSourceItem from './PrefillSourceItem';

interface PrefillModalProps {
  isOpen: boolean;
  onClose: () => void;
  formNodeId: string;
  fieldId: string;
  graph: BlueprintGraph;
  onSelectSource: (sourceId: string, sourceType: PrefillSourceType, fieldId: string) => void;
}

const PrefillModal: React.FC<PrefillModalProps> = ({
  isOpen,
  onClose,
  formNodeId,
  fieldId,
  graph,
  onSelectSource
}) => {
  const [sources, setSources] = React.useState<PrefillSource[]>([]);
  
  // Group sources by type
  const directSources = sources.filter(s => s.type === PrefillSourceType.DIRECT_DEPENDENCY);
  const transitiveSources = sources.filter(s => s.type === PrefillSourceType.TRANSITIVE_DEPENDENCY);
  const globalSources = sources.filter(s => s.type === PrefillSourceType.GLOBAL);
  
  React.useEffect(() => {
    if (isOpen && graph) {
      // Get all available prefill data sources for this form
      const allSources = prefillDataSourceFactory.getAllDataSources(formNodeId, graph);
      setSources(allSources);
    }
  }, [isOpen, formNodeId, graph]);
  
  const handleSelectField = (sourceId: string, sourceFieldId: string) => {
    const source = sources.find(s => s.id === sourceId);
    if (!source) return;
    
    onSelectSource(sourceId, source.type, sourceFieldId);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Select Prefill Source</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        {/* Direct Dependencies */}
        {directSources.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Direct Dependencies</h3>
            {directSources.map(source => (
              <PrefillSourceItem 
                key={source.id}
                source={source}
                onSelectField={handleSelectField}
              />
            ))}
          </div>
        )}
        
        {/* Transitive Dependencies */}
        {transitiveSources.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Transitive Dependencies</h3>
            {transitiveSources.map(source => (
              <PrefillSourceItem 
                key={source.id}
                source={source}
                onSelectField={handleSelectField}
              />
            ))}
          </div>
        )}
        
        {/* Global Sources */}
        {globalSources.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Global Data</h3>
            {globalSources.map(source => (
              <PrefillSourceItem 
                key={source.id}
                source={source}
                onSelectField={handleSelectField}
              />
            ))}
          </div>
        )}
        
        {sources.length === 0 && (
          <p className="text-gray-500">No available prefill sources found.</p>
        )}
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrefillModal;
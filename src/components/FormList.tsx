import React from 'react';
import { getAllFormNodes } from '../lib/graphUtils';
import { BlueprintGraph } from '../lib/types';
import FormItem from './FormItem';

interface FormListProps {
  graph: BlueprintGraph;
  prefillConfigs: Record<string, Record<string, any>>;
  onSetPrefill: (formNodeId: string, fieldId: string, config: any) => void;
  onClearPrefill: (formNodeId: string, fieldId: string) => void;
}

const FormList: React.FC<FormListProps> = ({
  graph,
  prefillConfigs,
  onSetPrefill,
  onClearPrefill
}) => {
  const formNodes = getAllFormNodes(graph);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-6">Journey Builder Forms</h1>
      
      {formNodes.length > 0 ? (
        formNodes.map(node => (
          <FormItem
            key={node.id}
            node={node}
            graph={graph}
            prefillConfig={prefillConfigs}
            onSetPrefill={onSetPrefill}
            onClearPrefill={onClearPrefill}
          />
        ))
      ) : (
        <p className="text-gray-500">No forms found in the blueprint.</p>
      )}
    </div>
  );
};

export default FormList;
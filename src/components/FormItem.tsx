"use client";

import React, { useState } from 'react';
import { findFormByComponentKey } from '../lib/graphUtils';
import { BlueprintGraph, Node } from '../lib/types';
import PrefillConfig from './PrefillConfig';

interface FormItemProps {
  node: Node;
  graph: BlueprintGraph;
  prefillConfig: Record<string, any>;
  onSetPrefill: (formNodeId: string, fieldId: string, config: any) => void;
  onClearPrefill: (formNodeId: string, fieldId: string) => void;
}

const FormItem: React.FC<FormItemProps> = ({
  node,
  graph,
  prefillConfig,
  onSetPrefill,
  onClearPrefill
}) => {
  const [showPrefillConfig, setShowPrefillConfig] = useState(false);
  
  const form = findFormByComponentKey(graph, node.id);
  
  if (!form) {
    return null;
  }
  
  const handleSetPrefill = (fieldId: string, config: any) => {
    onSetPrefill(node.id, fieldId, config);
  };
  
  const handleClearPrefill = (fieldId: string) => {
    onClearPrefill(node.id, fieldId);
  };
  
  return (
    <div className="border rounded-lg p-4 mb-4 bg-white">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">{node.data.name}</h2>
          <p className="text-gray-600">Form ID: {form.id}</p>
        </div>
        <button
          onClick={() => setShowPrefillConfig(!showPrefillConfig)}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          {showPrefillConfig ? 'Hide Prefill Config' : 'Show Prefill Config'}
        </button>
      </div>
      
      {/* Form dependencies */}
      {node.data.prerequisites && node.data.prerequisites.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium text-gray-700">Dependencies:</h3>
          <ul className="flex flex-wrap gap-2 mt-1">
            {node.data.prerequisites.map(prereqId => {
              const prereqNode = graph.nodes.find(n => n.id === prereqId);
              return (
                <li key={prereqId} className="bg-gray-100 px-2 py-1 rounded text-sm">
                  {prereqNode?.data.name || prereqId}
                </li>
              );
            })}
          </ul>
        </div>
      )}
      
      {/* Prefill configuration panel */}
      {showPrefillConfig && (
        <div className="mt-4">
          <PrefillConfig
            formNodeId={node.id}
            graph={graph}
            prefillConfig={prefillConfig[node.id] || {}}
            onSetPrefill={handleSetPrefill}
            onClearPrefill={handleClearPrefill}
          />
        </div>
      )}
    </div>
  );
};

export default FormItem;
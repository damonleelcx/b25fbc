import React from 'react';
import { PrefillSource } from '../lib/types';

interface PrefillSourceItemProps {
  source: PrefillSource;
  onSelectField: (sourceId: string, fieldId: string) => void;
}

const PrefillSourceItem: React.FC<PrefillSourceItemProps> = ({ source, onSelectField }) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className="border rounded-md mb-2 overflow-hidden">
      <div 
        className="bg-gray-100 p-3 cursor-pointer flex justify-between items-center"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <h3 className="font-medium">{source.name}</h3>
          <p className="text-sm text-gray-600">
            {source.type.replace('_', ' ')}
          </p>
        </div>
        <span>{expanded ? '▲' : '▼'}</span>
      </div>
      
      {expanded && (
        <div className="p-2">
          {source.fields.length > 0 ? (
            <ul>
              {source.fields.map(field => (
                <li 
                  key={field.id}
                  className="p-2 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  onClick={() => onSelectField(source.id, field.id)}
                >
                  {field.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm p-2">No fields available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PrefillSourceItem;
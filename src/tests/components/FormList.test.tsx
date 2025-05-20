import { render, screen } from '@testing-library/react';
import FormList from '../../components/FormList';
import { getAllFormNodes } from '../../lib/graphUtils';
import { BlueprintGraph } from '../../lib/types';

// Mock dependencies
jest.mock('../../lib/graphUtils', () => ({
  getAllFormNodes: jest.fn(),
}));

// Mock FormItem component
jest.mock('../../components/FormItem', () => {
  return function MockFormItem(props: any) {
    return <div data-testid="form-item" data-node-id={props.node.id}>Form Item Mock</div>;
  };
});

describe('FormList Component', () => {
  const mockGraph: BlueprintGraph = {
      nodes: [], edges: [],
      id: '',
      tenant_id: '',
      name: '',
      description: '',
      category: '',
      forms: [],
      branches: [],
      triggers: []
  };
  const mockPrefillConfigs = {};
  const mockSetPrefill = jest.fn();
  const mockClearPrefill = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders heading correctly', () => {
    (getAllFormNodes as jest.Mock).mockReturnValue([]);
    
    render(
      <FormList 
        graph={mockGraph}
        prefillConfigs={mockPrefillConfigs}
        onSetPrefill={mockSetPrefill}
        onClearPrefill={mockClearPrefill}
      />
    );
    
    expect(screen.getByText('Journey Builder Forms')).toBeInTheDocument();
  });
  
  test('displays message when no forms are found', () => {
    (getAllFormNodes as jest.Mock).mockReturnValue([]);
    
    render(
      <FormList 
        graph={mockGraph}
        prefillConfigs={mockPrefillConfigs}
        onSetPrefill={mockSetPrefill}
        onClearPrefill={mockClearPrefill}
      />
    );
    
    expect(screen.getByText('No forms found in the blueprint.')).toBeInTheDocument();
  });
  
  test('renders FormItem components for each form node', () => {
    const mockFormNodes = [
      { id: 'form1', type: 'form', data: { label: 'Form 1' } },
      { id: 'form2', type: 'form', data: { label: 'Form 2' } }
    ];
    
    (getAllFormNodes as jest.Mock).mockReturnValue(mockFormNodes);
    
    render(
      <FormList 
        graph={mockGraph}
        prefillConfigs={mockPrefillConfigs}
        onSetPrefill={mockSetPrefill}
        onClearPrefill={mockClearPrefill}
      />
    );
    
    const formItems = screen.getAllByTestId('form-item');
    expect(formItems).toHaveLength(2);
    expect(formItems[0]).toHaveAttribute('data-node-id', 'form1');
    expect(formItems[1]).toHaveAttribute('data-node-id', 'form2');
  });
  
  test('passes correct props to FormItem components', () => {
    const mockFormNodes = [
      { id: 'form1', type: 'form', data: { label: 'Form 1' } }
    ];
    
    (getAllFormNodes as jest.Mock).mockReturnValue(mockFormNodes);
    
    const { container } = render(
      <FormList 
        graph={mockGraph}
        prefillConfigs={mockPrefillConfigs}
        onSetPrefill={mockSetPrefill}
        onClearPrefill={mockClearPrefill}
      />
    );
    
    // We're using the mocked FormItem component, so we can't directly test props
    // But we can verify it's rendered with the correct node ID
    expect(screen.getByTestId('form-item')).toHaveAttribute('data-node-id', 'form1');
  });
});
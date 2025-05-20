import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import FormItem from '../../components/FormItem';
import { findFormByComponentKey } from '../../lib/graphUtils';

// Mock the graphUtils module
jest.mock('../../lib/graphUtils', () => ({
  findFormByComponentKey: jest.fn()
}));

// Mock PrefillConfig component
jest.mock('../../components/PrefillConfig', () => {
  return function MockPrefillConfig(props: any) {
    return (
      <div data-testid="prefill-config">
        <span>Form Node ID: {props.formNodeId}</span>
        <button 
          data-testid="set-prefill-button" 
          onClick={() => props.onSetPrefill('field1', { type: 'static', value: 'test' })}
        >
          Set Prefill
        </button>
        <button 
          data-testid="clear-prefill-button" 
          onClick={() => props.onClearPrefill('field1')}
        >
          Clear Prefill
        </button>
      </div>
    );
  };
});

describe('FormItem Component', () => {
  const mockNode = {
    id: 'node1',
    data: {
      name: 'Test Form',
      prerequisites: ['node2', 'node3']
    }
  };

  const mockGraph = {
    nodes: [
      { ...mockNode },
      { id: 'node2', data: { name: 'Prerequisite 1' } },
      { id: 'node3', data: { name: 'Prerequisite 2' } }
    ],
    edges: []
  };

  const mockForm = {
    id: 'form1',
    fields: []
  };

  const mockPrefillConfig = {
    node1: {
      field1: { type: 'static', value: 'test' }
    }
  };

  const mockSetPrefill = jest.fn();
  const mockClearPrefill = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form information when form is found', () => {
    (findFormByComponentKey as jest.Mock).mockReturnValue(mockForm);

    render(
      <FormItem
        node={mockNode as any}
        graph={mockGraph as any}
        prefillConfig={mockPrefillConfig}
        onSetPrefill={mockSetPrefill}
        onClearPrefill={mockClearPrefill}
      />
    );

    expect(screen.getByText('Test Form')).toBeInTheDocument();
    expect(screen.getByText('Form ID: form1')).toBeInTheDocument();
    expect(screen.getByText('Show Prefill Config')).toBeInTheDocument();
  });

  test('does not render when form is not found', () => {
    (findFormByComponentKey as jest.Mock).mockReturnValue(null);

    const { container } = render(
      <FormItem
        node={mockNode as any}
        graph={mockGraph as any}
        prefillConfig={mockPrefillConfig}
        onSetPrefill={mockSetPrefill}
        onClearPrefill={mockClearPrefill}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  test('toggles prefill config visibility when button is clicked', () => {
    (findFormByComponentKey as jest.Mock).mockReturnValue(mockForm);

    render(
      <FormItem
        node={mockNode as any}
        graph={mockGraph as any}
        prefillConfig={mockPrefillConfig}
        onSetPrefill={mockSetPrefill}
        onClearPrefill={mockClearPrefill}
      />
    );

    // Initially, prefill config should not be visible
    expect(screen.queryByTestId('prefill-config')).not.toBeInTheDocument();

    // Click the button to show prefill config
    fireEvent.click(screen.getByText('Show Prefill Config'));
    
    // Now prefill config should be visible
    expect(screen.getByTestId('prefill-config')).toBeInTheDocument();
    expect(screen.getByText('Hide Prefill Config')).toBeInTheDocument();

    // Click again to hide
    fireEvent.click(screen.getByText('Hide Prefill Config'));
    
    // Prefill config should be hidden again
    expect(screen.queryByTestId('prefill-config')).not.toBeInTheDocument();
    expect(screen.getByText('Show Prefill Config')).toBeInTheDocument();
  });

  test('renders prerequisites when available', () => {
    (findFormByComponentKey as jest.Mock).mockReturnValue(mockForm);

    render(
      <FormItem
        node={mockNode as any}
        graph={mockGraph as any}
        prefillConfig={mockPrefillConfig}
        onSetPrefill={mockSetPrefill}
        onClearPrefill={mockClearPrefill}
      />
    );

    expect(screen.getByText('Dependencies:')).toBeInTheDocument();
    expect(screen.getByText('Prerequisite 1')).toBeInTheDocument();
    expect(screen.getByText('Prerequisite 2')).toBeInTheDocument();
  });

  test('calls onSetPrefill when set prefill button is clicked', () => {
    (findFormByComponentKey as jest.Mock).mockReturnValue(mockForm);

    render(
      <FormItem
        node={mockNode as any}
        graph={mockGraph as any}
        prefillConfig={mockPrefillConfig}
        onSetPrefill={mockSetPrefill}
        onClearPrefill={mockClearPrefill}
      />
    );

    // Show prefill config
    fireEvent.click(screen.getByText('Show Prefill Config'));
    
    // Click set prefill button
    fireEvent.click(screen.getByTestId('set-prefill-button'));
    
    // Check if onSetPrefill was called with correct arguments
    expect(mockSetPrefill).toHaveBeenCalledWith('node1', 'field1', { type: 'static', value: 'test' });
  });

  test('calls onClearPrefill when clear prefill button is clicked', () => {
    (findFormByComponentKey as jest.Mock).mockReturnValue(mockForm);

    render(
      <FormItem
        node={mockNode as any}
        graph={mockGraph as any}
        prefillConfig={mockPrefillConfig}
        onSetPrefill={mockSetPrefill}
        onClearPrefill={mockClearPrefill}
      />
    );

    // Show prefill config
    fireEvent.click(screen.getByText('Show Prefill Config'));
    
    // Click clear prefill button
    fireEvent.click(screen.getByTestId('clear-prefill-button'));
    
    // Check if onClearPrefill was called with correct arguments
    expect(mockClearPrefill).toHaveBeenCalledWith('node1', 'field1');
  });
});
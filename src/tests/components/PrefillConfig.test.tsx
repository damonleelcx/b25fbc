import { fireEvent, render, screen } from "@testing-library/react";
import PrefillConfig from "../../components/PrefillConfig";
import {
    findFormByComponentKey,
    findNodeById,
    getFormFields,
} from "../../lib/graphUtils";
import { BlueprintGraph, PrefillSourceType } from "../../lib/types";

// Mock dependencies
jest.mock("../../lib/graphUtils", () => ({
  findFormByComponentKey: jest.fn(),
  findNodeById: jest.fn(),
  getFormFields: jest.fn(),
}));

// Mock PrefillModal component
jest.mock("../../components/PrefillModal", () => {
  return function MockPrefillModal(props: any) {
    return (
      <div
        data-testid="prefill-modal"
        onClick={() => props.onSelectSource("source1", "FORM", "field1")}
      >
        Mock Prefill Modal
      </div>
    );
  };
});

describe("PrefillConfig Component", () => {
  const mockGraph: BlueprintGraph = {
    nodes: [
      {
        id: "form1",
        type: "form",
        data: {
          name: "Test Form",
          id: "",
          component_key: "",
          component_type: "",
          component_id: "",
          prerequisites: [],
          permitted_roles: [],
          input_mapping: {},
          sla_duration: {
            number: 0,
            unit: "",
          },
          approval_required: false,
          approval_roles: [],
        },
        position: {
          x: 0,
          y: 0,
        },
      },
    ],
    edges: [],
    id: "graph1",
    tenant_id: "tenant1",
    name: "Test Graph",
    description: "Test Description",
    category: "test",
    forms: [],
    branches: [],
    triggers: [],
  };

  const mockForm = {
    id: "form1",
    name: "Test Form",
    field_schema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          title: "Name",
        },
        email: {
          type: "string",
          title: "Email",
        },
      },
    },
  };

  const mockFormFields = [
    { id: "name", name: "Name", type: "string" },
    { id: "email", name: "Email", type: "string" },
  ];

  const mockPrefillConfig = {
    name: {
      sourceType: PrefillSourceType.GLOBAL,
      sourceId: "source1",
      fieldId: "field1",
    },
  };

  const mockSetPrefill = jest.fn();
  const mockClearPrefill = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (findNodeById as jest.Mock).mockReturnValue({
      id: "form1",
      data: { name: "Test Form" },
    });
    (findFormByComponentKey as jest.Mock).mockReturnValue(mockForm);
    (getFormFields as jest.Mock).mockReturnValue(mockFormFields);
  });

  test("renders the component title correctly", () => {
    render(
      <PrefillConfig
        formNodeId="form1"
        graph={mockGraph}
        prefillConfig={{}}
        onSetPrefill={mockSetPrefill}
        onClearPrefill={mockClearPrefill}
      />
    );

    expect(screen.getByText("Prefill Configuration")).toBeInTheDocument();
  });

  test("displays message when no fields are available", () => {
    (getFormFields as jest.Mock).mockReturnValue([]);

    render(
      <PrefillConfig
        formNodeId="form1"
        graph={mockGraph}
        prefillConfig={{}}
        onSetPrefill={mockSetPrefill}
        onClearPrefill={mockClearPrefill}
      />
    );

    expect(
      screen.getByText("No fields available for prefill configuration.")
    ).toBeInTheDocument();
  });

  test("displays error message when form is not found", () => {
    (findFormByComponentKey as jest.Mock).mockReturnValue(undefined);

    render(
      <PrefillConfig
        formNodeId="nonexistent"
        graph={mockGraph}
        prefillConfig={{}}
        onSetPrefill={mockSetPrefill}
        onClearPrefill={mockClearPrefill}
      />
    );

    expect(screen.getByText("Form not found")).toBeInTheDocument();
  });

  test("renders form fields correctly", () => {
    render(
      <PrefillConfig
        formNodeId="form1"
        graph={mockGraph}
        prefillConfig={{}}
        onSetPrefill={mockSetPrefill}
        onClearPrefill={mockClearPrefill}
      />
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getAllByText("string").length).toBe(2);
    expect(screen.getAllByText("Configure").length).toBe(2);
  });

  test("displays existing prefill configuration", () => {
    render(
      <PrefillConfig
        formNodeId="form1"
        graph={mockGraph}
        prefillConfig={mockPrefillConfig}
        onSetPrefill={mockSetPrefill}
        onClearPrefill={mockClearPrefill}
      />
    );

    // The mock implementation of getSourceDisplayName would return something like "Unknown form"
    // since we're not fully mocking the source lookup functionality
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("✕")).toBeInTheDocument();
    expect(screen.getByText("Configure")).toBeInTheDocument(); // For the email field
  });

  test("opens prefill modal when Configure button is clicked", () => {
    render(
      <PrefillConfig
        formNodeId="form1"
        graph={mockGraph}
        prefillConfig={{}}
        onSetPrefill={mockSetPrefill}
        onClearPrefill={mockClearPrefill}
      />
    );

    const configureButtons = screen.getAllByText("Configure");
    fireEvent.click(configureButtons[0]);

    expect(screen.getByTestId("prefill-modal")).toBeInTheDocument();
  });

  test("calls onSetPrefill when a source is selected in the modal", () => {
    render(
      <PrefillConfig
        formNodeId="form1"
        graph={mockGraph}
        prefillConfig={{}}
        onSetPrefill={mockSetPrefill}
        onClearPrefill={mockClearPrefill}
      />
    );

    const configureButtons = screen.getAllByText("Configure");
    fireEvent.click(configureButtons[0]);

    // Click on the mock modal to trigger onSelectSource
    fireEvent.click(screen.getByTestId("prefill-modal"));

    expect(mockSetPrefill).toHaveBeenCalledWith("name", {
      sourceType: "FORM",
      sourceId: "source1",
      fieldId: "field1",
    });
  });

  test("calls onClearPrefill when remove button is clicked", () => {
    render(
      <PrefillConfig
        formNodeId="form1"
        graph={mockGraph}
        prefillConfig={mockPrefillConfig}
        onSetPrefill={mockSetPrefill}
        onClearPrefill={mockClearPrefill}
      />
    );

    const removeButton = screen.getByText("✕");
    fireEvent.click(removeButton);

    expect(mockClearPrefill).toHaveBeenCalledWith("name");
  });
});

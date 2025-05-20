import { fireEvent, render, screen } from "@testing-library/react";
import PrefillSourceItem from "../../components/PrefillSourceItem";
import { PrefillSource, PrefillSourceType } from "../../lib/types";

describe("PrefillSourceItem", () => {
  const mockOnSelectField = jest.fn();
  
  const mockSource: PrefillSource = {
    id: "source1",
    type: PrefillSourceType.DIRECT_DEPENDENCY,
    name: "Test Source",
    fields: [
      { id: "field1", name: "Field 1" },
      { id: "field2", name: "Field 2" },
    ],
  };

  const mockEmptySource: PrefillSource = {
    id: "source2",
    type: PrefillSourceType.GLOBAL,
    name: "Empty Source",
    fields: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the source name and type", () => {
    render(
      <PrefillSourceItem source={mockSource} onSelectField={mockOnSelectField} />
    );

    expect(screen.getByText("Test Source")).toBeInTheDocument();
    expect(screen.getByText("direct dependency")).toBeInTheDocument();
  });

  it("is collapsed by default", () => {
    render(
      <PrefillSourceItem source={mockSource} onSelectField={mockOnSelectField} />
    );

    // Check that the expand indicator is showing the down arrow
    expect(screen.getByText("▼")).toBeInTheDocument();
    
    // Fields should not be visible when collapsed
    expect(screen.queryByText("Field 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Field 2")).not.toBeInTheDocument();
  });

  it("expands when clicked", () => {
    render(
      <PrefillSourceItem source={mockSource} onSelectField={mockOnSelectField} />
    );

    // Click the header to expand
    fireEvent.click(screen.getByText("Test Source").closest("div")!);

    // Check that the expand indicator changed to up arrow
    expect(screen.getByText("▲")).toBeInTheDocument();
    
    // Fields should be visible when expanded
    expect(screen.getByText("Field 1")).toBeInTheDocument();
    expect(screen.getByText("Field 2")).toBeInTheDocument();
  });

  it("collapses when clicked again", () => {
    render(
      <PrefillSourceItem source={mockSource} onSelectField={mockOnSelectField} />
    );

    // Click to expand
    fireEvent.click(screen.getByText("Test Source").closest("div")!);
    
    // Click again to collapse
    fireEvent.click(screen.getByText("Test Source").closest("div")!);

    // Check that the expand indicator changed back to down arrow
    expect(screen.getByText("▼")).toBeInTheDocument();
    
    // Fields should not be visible when collapsed again
    expect(screen.queryByText("Field 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Field 2")).not.toBeInTheDocument();
  });

  it("calls onSelectField when a field is clicked", () => {
    render(
      <PrefillSourceItem source={mockSource} onSelectField={mockOnSelectField} />
    );

    // Expand the item first
    fireEvent.click(screen.getByText("Test Source").closest("div")!);
    
    // Click on a field
    fireEvent.click(screen.getByText("Field 1"));

    // Check that onSelectField was called with the correct parameters
    expect(mockOnSelectField).toHaveBeenCalledTimes(1);
    expect(mockOnSelectField).toHaveBeenCalledWith("source1", "field1");
  });

  it("displays a message when no fields are available", () => {
    render(
      <PrefillSourceItem source={mockEmptySource} onSelectField={mockOnSelectField} />
    );

    // Expand the item
    fireEvent.click(screen.getByText("Empty Source").closest("div")!);
    
    // Check that the "No fields available" message is displayed
    expect(screen.getByText("No fields available")).toBeInTheDocument();
  });

  it("formats the source type by replacing underscores with spaces", () => {
    const customSource: PrefillSource = {
      ...mockSource,
      type: PrefillSourceType.TRANSITIVE_DEPENDENCY
    };

    render(
      <PrefillSourceItem source={customSource} onSelectField={mockOnSelectField} />
    );

    expect(screen.getByText("transitive dependency")).toBeInTheDocument();
  });
});
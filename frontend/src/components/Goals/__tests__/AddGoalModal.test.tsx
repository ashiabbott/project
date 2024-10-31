import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import AddGoalModal from '../AddGoalModal';

const mockOnAdd = jest.fn();
const mockOnClose = jest.fn();

describe('AddGoalModal', () => {
  it('renders correctly when open', () => {
    render(
      <AddGoalModal isOpen={true} onClose={mockOnClose} onAdd={mockOnAdd} />
    );
    expect(screen.getByText('Add New Goal')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <AddGoalModal isOpen={false} onClose={mockOnClose} onAdd={mockOnAdd} />
    );
    expect(screen.queryByText('Add New Goal')).not.toBeInTheDocument();
  });

  it('calls onAdd with correct data when form is submitted', async () => {
    render(
      <AddGoalModal isOpen={true} onClose={mockOnClose} onAdd={mockOnAdd} />
    );

    fireEvent.change(screen.getByLabelText('Goal Name'), {
      target: { value: 'Test Goal' },
    });
    fireEvent.change(screen.getByLabelText('Target Amount'), {
      target: { value: '1000' },
    });
    fireEvent.change(screen.getByLabelText('Deadline'), {
      target: { value: '2023-12-31' },
    });

    fireEvent.click(screen.getByText('Add Goal'));

    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalledWith({
        name: 'Test Goal',
        targetAmount: 1000,
        deadline: '2023-12-31',
      });
    });
  });

  it('displays validation errors for invalid inputs', async () => {
    render(
      <AddGoalModal isOpen={true} onClose={mockOnClose} onAdd={mockOnAdd} />
    );

    fireEvent.click(screen.getByText('Add Goal'));

    await waitFor(() => {
      expect(screen.getByText('Goal name is required')).toBeInTheDocument();
      expect(screen.getByText('Target amount is required')).toBeInTheDocument();
      expect(screen.getByText('Deadline is required')).toBeInTheDocument();
    });
  });
});

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import GoalCard from '../GoalCard';

const mockGoal = {
  id: '1',
  name: 'Test Goal',
  targetAmount: 1000,
  currentAmount: 500,
  deadline: '2023-12-31',
};

const mockOnUpdate = jest.fn();

describe('GoalCard', () => {
  it('renders goal information correctly', () => {
    render(<GoalCard goal={mockGoal} onUpdate={mockOnUpdate} />);

    expect(screen.getByText('Test Goal')).toBeInTheDocument();
    expect(screen.getByText('Target: $1,000')).toBeInTheDocument();
    expect(screen.getByText('Current: $500')).toBeInTheDocument();
    expect(screen.getByText('Deadline: 12/31/2023')).toBeInTheDocument();
    expect(screen.getByText('50.0% Complete')).toBeInTheDocument();
  });

  it('calls onUpdate when contributing', () => {
    render(<GoalCard goal={mockGoal} onUpdate={mockOnUpdate} />);

    global.prompt = jest.fn().mockReturnValue('100');

    fireEvent.click(screen.getByText('Contribute'));

    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...mockGoal,
      currentAmount: 600,
    });
  });
});

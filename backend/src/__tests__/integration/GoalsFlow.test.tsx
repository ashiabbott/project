import React from 'react';
import { render, screen } from '@testing-library/react';
import GoalsPage from '../../pages/goals/GoalsPage';

describe('GoalsPage', () => {
  test('renders the GoalsPage component', () => {
    render(<GoalsPage />);
    const headingElement = screen.getByText(/Goals/i);
    expect(headingElement).toBeInTheDocument();
  });

  // Add more tests as needed
});

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Goals from '../goals/GoalsPage';
import { fetchGoals } from '../../store/slices/goalsSlice';

jest.mock('../../store/slices/goalsSlice', () => ({
  fetchGoals: jest.fn(),
}));

const mockStore = configureStore([thunk]);

describe('Goals Page', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      goals: {
        goals: [
          {
            id: '1',
            name: 'Test Goal',
            targetAmount: 1000,
            currentAmount: 500,
            deadline: '2023-12-31',
          },
        ],
        loading: false,
        error: null,
      },
    });
    store.dispatch = jest.fn();
  });

  it('renders correctly', () => {
    render(
      <Provider store={store}>
        <Goals />
      </Provider>
    );

    expect(screen.getByText('Financial Goals')).toBeInTheDocument();
    expect(screen.getByText('Test Goal')).toBeInTheDocument();
  });

  it('opens add goal modal when button is clicked', () => {
    render(
      <Provider store={store}>
        <Goals />
      </Provider>
    );

    fireEvent.click(screen.getByText('Add Goal'));
    expect(screen.getByText('Add New Goal')).toBeInTheDocument();
  });

  it('dispatches fetchGoals action on mount', () => {
    render(
      <Provider store={store}>
        <Goals />
      </Provider>
    );

    expect(store.dispatch).toHaveBeenCalledWith(fetchGoals());
  });
});

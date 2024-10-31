import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import GoalsPage from '../../pages/goals/GoalsPage';
import { fetchGoals, addGoal } from '../../store/slices/goalsSlice';
import { AppDispatch } from '../../store';

const mockStore = configureStore([thunk]);

jest.mock('../../store/slices/goalsSlice', () => ({
  fetchGoals: jest.fn(),
  addGoal: jest.fn(),
}));

describe('Goals Integration Flow', () => {
  let store: ReturnType<typeof mockStore>;
  let dispatch: AppDispatch;

  beforeEach(() => {
    store = mockStore({
      goals: {
        goals: [],
        loading: false,
        error: null,
      },
    });

    dispatch = store.dispatch as AppDispatch;
    store.dispatch = jest.fn(store.dispatch);
  });

  it('should fetch goals on mount', async () => {
    (fetchGoals as jest.Mock).mockImplementation(
      () => async (dispatch: AppDispatch) => {
        dispatch({
          type: 'goals/fetchGoals/fulfilled',
          payload: [
            {
              id: '1',
              name: 'Emergency Fund',
              targetAmount: 10000,
              currentAmount: 5000,
              deadline: '2023-12-31',
            },
          ],
        });
      }
    );

    render(
      <Provider store={store}>
        <GoalsPage />
      </Provider>
    );

    expect(fetchGoals).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(fetchGoals());

    await waitFor(() => {
      expect(screen.getByText('Emergency Fund')).toBeInTheDocument();
    });
  });

  it('should add a new goal', async () => {
    render(
      <Provider store={store}>
        <GoalsPage />
      </Provider>
    );

    fireEvent.click(screen.getByText(/Add Goal/i));

    fireEvent.change(screen.getByLabelText(/Goal Name/i), {
      target: { value: 'New Car' },
    });

    fireEvent.change(screen.getByLabelText(/Target Amount/i), {
      target: { value: '20000' },
    });

    fireEvent.change(screen.getByLabelText(/Deadline/i), {
      target: { value: '2024-06-30' },
    });

    fireEvent.click(screen.getByText(/Add Goal/i));

    await waitFor(() => {
      expect(addGoal).toHaveBeenCalledWith({
        name: 'New Car',
        targetAmount: 20000,
        deadline: '2024-06-30',
      });
      expect(store.dispatch).toHaveBeenCalledWith(
        addGoal({
          name: 'New Car',
          targetAmount: 20000,
          deadline: '2024-06-30',
        })
      );
    });
  });
});

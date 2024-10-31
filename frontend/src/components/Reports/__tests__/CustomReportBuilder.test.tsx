import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomReportBuilder from '../CustomReportBuilder';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { fetchCategories } from '../../../store/slices/categorySlice';

const mockStore = configureStore([thunk]);

jest.mock('../../../store/slices/categorySlice', () => ({
  fetchCategories: jest.fn(),
}));

describe('CustomReportBuilder Integration Test', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      categories: {
        categories: [
          { id: '1', name: 'Food' },
          { id: '2', name: 'Utilities' },
        ],
        loading: false,
        error: null,
      },
    });
  });

  it('should dispatch generateCustomReport action upon form submission', () => {
    render(
      <Provider store={store}>
        <CustomReportBuilder />
      </Provider>
    );

    // Simulate user interactions
    fireEvent.click(screen.getByText('Generate Report'));

    const actions = store.getActions();
    expect(actions[0].type).toBe('report/generateCustomReport/pending');
  });
});

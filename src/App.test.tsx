import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders title', () => {
  render(<App />);
  const textElements = screen.getAllByText('Exchange');
  expect(textElements.length).toBeGreaterThan(0);
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders title', () => {
  render(<App />);
  const linkElements = screen.getAllByText('Exchange');
  expect(linkElements.length).toBe(2);
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import Exchange from './Exchange';

test('renders learn react link', () => {
  render(<Exchange />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

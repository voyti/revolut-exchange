import { render, screen } from '@testing-library/react';
import ErrorBox from './ErrorBox';

test('renders learn react link', () => {
  const testMessage = 'Test test'

  render(<ErrorBox error={testMessage}/>);
  const errorText = screen.getByText(/Test test/i);
  expect(errorText).toBeInTheDocument();
});

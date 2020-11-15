import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders a sign and switch button', () => {
  render(<App />);
  // const buttonSignElement = screen.getByText(/sign (up | in )/i);
  // expect(buttonSignElement).toBeInTheDocument();

  // const buttonSwitchElement = screen.getByText(/switch to sign (up | in )/i);
  // expect(buttonSwitchElement).toBeInTheDocument();
});

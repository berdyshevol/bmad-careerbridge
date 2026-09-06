import { render, screen } from '@testing-library/react';
import App from './App.jsx';

test('ARCH-22 App renders without crashing', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('CareerBridge');
});

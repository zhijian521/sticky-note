import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(
      screen.getByRole('button', { name: /new note/i })
    ).toBeInTheDocument();
  });

  it('displays tutorial note on first load', () => {
    render(<App />);
    expect(screen.getByText(/欢迎使用 WallNotes/i)).toBeInTheDocument();
  });
});

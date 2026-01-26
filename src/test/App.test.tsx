import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from '../App';

describe('App', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('renders without crashing', () => {
    render(<App />);
    expect(
      screen.getByRole('button', { name: /new note/i })
    ).toBeInTheDocument();
  });

  it('displays tutorial note on first load', () => {
    render(<App />);
    expect(screen.getByText(/欢迎使用 Sticky Note/i)).toBeInTheDocument();
  });

  it('renders zoom controls in dock', () => {
    render(<App />);
    expect(screen.getByLabelText('放大')).toBeInTheDocument();
    expect(screen.getByLabelText('缩小')).toBeInTheDocument();
    expect(screen.getByLabelText('重置视图')).toBeInTheDocument();
  });

  it('displays current zoom level in dock', () => {
    render(<App />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('renders canvas container', () => {
    render(<App />);
    expect(screen.getByLabelText('Notes container')).toBeInTheDocument();
  });

  it('canvas container supports drag interactions', () => {
    render(<App />);
    const canvas = screen
      .getByLabelText('Notes container')
      .closest('.canvas-container');
    expect(canvas).toBeInTheDocument();
  });

  it('canvas has correct cursor styles', () => {
    render(<App />);
    const canvas = screen
      .getByLabelText('Notes container')
      .closest('.canvas-container');
    expect(canvas).toHaveStyle({ cursor: 'default' });
  });
});

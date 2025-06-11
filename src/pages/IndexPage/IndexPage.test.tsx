import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import IndexPage from './index';

describe('Index Page', () => {
  it('should render welcome text', () => {
    render(<IndexPage />);
    const welcomeText = screen.getByText(/welcome/i);
    expect(welcomeText).toBeInTheDocument();
  });
});

import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import HelloPage from './index';

describe('Hello Page', () => {
  it('should render without errors', () => {
    render(<HelloPage />);
  });
});

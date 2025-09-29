import { render, screen } from '@testing-library/react';

// Components
import { SelectDropdown } from '..';

// Constants
import { CURRENCIES_OPTIONS } from '@/constants';

const mockProps = {
  options: CURRENCIES_OPTIONS,
  onSelect: jest.fn(),
};
describe('SelectDropdown Component', () => {
  it('renders correctly with given props', () => {
    const container = render(<SelectDropdown {...mockProps} />);

    expect(container).toMatchSnapshot();
  });

  it('renders error message when provided', () => {
    render(<SelectDropdown {...mockProps} errorMessage="Required field" />);

    expect(screen.getByText('Required field')).toBeInTheDocument();
  });

  it('shows the selected value when provided', () => {
    render(<SelectDropdown {...mockProps} selectedValue="USD" />);

    expect(screen.getByText('USD')).toBeInTheDocument();
  });
});

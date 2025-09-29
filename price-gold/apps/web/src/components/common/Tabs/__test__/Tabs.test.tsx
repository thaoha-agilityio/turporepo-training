import { render } from '@testing-library/react';

import { Tabs } from '..';

const tabs = [
  {
    value: 'profile',
    label: 'Profile',
    content: <div>Your profile content</div>,
  },
  {
    value: 'security',
    label: 'Security',
    content: <div>Your security settings</div>,
  },
];

describe('Tabs Component', () => {
  it('renders Tabs component is correct', () => {
    const container = render(<Tabs tabs={tabs} defaultValue="profile" />);

    expect(container).toMatchSnapshot();
  });
});

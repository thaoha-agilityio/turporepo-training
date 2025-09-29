import { ReactNode } from 'react';
import { render } from '@testing-library/react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const renderWithRouterAndQuery = (children: ReactNode) => {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
  );
};

export const wrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export * from '@testing-library/react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Pages
import { Home } from './pages';

// Components
import { Toaster } from './components';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors position="top-center" />
      <Home />
    </QueryClientProvider>
  );
};

export default App;

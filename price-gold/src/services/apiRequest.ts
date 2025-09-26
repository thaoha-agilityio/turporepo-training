// Constants
import { API_URL } from '@/constants';

type RequestOption = Omit<RequestInit, 'body'> & {
  body?: object;
};
export type SuccessResponse<T> = {
  data: T;
  error: null | string;
  headers?: Headers;
};

export type FailedResponse = { data: null; error: string };

class APIClient {
  private static _apiClient: APIClient;
  private constructor() {}

  static get apiClient() {
    if (!this._apiClient) {
      this._apiClient = new APIClient();
    }

    return this._apiClient;
  }

  private apiRequest = async <T>(
    url: string,
    init?: RequestOption,
  ): Promise<SuccessResponse<T> | FailedResponse> => {
    const { method = 'GET', body, headers, ...rest } = init || {};

    const hasBody = method === 'POST' || method === 'PATCH' || method === 'PUT';

    const customHeader = {
      ...headers,
      ...(hasBody && {
        'Content-Type': 'application/json',
      }),
    };

    const options = {
      method,
      headers: customHeader,
      ...(hasBody && {
        body: JSON.stringify(body),
      }),
      ...rest,
    };

    try {
      const res = await fetch(`${API_URL}${url}`, options);

      if (!res.ok) return (await res.json()) as FailedResponse;

      return {
        data: (await res.json()) as T,
        error: null,
        headers: res.headers,
      };
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message, data: null };
      }

      return {
        error: 'Error to fetch API',
        data: null,
      };
    }
  };

  async get<T>(url: string, init?: Omit<RequestOption, 'method'>) {
    return this.apiRequest<T>(url, init);
  }

  async post<T>(url: string, init?: Omit<RequestOption, 'method'>) {
    const { ...rest } = init || {};

    return this.apiRequest<T>(url, { ...rest, method: 'POST' });
  }

  async put<T>(url: string, init?: Omit<RequestOption, 'method'>) {
    return this.apiRequest<T>(url, { ...init, method: 'PUT' });
  }

  async patch<T>(url: string, init?: Omit<RequestOption, 'method'>) {
    return this.apiRequest<T>(url, { ...init, method: 'PATCH' });
  }
}

export const apiClient = APIClient.apiClient;

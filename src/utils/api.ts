/**
 * API utilities for making HTTP requests
 */

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

/**
 * Make a GET request
 */
export const apiGet = async <T>(url: string): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    return {
      data: response.ok ? data : undefined,
      error: response.ok ? undefined : data.message || 'Request failed',
      status: response.status,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error',
      status: 0,
    };
  }
};

/**
 * Make a POST request
 */
export const apiPost = async <T>(url: string, body: any): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return {
      data: response.ok ? data : undefined,
      error: response.ok ? undefined : data.message || 'Request failed',
      status: response.status,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error',
      status: 0,
    };
  }
};

/**
 * Make a PUT request
 */
export const apiPut = async <T>(url: string, body: any): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return {
      data: response.ok ? data : undefined,
      error: response.ok ? undefined : data.message || 'Request failed',
      status: response.status,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error',
      status: 0,
    };
  }
};

/**
 * Make a DELETE request
 */
export const apiDelete = async <T>(url: string): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = response.status !== 204 ? await response.json() : null;

    return {
      data: response.ok ? data : undefined,
      error: response.ok ? undefined : data?.message || 'Request failed',
      status: response.status,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error',
      status: 0,
    };
  }
};

/**
 * Upload file
 */
export const uploadFile = async (url: string, file: File): Promise<ApiResponse<any>> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    return {
      data: response.ok ? data : undefined,
      error: response.ok ? undefined : data.message || 'Upload failed',
      status: response.status,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error',
      status: 0,
    };
  }
};
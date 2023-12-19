async function parseResponseContent(response: Response) {
  const responseText = await response.text();

  try {
    return responseText.length ? JSON.parse(responseText) : '';
  } catch (err) {
    return responseText;
  }
}

/** undefined for 204 No content */
type ApiSuccess<T> = (T & { pageToken?: string }) | undefined;

export type ApiResponse<T = any> = ApiSuccess<T> | { error: { message: string } };

export async function fetchData<T = any>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, options);
    if (response.status === 204) {
      return;
    }
    const responseContent = await parseResponseContent(response);

    if (!response.ok) {
      throw new ApiError(response.status, responseContent.error.message);
    }

    return responseContent;
  } catch (error: any) {
    const message = error.message || 'Something went wrong';
    return { error: { message } };
  }
}

class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

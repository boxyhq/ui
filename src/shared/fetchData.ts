export async function fetchData(url: string) {
  try {
    const response = await fetch(url);
    const json = await response.json();

    if (!response.ok) {
      throw new ApiError(response.status, json.error.message);
    }
    return json;
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

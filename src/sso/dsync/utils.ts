export async function useDirectoryProviders(url: string) {
  const response = await fetch(url);
  const { data, error } = await response.json();

  return {
    providers: data?.data,
    error,
  };
}

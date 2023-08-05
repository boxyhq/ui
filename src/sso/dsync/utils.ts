interface useDirectoryProvidersProps {
  url: string;
}

export async function useDirectoryProviders(props: useDirectoryProvidersProps) {
  const response = await fetch(props.url);
  const { data, error } = await response.json();

  return {
    providers: data?.data,
    error,
  };
}

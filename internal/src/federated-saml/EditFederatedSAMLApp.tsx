import useSWR from 'swr';
import { SAMLFederationApp } from '@boxyhq/saml-jackson';
import fetcher from '@/utils/fetcher';
import { Loading } from '@/shared/Loading';
import { EditBranding } from './EditBranding';
import { Edit } from './Edit';
import { EditAttributesMapping } from './EditAttributesMapping';
import { DeleteCard } from '@/shared/DeleteCard';

export const EditFederatedSAMLApp = ({
  urls,
  onError,
  onSuccess,
  excludeFields,
}: {
  urls: { get: string; patch: string };
  onSuccess?: (data: SAMLFederationApp) => void;
  onError?: (error: Error) => void;
  excludeFields?: 'product'[];
}) => {
  // TODO: mutate after patching
  const { data, isLoading, error, mutate } = useSWR<{ data: SAMLFederationApp }>(urls.get, fetcher);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    onError?.(error);
    return;
  }

  if (!data) {
    return null;
  }

  const app = data?.data;

  return (
    <div className='flex flex-col gap-6'>
      <Edit app={app} urls={urls} onError={onError} onSuccess={onSuccess} excludeFields={excludeFields} />
      <EditAttributesMapping app={app} urls={{ patch: urls.patch }} onError={onError} onSuccess={onSuccess} />
      <EditBranding app={app} urls={{ patch: urls.patch }} onError={onError} onSuccess={onSuccess} />
      <DeleteCard
        title='Delete SAML Federation App'
        description='This action cannot be undone. This will permanently delete the SAML Federation App'
        buttonLabel='Delete App'
      />
    </div>
  );
};

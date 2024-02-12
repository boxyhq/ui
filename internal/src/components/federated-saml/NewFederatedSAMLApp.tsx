import Link from 'next/link';
import { useFormik } from 'formik';
import TagsInput from 'react-tagsinput';
import { Card, Button } from 'react-daisyui';
import { useTranslation } from 'next-i18next';
import { SAMLFederationApp } from '@boxyhq/saml-jackson';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

import { defaultHeaders } from 'src/utils/request';
import { AttributesMapping } from './AttributesMapping';

type NewSAMLFederationApp = Pick<
  SAMLFederationApp,
  'name' | 'tenant' | 'product' | 'acsUrl' | 'entityId' | 'tenants' | 'mappings'
>;

export const NewFederatedSAMLApp = ({
  samlAudience,
  urls,
  onSuccess,
  onError,
  onEntityIdGenerated,
  excludeFields,
}: {
  samlAudience: string;
  urls: { post: string };
  onSuccess?: (data: SAMLFederationApp) => void;
  onError?: (error: Error) => void;
  onEntityIdGenerated?: (entityId: string) => void;
  excludeFields?: 'product'[];
}) => {
  const { t } = useTranslation('common');

  const initialValues: NewSAMLFederationApp = {
    name: '',
    tenant: '',
    product: '',
    acsUrl: '',
    entityId: '',
    tenants: [],
    mappings: [],
  };

  if (excludeFields) {
    excludeFields.forEach((key) => {
      delete initialValues[key as keyof NewSAMLFederationApp];
    });
  }

  const formik = useFormik<NewSAMLFederationApp>({
    initialValues: initialValues,
    onSubmit: async (values) => {
      const rawResponse = await fetch(urls.post, {
        method: 'POST',
        body: JSON.stringify(values),
        headers: defaultHeaders,
      });

      const response = await rawResponse.json();

      if (rawResponse.ok) {
        onSuccess?.(response.data);
      } else {
        onError?.(response.error);
      }
    },
  });

  const generateEntityId = () => {
    const id = crypto.randomUUID().replace(/-/g, '');
    const entityId = `${samlAudience}/${id}`;
    formik.setFieldValue('entityId', entityId);
    navigator.clipboard.writeText(entityId);
    onEntityIdGenerated?.(entityId);
  };

  return (
    <form onSubmit={formik.handleSubmit} method='POST'>
      <Card className='p-6 rounded space-y-3'>
        <label className='form-control w-full'>
          <div className='label'>
            <span className='label-text'>{t('name')}</span>
          </div>
          <input
            type='text'
            placeholder='Your app'
            className='input input-bordered w-full text-sm'
            name='name'
            value={formik.values.name}
            onChange={formik.handleChange}
            required
          />
        </label>
        <label className='form-control w-full'>
          <div className='label'>
            <span className='label-text'>{t('tenant')}</span>
          </div>
          <input
            type='text'
            placeholder='acme'
            className='input input-bordered w-full'
            name='tenant'
            value={formik.values.tenant}
            onChange={formik.handleChange}
            required
          />
        </label>
        {!excludeFields?.includes('product') && (
          <label className='form-control w-full'>
            <div className='label'>
              <span className='label-text'>{t('product')}</span>
            </div>
            <input
              type='text'
              placeholder='MyApp'
              className='input input-bordered w-full text-sm'
              name='product'
              value={formik.values.product}
              onChange={formik.handleChange}
              required
            />
          </label>
        )}
        <label className='form-control w-full'>
          <div className='label'>
            <span className='label-text'>{t('acs_url')}</span>
          </div>
          <input
            type='url'
            placeholder='https://your-sp.com/saml/acs'
            className='input input-bordered w-full text-sm'
            name='acsUrl'
            value={formik.values.acsUrl}
            onChange={formik.handleChange}
            required
          />
        </label>
        <label className='form-control w-full'>
          <div className='label'>
            <span className='label-text'>{t('entity_id')}</span>
            <span className='label-text-alt'>
              <div className='flex items-center gap-1'>
                <span
                  className='cursor-pointer border-stone-600 border p-1 rounded'
                  onClick={generateEntityId}>
                  {t('generate_sp_entity_id')}
                </span>
                <div className='tooltip tooltip-left' data-tip={t('saml_federation_entity_id_instruction')}>
                  <QuestionMarkCircleIcon className='h-5 w-5' />
                </div>
              </div>
            </span>
          </div>
          <input
            type='text'
            placeholder='https://your-sp.com/saml/entityId'
            className='input input-bordered w-full text-sm'
            name='entityId'
            value={formik.values.entityId}
            onChange={formik.handleChange}
            required
          />
          <label className='label'>
            <span className='label-text-alt'>{t('entity-id-change-restriction')}</span>
          </label>
        </label>
        <label className='form-control w-full'>
          <label className='label'>
            <span className='label-text'>{t('tenants')}</span>
          </label>
          <TagsInput
            value={formik.values.tenants}
            onChange={(tags: string[]) => formik.setFieldValue('tenants', tags)}
            onlyUnique={true}
            inputProps={{
              placeholder: t('enter_tenant'),
            }}
            focusedClassName='input-focused'
            addOnBlur={true}
          />
          <label className='label'>
            <span className='label-text-alt'>{t('tenants_mapping_description')}</span>
          </label>
        </label>
        <label className='form-control w-full'>
          <div className='label'>
            <span className='label-text'>{t('attribute_mappings')}</span>
          </div>
          <div className='label'>
            <span className='label-text-alt'>{t('attribute-mappings-description')}</span>
          </div>
        </label>
        <AttributesMapping
          mappings={formik.values.mappings || []}
          onAttributeMappingsChange={(mappings) => formik.setFieldValue('mappings', mappings)}
        />
        <div className='flex gap-2 justify-end pt-6'>
          <Link href='/admin/federated-saml' className='btn btn-secondary btn-outline'>
            {t('cancel')}
          </Link>
          <Button
            className='btn btn-primary'
            loading={formik.isSubmitting}
            disabled={!formik.dirty || !formik.isValid}>
            Create App
          </Button>
        </div>
      </Card>
    </form>
  );
};

import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import ArrowTopRightOnSquareIcon from '@heroicons/react/20/solid/ArrowTopRightOnSquareIcon';

export const WellKnownURLs = ({ jacksonUrl }: { jacksonUrl?: string }) => {
  const { t } = useTranslation('common');
  const [view, setView] = useState<'idp-config' | 'auth' | 'saml-fed'>('idp-config');

  const viewText = t('bui-view');
  const downloadText = t('bui-download');
  const baseUrl = jacksonUrl ?? '';

  const links = [
    {
      title: t('bui-sp-metadata'),
      description: t('bui-sp-metadata-description'),
      href: `${baseUrl}/.well-known/sp-metadata`,
      buttonText: viewText,
      type: 'idp-config',
    },
    {
      title: t('bui-saml-configuration'),
      description: t('bui-sp-config-description'),
      href: `${baseUrl}/.well-known/saml-configuration`,
      buttonText: viewText,
      type: 'idp-config',
    },
    {
      title: t('bui-saml-public-cert'),
      description: t('bui-saml-public-cert-description'),
      href: `${baseUrl}/.well-known/saml.cer`,
      buttonText: downloadText,
      type: 'idp-config',
    },
    {
      title: t('bui-oidc-configuration'),
      description: t('bui-oidc-config-description'),
      href: `${baseUrl}/.well-known/oidc-configuration`,
      buttonText: viewText,
      type: 'idp-config',
    },
    {
      title: t('bui-oidc_discovery'),
      description: t('bui-oidc-discovery-description'),
      href: `${baseUrl}/.well-known/openid-configuration`,
      buttonText: viewText,
      type: 'auth',
    },
    {
      title: t('bui-idp_metadata'),
      description: t('bui-idp-metadata-description'),
      href: `${baseUrl}/.well-known/idp-metadata`,
      buttonText: viewText,
      type: 'saml-fed',
    },
    {
      title: t('bui-idp-configuration'),
      description: t('bui-idp-config-description'),
      href: `${baseUrl}/.well-known/idp-configuration`,
      buttonText: viewText,
      type: 'saml-fed',
    },
  ];

  return (
    <>
      <h2 className='text-emphasis text-xl font-semibold leading-5 tracking-wide dark:text-white py-2'>
        {t('bui-well-known-urls-title')}
      </h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        <Tab
          isActive={view === 'idp-config'}
          setIsActive={() => setView('idp-config')}
          title={t('bui-idp-configuration')}
          description={t('bui-desc-idp-configuration')}
          label={t('bui-idp-configuration-links')}
        />
        <Tab
          isActive={view === 'auth'}
          setIsActive={() => setView('auth')}
          title={t('bui-auth-integration')}
          description={t('bui-desc-auth-integration')}
          label={t('bui-auth-integration-links')}
        />
        <Tab
          isActive={view === 'saml-fed'}
          setIsActive={() => setView('saml-fed')}
          title={t('bui-saml-federation')}
          description={t('bui-desc-saml-federation')}
          label={t('bui-saml-federation-links')}
        />
      </div>
      <div className='space-y-3 mt-8'>
        {links
          .filter((link) => link.type === view)
          .map((link) => (
            <LinkCard
              key={link.href}
              title={link.title}
              description={link.description}
              href={link.href}
              buttonText={link.buttonText}
            />
          ))}
      </div>
    </>
  );
};

const Tab = ({ isActive, setIsActive, title, description, label }) => {
  return (
    <button
      type='button'
      className={`w-full text-left rounded border hover:border-teal-800 p-4${
        isActive ? ' bg-teal-50 opacity-100' : ' opacity-50'
      }`}
      onClick={setIsActive}
      aria-label={label}>
      <span className='flex flex-col items-end'>
        <span className='font-semibold'>{title}</span>
        <span className='text-sm'>{description}</span>
      </span>
    </button>
  );
};

const LinkCard = ({
  title,
  description,
  href,
  buttonText,
}: {
  title: string;
  description: string;
  href: string;
  buttonText: string;
}) => {
  return (
    <div className='rounded border p-4 hover:border-gray-400'>
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <h3 className='font-bold'>{title}</h3>
          <p className='text-[15px]'>{description}</p>
        </div>
        <div className='mx-4'>
          <Link
            className='btn btn-secondary btn-outline btn-sm w-32'
            href={href}
            target='_blank'
            rel='noreferrer'>
            <ArrowTopRightOnSquareIcon className='w-4 h-4 mr-2' />
            {buttonText}
          </Link>
        </div>
      </div>
    </div>
  );
};

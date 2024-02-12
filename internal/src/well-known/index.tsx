"use client"

import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import ArrowTopRightOnSquareIcon from '@heroicons/react/20/solid/ArrowTopRightOnSquareIcon';

const links = [
  {
    title: 'SP Metadata',
    description:
      'The metadata file that your customers who use federated management systems like OpenAthens and Shibboleth will need to configure your service.',
    href: '/.well-known/sp-metadata',
    buttonText: 'View',
    type: 'idp-config',
  },
  {
    title: 'SAML Configuration',
    description:
      'The configuration setup guide that your customers will need to refer to when setting up SAML application with their Identity Provider.',
    href: '/.well-known/saml-configuration',
    buttonText: 'View',
    type: 'idp-config',
  },
  {
    title: 'SAML Public Certificate',
    description: 'The SAML Public Certificate if you want to enable encryption with your Identity Provider.',
    href: '/.well-known/saml.cer',
    buttonText: 'Download',
    type: 'idp-config',
  },
  {
    title: 'OpenID Configuration',
    description: 'URIs that your customers will need to set up the OIDC app on the Identity Provider.',
    href: '/.well-known/oidc-configuration',
    buttonText: 'View',
    type: 'idp-config',
  },
  {
    title: 'OpenID Connect Discovery',
    description:
      'Our OpenID well known URI which your customers will need if they are authenticating via OAuth 2.0 or Open ID Connect.',
    href: '/.well-known/openid-configuration',
    buttonText: 'View',
    type: 'auth',
  },
  {
    title: 'IdP Metadata',
    description:
      'The metadata file that your customers who use our SAML federation feature will need to set up SAML SP configuration on their application.',
    href: '/.well-known/idp-metadata',
    buttonText: 'View',
    type: 'saml-fed',
  },
  {
    title: 'IdP Configuration',
    description:
      'The configuration setup guide that your customers who use our SAML federation feature will need to set up SAML SP configuration on their application.',
    href: '/.well-known/idp-configuration',
    buttonText: 'View',
    type: 'saml-fed',
  },
];

interface LinkCardProps {
  title: string;
  description: string;
  href: string;
  buttonText: string;
}

export const WellKnownURLs = ({ jacksonUrl }: {jacksonUrl: string}) => {
  const [view, setView] = ['idp-config', (d) => {}]
  const { t } = useTranslation('common');

  return (
    <>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        <Tab
          isActive={view === 'idp-config'}
          setIsActive={() => setView('idp-config')}
          title='Identity Provider Configuration'
          description='Links for SAML/OIDC IdP setup'
          label='Identity Provider Configuration links'
        />
        <Tab
          isActive={view === 'auth'}
          setIsActive={() => setView('auth')}
          title='Auth integration'
          description='Links for OAuth 2.0/OpenID Connect auth'
          label='Auth integration links'
        />
        <Tab
          isActive={view === 'saml-fed'}
          setIsActive={() => setView('saml-fed')}
          title='SAML Federation'
          description='Links for SAML Federation app setup'
          label='SAML Federation links'
        />
      </div>
      <div className='space-y-4 mt-5'>
        {links
          .filter((link) => link.type === view)
          .map((link) => (
            <LinkCard
              key={link.href}
              title={link.title}
              description={link.description}
              href={`${jacksonUrl}${link.href}`}
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
      className={`w-full text-left rounded-lg focus:outline-none focus:ring focus:ring-teal-200 border hover:border-teal-800 p-4${
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

const LinkCard = ({ title, description, href, buttonText }: LinkCardProps) => {
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

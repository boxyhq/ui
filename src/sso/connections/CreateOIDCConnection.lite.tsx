import { useStore } from '@builder.io/mitosis';

export default function CreateOIDCConnection() {
  return (
    <>
      <div className='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
        <label for='name'>Name</label>
        <input name='name' required={false} type='text' placeholder='MyApp' />
      </div>
      <div className='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
        <label for='description'>Description</label>
        <input
          name='description'
          required={false}
          maxLength={100}
          type='text'
          placeholder='A short description not more than 100 characters'
        />
      </div>
      <div className='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
        <label for='tenant'>Tenant</label>
        <input name='tenant' type='text' placeholder='acme.com' />
      </div>
      <div className='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
        <label for='product'>Product</label>
        <input name='product' type='text' placeholder='demo' />
      </div>
      <div className='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
        <label for='redirectUrl'>Allowed redirect URLs (newline separated)</label>
        <input name='redirectUrl' type='textarea' placeholder='http://localhost:3366' />
      </div>
      <div className='min-w-[28rem] rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
        <label for='defaultRedirectUrl'>Default redirect URL</label>
        <input name='defaultRedirectUrl' type='url' placeholder='http://localhost:3366/login/saml' />
      </div>
    </>
  );
}

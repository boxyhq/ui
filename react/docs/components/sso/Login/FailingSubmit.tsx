/**
 * @title Login Component with failing onSubmit
 * @description If error object is returned with the error message, the message would be displayed inline.
 * @order 4
 */

import { Login } from '@boxyhq/react-ui/sso';

const FailingSubmit = () => {
  return (
    <Login
      onSubmit={async ({ ssoIdentifier, cb }) => {
        console.log(ssoIdentifier);
        cb({
          error: {
            message: 'Invalid team domain',
          },
        });
      }}
      inputLabel='Team domain *'
      placeholder='contoso@boxyhq.com'
    />
  );
};

export default FailingSubmit;

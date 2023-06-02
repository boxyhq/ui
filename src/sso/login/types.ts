import type { JSX } from '@builder.io/mitosis/jsx-runtime';

export interface LoginProps {
  /**
   * Could be email, tenant or anything that can help to resolve the SSO connection. Use this if you want to set the value directly instead of taking a user input
   */
  ssoIdentifier?: string;
  /**
   * Function to be passed into the component, takes in a value (ssoIdentifier) that can be used to resolve the SSO Connection in the Jackson SSO service.
   * @param {string} ssoIdentifier Could be email, tenant or anything that can help to resolve the SSO connection.
   * @returns {Promise} Any error raised while trying to resolve the ssoIdentifier. This could be displayed inline in the component. In case the error is handled upstream by means of a toast or a UI notification, nothing needs to be returned.
   */
  onSubmit: (payload: {
    ssoIdentifier: string;
    cb: (err: { error: { message: string } } | null) => void;
  }) => Promise<void>;
  /**
   * Label for the input field that can accept the ssoIdentifier value
   * @defaultValue Tenant
   */
  inputLabel?: string;
  /**
   * Placeholder for the input field that can accept the ssoIdentifier value
   * @defaultValue ''
   */
  placeholder?: string;
  /**
   * Text/Name of the login button
   * @defaultValue Sign-in with SSO
   */
  buttonText?: string;
  /**
   * Styles for each inner component that Login is made up of.
   */
  styles?: {
    container?: JSX.CSS;
    button?: JSX.CSS;
    input?: JSX.CSS;
    label?: JSX.CSS;
  };
  /**
   * Classnames for each inner components that Login is made up of.
   */
  classNames?: {
    container?: string;
    button?: string;
    input?: string;
    label?: string;
  };
  innerProps?: {
    input?: { 'data-testid'?: string };
    button?: {
      'data-testid'?: string;
    };
    label?: { 'data-testid'?: string };
    container?: { 'data-testid'?: string };
  };
}

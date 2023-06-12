import type { CSSProperties } from 'vue';

export interface LoginProps {
  /**
   * Could be email, tenant or anything that can help to resolve the SSO connection. Use this if you want to set the value directly instead of taking a user input
   */
  ssoIdentifier?: string;
  /**
   * Handler to be passed into the component. The handler gets invoked on submit with an object payload containing the ssoIdentifier and an error callback (this can be called from the parent component with an error object).
   * @param {Object} payload - The object containing the ssoIdentifier and error callback.
   * @param {string} payload.ssoIdentifier - Could be email, tenant or anything that can help to resolve the SSO connection.
   * @param {callback} payload.cb - The callback that gets passed with the error message, this will be displayed below the sso input field.
   * @returns {Promise<void>}
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
    container?: CSSProperties;
    button?: CSSProperties;
    input?: CSSProperties;
    label?: CSSProperties;
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

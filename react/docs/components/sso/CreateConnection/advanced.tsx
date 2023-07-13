/**
 * @title CreateSAMLConnection advanced variant
 * @description Refer the code below to see the passed props. Also supported is the passing of style attribute for each inner element (Note that inline style will override other styles).
 * @order 2
 */
import { CreateSAMLConnection } from '@boxyhq/react-ui/sso';
import '../CustomStyling.css';

export default () => {
  return (
    <CreateSAMLConnection
      successCallback={() => {
        console.log(`saml connection added successfully`);
      }}
      errorCallback={(errMessage) => {
        console.error(`saml connection creation failed with error: ${errMessage}`);
      }}
      variant={'advanced'}
      classNames={{ input: 'inp' }}
    />
  );
};

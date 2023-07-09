/**
 * @title CreateSAMLConnection basic variant
 * @description Refer the code below to see the passed props. Also supported is the passing of style attribute for each inner element (Note that inline style will override other styles).
 * @order 1
 */
import { CreateSAMLConnection } from '@boxyhq/react-ui/sso';
import '../CustomStyling.css';

export default () => {
  return (
    <CreateSAMLConnection
      loading={false}
      cb={undefined}
      t={(key) => key}
      errorToastCallback={function (errMessage: string): void {
        throw new Error('Function not implemented.');
      }}
      variant={'basic'}
      classNames={{ input: 'inp' }}
    />
  );
};

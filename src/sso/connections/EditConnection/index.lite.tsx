import { useStore } from '@builder.io/mitosis';
import type { EditConnectionProps } from '../types';
import ToggleConnectionStatus from '../ToggleConnectionStatus/index.lite';

export default function EditConnection(props: EditConnectionProps) {
  const state = useStore({
    get connectionIsSAML() {
      return 'idpMetadata' in props.connection && typeof props.connection.idpMetadata === 'object';
    },
    get connectionIsOIDC() {
      return 'oidcProvider' in props.connection && typeof props.connection.oidcProvider === 'object';
    },
  });

  return (
    <div>
      <div className='flex items-center justify-between'>
        <h2 className='mb-5 mt-5 font-bold text-gray-700 dark:text-white md:text-xl'>Edit SSO Connection</h2>
        <ToggleConnectionStatus
          connection={props.connection}
          urls={props.toggleConnectionUrls}
          errorCallback={props.errorCallback}
          successCallback={props.successCallback}
        />
      </div>
    </div>
  );
}

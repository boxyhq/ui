import { onMount, onUpdate, useStore, Show } from '@builder.io/mitosis';
import { ButtonLink } from '@components/ButtonLink';
import { EditViewOnlyFields, getCommonFields } from './fieldCatalog';

export const saveConnection = async ({
  formObj,
  isEditView,
  connectionIsSAML,
  connectionIsOIDC,
  setupLinkToken,
  callback,
}: {
  formObj: FormObj;
  isEditView?: boolean;
  connectionIsSAML: boolean;
  connectionIsOIDC: boolean;
  setupLinkToken?: string;
  callback: (res: Response) => Promise<void>;
}) => {
  const {
    rawMetadata,
    redirectUrl,
    oidcDiscoveryUrl,
    oidcMetadata,
    oidcClientId,
    oidcClientSecret,
    metadataUrl,
    ...rest
  } = formObj;

  const encodedRawMetadata = btoa((rawMetadata as string) || '');
  const redirectUrlList = (redirectUrl as string)?.split(/\r\n|\r|\n/);

  const res = await fetch(
    setupLinkToken ? `/api/setup/${setupLinkToken}/sso-connection` : '/api/admin/connections',
    {
      method: isEditView ? 'PATCH' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...rest,
        encodedRawMetadata: connectionIsSAML ? encodedRawMetadata : undefined,
        oidcDiscoveryUrl: connectionIsOIDC ? oidcDiscoveryUrl : undefined,
        oidcMetadata: connectionIsOIDC ? oidcMetadata : undefined,
        oidcClientId: connectionIsOIDC ? oidcClientId : undefined,
        oidcClientSecret: connectionIsOIDC ? oidcClientSecret : undefined,
        redirectUrl: redirectUrl && redirectUrlList ? JSON.stringify(redirectUrlList) : undefined,
        metadataUrl: connectionIsSAML ? metadataUrl : undefined,
      }),
    }
  );
  callback(res);
};

export function fieldCatalogFilterByConnection(connection) {
  return ({ attributes }) =>
    attributes.connection && connection !== null ? attributes.connection === connection : true;
}

/** If a field item has a fallback attribute, only render it if the form state has the field item */
export function excludeFallback(formObj: FormObj) {
  return ({ key, fallback }: FieldCatalogItem) => {
    if (typeof fallback === 'object') {
      if (!(key in formObj)) {
        return false;
      }
    }
    return true;
  };
}

export function getHandleChange(setFormObj, opts: { key?: string; formObjParentKey?: string } = {}) {
  return (event: any) => {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    setFormObj((cur) =>
      opts.formObjParentKey
        ? {
            ...cur,
            [opts.formObjParentKey]: {
              ...(cur[opts.formObjParentKey] as FormObj),
              [target.id]: target[opts.key || 'value'],
            },
          }
        : { ...cur, [target.id]: target[opts.key || 'value'] }
    );
  };
}

export type FieldCatalogItem = {
  key: string;
  label?: string;
  type: 'url' | 'object' | 'pre' | 'text' | 'password' | 'textarea' | 'checkbox';
  placeholder?: string;
  attributes: fieldAttributes;
  members?: FieldCatalogItem[];
  fallback?: {
    key: string;
    activateCondition?: (fieldValue) => boolean;
    switch: { label: string; 'data-testid'?: string };
  };
};

type fieldAttributes = {
  required?: boolean;
  maxLength?: number;
  editable?: boolean;
  isArray?: boolean;
  rows?: number;
  accessor?: (any) => unknown;
  formatForDisplay?: (value) => string;
  isHidden?: (value) => boolean;
  showWarning?: (value) => boolean;
  hideInSetupView: boolean;
  connection?: string;
  'data-testid'?: string;
};

type FormObjValues = string | boolean | string[];

export type FormObj = Record<string, FormObjValues | Record<string, FormObjValues>>;

export const useFieldCatalog = ({
  isEditView,
  isSettingsView,
}: {
  isEditView?: boolean;
  isSettingsView?: boolean;
}) => {
  // Replace the existing useMemo that limits the fieldCatalog just for react
  // OnMount filedCatalog caches a value and returns it
  // OnUpdate based on the dependency array field catalog value is reassigned
  let fieldCatalog = onMount(() => {
    if (isEditView) {
      return [...getCommonFields({ isEditView: true, isSettingsView }), ...EditViewOnlyFields];
    }
    return [...getCommonFields({ isSettingsView })];
  });

  fieldCatalog = onUpdate(() => {
    if (isEditView) {
      return [...getCommonFields({ isEditView: true, isSettingsView }), ...EditViewOnlyFields];
    }
    return [...getCommonFields({ isSettingsView })];
  }, [isEditView, isSettingsView]);

  return fieldCatalog;
};

export default function renderFieldList(args: {
  isEditView?: boolean;
  formObj: FormObj;
  setFormObj: any;
  formObjParentKey?: string;
  activateFallback: (activeKey, fallbackKey) => void;
}) {
  const FieldList = ({
    key,
    placeholder,
    label,
    type,
    members,
    attributes: {
      isHidden,
      isArray,
      rows,
      formatForDisplay,
      editable,
      maxLength,
      showWarning,
      required = true,
      'data-testid': dataTestId,
    },
    fallback,
  }: FieldCatalogItem) => {
    const state = useStore({
      disabled: editable === false,
      get value() {
        return state.disabled && typeof formatForDisplay === 'function'
          ? formatForDisplay(
              args.formObjParentKey ? args.formObj[args.formObjParentKey]?.[key] : args.formObj[key]
            )
          : args.formObjParentKey
          ? args.formObj[args.formObjParentKey]?.[key]
          : args.formObj[key];
      },
      get isHiddenClassName() {
        return typeof isHidden === 'function' && isHidden(args.formObj[key]) == true ? ' hidden' : '';
      },
      get fallbackLogic() {
        return typeof fallback.activateCondition === 'function' ? fallback.activateCondition(value) : true;
      },
    });

    return (
      <div>
        <Show when={type === 'object'}>
          <Show when={typeof fallback === 'object' && state.fallbackLogic}>
            <div key={key}>
              <ButtonLink
                className='mb-2 px-0'
                type='button'
                data-testid={fallback.switch['data-testid']}
                onClick={() => {
                  /** Switch to fallback.key*/
                  args.activateFallback(key, fallback.key);
                }}>
                {fallback.switch.label}
              </ButtonLink>
            </div>
          </Show>
          {members?.map(
            renderFieldList({
              ...args,
              formObjParentKey: key,
            })
          )}
        </Show>
        <Show when={type !== 'object'}></Show>
      </div>
    );
  };

  return FieldList;
}

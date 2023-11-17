import { ConfirmationPromptProps } from '../shared/types';

export interface CreateDirectoryProps {
  excludeFields?: Array<keyof UnSavedDirectory>;
  urls: {
    post: string;
  };
  defaultWebhookEndpoint?: string | undefined;
  successCallback?: (info: { operation: 'CREATE'; connection?: Directory }) => void;
  errorCallback?: (errMsg: string) => void;
  // To handle cancel button click
  cancelCallback?: () => void;
  classNames?: {
    fieldContainer?: string;
    input?: string;
    label?: string;
    button?: { ctoa?: string };
  };
  /** Use this boolean to toggle the header display on/off. Useful when using the create component standalone */
  displayHeader?: boolean;
}

export interface DeleteDirectoryProps {
  urls: {
    delete: string;
  };
  cb: () => void;
  successCallback: (successMsg: string) => void;
  errorCallback: (errMsg: string) => void;
  classNames?: {
    section?: string;
  };
}

export interface DirectoryListProps {
  children?: any;
  tableCaption?: string;
  cols: ('name' | 'tenant' | 'product' | 'type' | 'status' | 'actions')[];
  setupLinkToken?: string;
  urls: {
    get: string;
  };
  errorCallback?: (errMessage: string) => void;
  handleListFetchComplete?: (directories: Directory[]) => void;
  handleActionClick: (action: 'edit' | 'view', directory: any) => void;
  classNames?: {
    tableContainer?: string;
  };
}

export interface EditDirectoryProps {
  urls: {
    patch: string;
    delete: string;
    get: string;
  };
  errorCallback?: (errMessage: string) => void;
  successCallback?: (info: { operation: 'UPDATE' | 'DELETE'; connection?: Directory }) => void;
  cancelCallback?: () => void;
  classNames?: {
    button?: { ctoa?: string; destructive?: string };
    confirmationPrompt?: ConfirmationPromptProps['classNames'];
    fieldContainer?: string;
    label?: string;
    input?: string;
    section?: string;
  };
  excludeFields?: Array<keyof Directory>;
  /** Use this boolean to toggle the header display on/off. Useful when using the edit component standalone */
  displayHeader?: boolean;
}

export interface ToggleDirectoryStatusProps {
  connection: Directory | null;
  urls: {
    patch: string;
  };
  errorCallback?: (errMsg: string) => void;
  successCallback?: (info: { operation: 'UPDATE' }) => void;
  classNames?: {
    container?: string;
    confirmationPrompt?: ConfirmationPromptProps['classNames'];
  };
}

export interface DirectoriesWrapperProps {
  componentProps: {
    directoryList: Omit<DirectoryListProps, 'handleActionClick'>;
    createDirectory: Partial<CreateDirectoryProps>;
    editDirectory: Partial<EditDirectoryProps>;
  };
}

export type ApiSuccess<T> = { data: T; pageToken?: string };

export interface ApiError extends Error {
  info?: string;
  status: number;
}

export type ApiResponse<T = any> = ApiSuccess<T> | { error: ApiError };

export enum DirectorySyncProviders {
  'azure-scim-v2' = 'Azure SCIM v2.0',
  'onelogin-scim-v2' = 'OneLogin SCIM v2.0',
  'okta-scim-v2' = 'Okta SCIM v2.0',
  'jumpcloud-scim-v2' = 'JumpCloud v2.0',
  'generic-scim-v2' = 'Generic SCIM v2.0',
  'google' = 'Google',
}

export type DirectoryType = keyof typeof DirectorySyncProviders;

export type Directory = {
  id: string;
  name: string;
  tenant: string;
  product: string;
  type: DirectoryType;
  log_webhook_events: boolean;
  scim: {
    path: string;
    endpoint?: string;
    secret: string;
  };
  webhook: {
    endpoint: string;
    secret: string;
  };
  deactivated?: boolean;
  google_domain?: string;
  google_access_token?: string;
  google_refresh_token?: string;
};

export type UnSavedDirectory = Omit<Directory, 'id' | 'scim' | 'deactivated' | 'webhook'> & {
  webhook_url: string;
  webhook_secret: string;
};

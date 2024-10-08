import { ConfirmationPromptProps, PaginateProps, TableCol, TableProps } from '../shared/types';

export interface CreateDirectoryProps {
  excludeFields?: Array<keyof UnSavedDirectory>;
  urls: {
    post: string;
  };
  defaultWebhookEndpoint?: string;
  defaultWebhookSecret?: string;
  successCallback?: (info: { operation: 'CREATE'; connection?: Directory }) => void;
  errorCallback?: (errMsg: string) => void;
  // To handle cancel button click
  cancelCallback?: () => void;
  classNames?: {
    fieldContainer?: string;
    input?: string;
    select?: string;
    label?: string;
    button?: { ctoa?: string; cancel?: string };
  };
  /** Use this boolean to toggle the header display on/off. Useful when using the create component standalone */
  displayHeader?: boolean;
  disableGoogleProvider?: boolean;
  tenant?: string;
  product?: string;
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
  cols?: ('name' | 'tenant' | 'product' | 'type' | 'status' | 'actions' | TableCol)[];
  urls: {
    get: string;
  };
  errorCallback?: (errMessage: string) => void;
  handleListFetchComplete?: (directories: Directory[]) => void;
  handleActionClick: (action: 'edit' | 'view', directory: any) => void;
  hideViewAction?: boolean;
  classNames?: {
    tableContainer?: string;
  };
  tableProps?: Pick<TableProps, 'tableCaption' | 'classNames'>;
  tenant?: string;
  product?: string;
  paginate?: Pick<PaginateProps, 'itemsPerPage'> & Partial<Pick<PaginateProps, 'handlePageChange'>>;
}

export interface EditDirectoryProps {
  urls: {
    patch: string;
    delete: string;
    get: string;
  };
  errorCallback?: (errMessage: string) => void;
  successCallback?: (info: { operation: 'UPDATE' | 'DELETE' | 'COPY'; connection?: Directory }) => void;
  cancelCallback?: () => void;
  classNames?: {
    button?: { ctoa?: string; destructive?: string; cancel?: string };
    confirmationPrompt?: ConfirmationPromptProps['classNames'];
    fieldContainer?: string;
    label?: string;
    input?: string;
    section?: string;
  };
  excludeFields?: Array<keyof (UnSavedDirectory & { scim_endpoint: string; scim_token: string })>;
  /** Use this boolean to toggle the header display on/off. Useful when using the edit component standalone */
  displayHeader?: boolean;
  /** Use this boolean to toggle the save button display on/off. Useful when using the edit component in setup links */
  hideSave?: boolean;
}

export interface ToggleDirectoryStatusProps {
  connection: Directory | null;
  urls: {
    patch: string;
  };
  errorCallback?: (errMsg: string) => void;
  successCallback?: (info: { operation: 'UPDATE'; connection?: Directory }) => void;
  classNames?: {
    container?: string;
    confirmationPrompt?: ConfirmationPromptProps['classNames'];
  };
}

export interface DirectoriesWrapperProps {
  classNames?: {
    button?: { ctoa?: string; destructive?: string; cancel?: string };
    input?: string;
    textarea?: string;
    select?: string;
    confirmationPrompt?: ConfirmationPromptProps['classNames'];
    secretInput?: string;
    section?: string;
  };
  componentProps?: {
    directoryList?: Partial<DirectoryListProps>;
    createDirectory?: Partial<CreateDirectoryProps>;
    editDirectory?: Partial<EditDirectoryProps>;
  };
  successCallback?: (info: {
    operation: 'CREATE' | 'UPDATE' | 'DELETE' | 'COPY';
    connection?: Partial<Directory | undefined>;
  }) => void;
  errorCallback?: (errMessage: string) => void;
  urls: {
    get: string;
    post: string;
    patch: string;
    delete: string;
  };
  title?: string;
  tenant?: string;
  product?: string;
}

export type ApiSuccess<T> = { data: T; pageToken?: string };

export interface ApiError extends Error {
  info?: string;
  status: number;
}

export type ApiResponse<T = any> = ApiSuccess<T> | { error: ApiError };

export enum DirectorySyncProviders {
  'azure-scim-v2' = 'Entra ID SCIM v2.0',
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
  google_authorization_url?: string;
};

export type UnSavedDirectory = Omit<Directory, 'id' | 'scim' | 'deactivated' | 'webhook'> & {
  webhook_url: string;
  webhook_secret: string;
};

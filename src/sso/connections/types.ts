export interface ConnectionListProps {
  setupLinkToken?: string;
  createConnectionUrl: string;
  idpEntityID?: string;
  isSettingsView?: boolean;
  translation: any;
}

export interface CreateConnectionProps {
  loading: boolean;
  cb: any;
  t: any;
  setupLinkToken?: string;
  connectionIsSAML: boolean;
  connectionIsOIDC: boolean;
}

export type ApiSuccess<T> = { data: T; pageToken?: string };

export interface ApiError extends Error {
  info?: string;
  status: number;
}

export type ApiResponse<T = any> = ApiSuccess<T> | { error: ApiError };

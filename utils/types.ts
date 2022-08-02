export interface ResponseFuncs {
  GET?: Function;
  POST?: Function;
  PUT?: Function;
  DELETE?: Function;
}

export interface Link {
  _id?: number;
  username: string;
  shortLink: string;
  fullLink: string;
  createdAt: string;
}

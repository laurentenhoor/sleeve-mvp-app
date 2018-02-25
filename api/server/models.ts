export enum FeedType {
    MANUAL = <any>'manual',
    SMART = <any>'smart'
  }

export interface Feed {
    _id?: string;
    version? : number,
    type?: FeedType,
    amount? : number,
    weights? : number[]
    errorCode?: number,
    timestamp?: number,
  }
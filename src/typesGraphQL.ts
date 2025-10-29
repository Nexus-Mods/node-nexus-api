import { ICreateCollectionResult } from '.';
import { ICollection, IDateTime, IFileHash, IGraphUser, IMod, IModFile, IModFileContent, IModFileContentPage, INodesFacet, IRevision, IUser } from './types';

// some helper types that convert an interface (with the proper data types)
// into one that can be used to declare a graphql query.
// Every POD gets converted into a boolean (to select which fields to returns),
// every object and array can also have a $filter field to send parameters to the
// graphql getter

export type PODs = number | string | boolean | IDateTime;

export interface IFilter {
  [key: string]: any;
};

export type ValuesOf<T extends any[]> = T[number];

export type Boolify<T> = T extends PODs
  ? boolean | { $filter?: IFilter }  // <-- Allow either boolean OR filter object
  : T extends any[]
  ? Querify<ValuesOf<T>>
  : Querify<T>;

export type QuerifyImpl<T> = {
  [P in keyof T]?: Boolify<T[P]>;
};

export type Querify<T> = QuerifyImpl<T> & { $filter?: IFilter };

export type GraphQLType = 'Int' | 'Float' | 'String' | 'Boolean' | 'DateTime' | string;

export interface GraphQueryParameters {
  [key: string]: { type: GraphQLType, optional: boolean };
}

export type ICollectionQuery = Querify<ICollection>;
export type IRevisionQuery = Querify<IRevision>;
export type ICreateCollectionQuery = Querify<ICreateCollectionResult>;

export type IModQuery = Querify<IMod>;
export type IModFileQuery = Querify<IModFile>;

export type IUserQuery = Querify<IGraphUser>;

export type IFileHashQuery = Querify<IFileHash>;

export type IModFileContentQuery = Querify<IModFileContent>;

export type IModFileContentPageQuery = Querify<IModFileContentPage>;

export type INodesFacetQuery = Querify<INodesFacet>;

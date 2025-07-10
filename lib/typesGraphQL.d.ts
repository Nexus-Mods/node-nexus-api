import { ICreateCollectionResult } from '.';
import { ICollection, IDateTime, IFileHash, IGraphUser, IMod, IModFile, IRevision } from './types';
export type PODs = number | string | boolean | IDateTime;
export interface IFilter {
    [key: string]: any;
}
export type ValuesOf<T extends any[]> = T[number];
export type Boolify<T> = T extends PODs ? boolean : T extends any[] ? Querify<ValuesOf<T>> : Querify<T>;
export type QuerifyImpl<T> = {
    [P in keyof T]?: Boolify<T[P]>;
};
export type Querify<T> = QuerifyImpl<T> & {
    $filter?: IFilter;
};
export type GraphQLType = 'Int' | 'Float' | 'String' | 'Boolean' | 'DateTime' | string;
export interface GraphQueryParameters {
    [key: string]: {
        type: GraphQLType;
        optional: boolean;
    };
}
export type ICollectionQuery = Querify<ICollection>;
export type IRevisionQuery = Querify<IRevision>;
export type ICreateCollectionQuery = Querify<ICreateCollectionResult>;
export type IModQuery = Querify<IMod>;
export type IModFileQuery = Querify<IModFile>;
export type IUserQuery = Querify<IGraphUser>;
export type IFileHashQuery = Querify<IFileHash>;

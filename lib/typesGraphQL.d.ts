import { ICollection, IDateTime, IRevision } from './types';
export declare type PODs = number | string | boolean | IDateTime;
export interface IFilter {
    [key: string]: any;
}
export declare type ValuesOf<T extends any[]> = T[number];
export declare type Boolify<T> = T extends PODs ? boolean : T extends any[] ? Querify<ValuesOf<T>> : Querify<T>;
export declare type QuerifyImpl<T> = {
    [P in keyof T]?: Boolify<T[P]>;
};
export declare type Querify<T> = QuerifyImpl<T> & {
    $filter?: IFilter;
};
export declare type GraphQLType = 'Int' | 'Float' | 'String' | 'Boolean' | 'DateTime' | string;
export interface GraphQueryParameters {
    [key: string]: {
        type: GraphQLType;
        optional: boolean;
    };
}
export declare type ICollectionQuery = Querify<ICollection>;
export declare type IRevisionQuery = Querify<IRevision>;

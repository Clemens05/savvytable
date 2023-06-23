import * as z from 'zod';

export type AsType<T extends z.ZodType<any, any, any>> = z.infer<T>;

export function Row<T extends z.ZodRawShape>(add: T) {
  return z
    .object({
      _id: RowTypes._Id,
      ...add,
    })
    .passthrough();
}

export type RowType = ReturnType<typeof Row>;

export function QueryResult<T extends z.ZodRawShape>(add: T) {
  return z.object(add);
}

export type QueryResultType = ReturnType<typeof QueryResult>;

export type AsArray<T extends z.ZodType> = ReturnType<typeof toArray<T>>;

export function toArray<T extends z.ZodType>(type: T) {
  return z.array(type);
}

export const Lit = <T extends z.Primitive>(value: T) => {
  return z.literal(value);
};
type RT_Lit = ReturnType<typeof Lit>;

export const Optional = <T extends z.ZodType>(value: T) => {
  return value.optional();
};

export namespace QueryTypes {
  export const Text = z.string().nullable();
  export const LongText = z.string().nullable();
  export const Number = z.number().nullable();
  export const Percent = z.number().nullable();
  export const Dollar = z.number().nullable();
  export const Euro = z.number().nullable();
  export const Yuan = z.number().nullable();
  export const AutoNumber = z.string();
  export const Checkbox = z.boolean();
  export const Email = z.string().email().nullable();
  export const URL = z.string().url().nullable();
  export const Duration = z.string().nullable();
  export const Image = z.array(z.string()).nullable(); // maybe z.array(z.string().url())
  export const Rating = z.number().nullable();
  export const Geolocation = z
    .intersection(
      z.object({
        lng: z.number(),
        lat: z.number(),
      }),
      z.object({
        country_region: z.string(),
      }),
    )
    .nullable();
  export const Button = z.null();
  export const Link = z
    .array(
      z.object({
        row_id: z.string(),
        display_value: z.string(),
      }),
    )
    .nullable();
  export const Collaborator = z.array(z.string()).nullable();
  export const _Id = z.string();
  export const _Ctime = z.string();
  export const _Mtime = z.string();
  export const _Archived = z.boolean();
  export const _Locked = z.boolean().nullable();
  export const _LockedBy = z.string(); // User
  export const _Creator = z.string();
  export const _LastModifier = z.string();
  export const SingleSelect = <T extends [RT_Lit, RT_Lit, ...RT_Lit[]]>(values: T) => {
    return z.union(values).nullable();
  };
  export const LazySingleSelect = z.string().nullable();
  export const MultipleSelect = <T extends [RT_Lit, RT_Lit, ...RT_Lit[]]>(values: T) => {
    return z.array(z.union(values)).nullable();
  };
  export const LazyMultipleSelect = z.array(z.string());
  export const Formula = <T extends z.ZodType>(type: T): z.ZodNullable<T> => {
    return type.nullable();
  };
  export const LinkFormula = <T extends z.ZodType>(type: T): z.ZodNullable<T> => {
    return type.nullable();
  };
}

export namespace RowTypes {
  export const Text = QueryTypes.Text;
  export const LongText = QueryTypes.LongText;
  export const Number = QueryTypes.Number;
  export const Percent = QueryTypes.Percent;
  export const Dollar = QueryTypes.Dollar;
  export const Euro = QueryTypes.Euro;
  export const Yuan = QueryTypes.Yuan;
  export const AutoNumber = QueryTypes.AutoNumber;
  export const Checkbox = QueryTypes.Checkbox;
  export const Email = QueryTypes.Email;
  export const URL = QueryTypes.URL;
  export const Duration = QueryTypes.Duration;
  export const Image = QueryTypes.Image;
  export const Rating = QueryTypes.Rating;
  export const Geolocation = QueryTypes.Geolocation;
  export const Button = QueryTypes.Button;
  export const Link = z.array(z.string());
  export const Collaborator = QueryTypes.Collaborator;
  export const _Id = QueryTypes._Id;
  export const _Ctime = QueryTypes._Ctime;
  export const _Mtime = QueryTypes._Mtime;
  export const _Archived = QueryTypes._Archived;
  export const _Locked = QueryTypes._Locked;
  export const _LockedBy = QueryTypes._LockedBy;
  export const _Creator = QueryTypes._Creator;
  export const _LastModifier = QueryTypes._LastModifier;
  export const SingleSelect = QueryTypes.SingleSelect;
  export const LazySingleSelect = QueryTypes.LazyMultipleSelect;
  export const MultipleSelect = QueryTypes.MultipleSelect;
  export const LazyMultipleSelect = QueryTypes.LazyMultipleSelect;
  export const Formula = QueryTypes.Formula;
  export const LinkFormula = QueryTypes.LinkFormula;
}

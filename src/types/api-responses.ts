import * as z from 'zod';

export const GetAppAccessTokenResponseSchema = z.object({
  app_name: z.string(),
  access_token: z.string(),
  dtable_uuid: z.string(),
  dtable_server: z.string().url(),
  dtable_socket: z.string().url(),
  workspace_id: z.number().int(),
  dtable_name: z.string(),
});

export const QueryResponseSchema = z.object({
  metadata: z.array(z.object({}).passthrough()),
  results: z.array(z.object({}).passthrough()),
});

export const ListRowsResponseSchema = z.object({
  rows: z.array(z.object({}).passthrough()),
});

export const AddRowResponseSchema = z
  .object({
    _id: z.string(),
    _creator: z.string().optional(),
    _last_modifier: z.string().optional(),
  })
  .passthrough();

export const AddRowsResponseSchema = z
  .object({
    inserted_row_count: z.number().int(),
  })
  .passthrough();

export const UpdateRowResponseSchema = z.object({ success: z.boolean().optional() }).passthrough();

export const UpdateRowsResponseSchema = z.object({ success: z.boolean().optional() }).passthrough();

export const DeleteRowResponseSchema = z.object({ success: z.boolean().optional() }).passthrough();

export const DeleteRowsResponseSchema = z.object({ success: z.boolean().optional() }).passthrough();

export const AdminAuthTokenResponse = z.object({
  token: z.string(),
});

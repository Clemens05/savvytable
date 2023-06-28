import * as z from 'zod';

export const WebhookSchema = z.object({
  event: z.literal('update'),
  data: z.object({
    dtable_uuid: z.string().max(32),
    row_id: z.string().max(22),
    op_user: z.string(),
    op_type: z.union([z.literal('insert_row'), z.literal('delete_row'), z.literal('modify_row')]),
    op_time: z.number(),
    table_id: z.string().length(4),
    table_name: z.string(),
    row_count: z.number().optional(),
    row_name: z.string(),
    row_data: z
      .array(
        z.object({
          column_key: z.union([
            z.string().length(4),
            z.literal('_id'),
            z.literal('_mtime'),
            z.literal('_ctime'),
            z.literal('_creator'),
            z.literal('_last_modifier'),
            z.literal('_archived'),
            z.literal('_locked_by'),
            z.literal('_locked'),
            z.string().startsWith('_'),
          ]),
          column_name: z.string(),
          column_type: z.string(),
          column_data: z
            .object({
              enable_send_notification: z.boolean().optional(),
              enable_fill_default_value: z.boolean().optional(),
              enable_check_format: z.boolean().optional(),
              format_specification_value: z.any().optional(),
              format_check_type: z.string().optional(),
              default_collaborator_type: z.string().optional(),
              default_value: z.any(),
            })
            .passthrough(),
          value: z.any(),
          old_value: z.any(),
        }),
      )
      .min(1),
    op_app: z.string().optional(),
  }),
});

export type Webhook = z.infer<typeof WebhookSchema>;

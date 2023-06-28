import axios from 'axios';
import {
  AddRowResponseSchema,
  AddRowsResponseSchema,
  DeleteRowResponseSchema,
  DeleteRowsResponseSchema,
  GetAppAccessTokenResponseSchema,
  ListRowsResponseSchema,
  QueryResponseSchema,
  UpdateRowResponseSchema,
  UpdateRowsResponseSchema,
} from './types/api-responses';
import { toArray, RowType, AsType, AsArray, QueryResultType } from './types/types';
import { OrderDirection, RowInsertPosition } from './types/general';
import { Table } from './table';

export class Base {
  private readonly url: string;
  private readonly token: string;
  private baseToken?: string;
  private uuid?: string;
  private server?: string;
  private dbServer?: string;
  private lastRefresh?: number;

  constructor(args: { url: string; token: string }) {
    const { token } = args;
    let { url } = args;
    if (url.endsWith('/')) url = url.slice(0, -1);
    this.url = url;
    this.token = token;
  }

  public Table(args: { name: string }): Table {
    const { name } = args;
    return new Table({
      base: this,
      tableName: name,
    });
  }

  private noAuthHeaders(): {
    'Content-Type': 'application/json';
  } {
    return {
      'Content-Type': 'application/json',
    };
  }

  private authHeaders(): {
    'Content-Type': 'application/json';
    Authorization: `Token ${string}`;
  } {
    return {
      'Content-Type': 'application/json',
      Authorization: `Token ${this.token}`,
    };
  }

  private async headers(): Promise<{
    'Content-Type': 'application/json';
    Authorization: `Token ${string}`;
  }> {
    return new Promise(async (resolve, reject) => {
      if (!this.isAuthenticated()) {
        await this.auth();
      }

      const date = new Date();
      date.setDate(date.getDate() - 2);
      if (new Date(this.lastRefresh!) < date) {
        await this.auth();
      }

      resolve({
        'Content-Type': 'application/json',
        Authorization: `Token ${this.baseToken}`,
      });
    });
  }

  private isAuthenticated(): boolean {
    return (
      this.lastRefresh !== undefined &&
      this.baseToken !== undefined &&
      this.server !== undefined &&
      this.dbServer !== undefined &&
      this.uuid !== undefined
    );
  }

  public async auth(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await axios({
          method: 'get',
          url: `${this.url}/api/v2.1/dtable/app-access-token/`,
          headers: this.authHeaders(),
        });

        const parsed = GetAppAccessTokenResponseSchema.safeParse(result.data);

        if (parsed.success) {
          const data = parsed.data;

          if (data.dtable_server.endsWith('/')) data.dtable_server = data.dtable_server.slice(0, -1);

          if (this.url.startsWith('https://') && data.dtable_server.startsWith('http://')) {
            data.dtable_server = data.dtable_server.replace('http://', 'https://');
          }

          this.lastRefresh = Date.now();
          this.baseToken = data.access_token;
          this.server = data.dtable_server;
          this.dbServer = data.dtable_socket + 'dtable-db';
          this.uuid = data.dtable_uuid;
          resolve();
        } else {
          reject(parsed.error);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  public async query<T extends QueryResultType>(args: {
    query: string;
    convertKeys?: boolean;
    rowSchema: T;
  }): Promise<AsType<AsArray<T>>> {
    const { query, rowSchema, convertKeys } = args;
    const convert = convertKeys ?? true;

    return new Promise(async (resolve, reject) => {
      try {
        if (!this.isAuthenticated()) {
          await this.auth();
        }

        const result = await axios({
          method: 'post',
          url: `${this.dbServer}/api/v1/query/${this.uuid}/`,
          headers: await this.headers(),
          data: {
            sql: query,
            convert_keys: convert,
          },
        });

        const parsed = QueryResponseSchema.safeParse(result.data);

        if (parsed.success) {
          const parsedSchema = toArray(rowSchema).safeParse(parsed.data.results);

          if (parsedSchema.success) {
            resolve(parsedSchema.data);
          } else {
            reject(parsedSchema.error);
          }
        } else {
          reject(parsed.error);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  public async getRow<T extends RowType>(args: {
    tableName: string;
    rowId: string;
    convertKeys?: boolean;
    rowSchema: T;
  }): Promise<AsType<T>> {
    const { tableName, rowId, convertKeys, rowSchema } = args;

    return new Promise(async (resolve, reject) => {
      try {
        if (!this.isAuthenticated()) {
          await this.auth();
        }

        const result = await axios({
          method: 'get',
          url: `${this.server}/api/v1/dtables/${this.uuid}/rows/${rowId}/`,
          headers: await this.headers(),
          params: {
            table_name: tableName,
            convert: convertKeys,
          },
        });

        const parsed = rowSchema.safeParse(result.data);

        if (parsed.success) {
          resolve(parsed.data);
        } else {
          reject(parsed.error);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  public async getRows<T extends RowType>(args: {
    tableName: string;
    viewName?: string;
    orderBy?: string;
    orderDirection?: OrderDirection;
    start?: number;
    limit?: number;
    rowSchema: T;
  }): Promise<AsType<AsArray<T>>> {
    const { tableName, viewName, orderBy, orderDirection, start, limit, rowSchema } = args;

    return new Promise(async (resolve, reject) => {
      try {
        if (!this.isAuthenticated()) {
          await this.auth();
        }

        const result = await axios({
          method: 'get',
          url: `${this.server}/api/v1/dtables/${this.uuid}/rows/`,
          headers: await this.headers(),
          params: {
            table_name: tableName,
            view_name: viewName,
            convert_link_id: undefined,
            order_by: orderBy,
            direction: orderDirection,
            start: start,
            limit: limit,
          },
        });

        const parsed = ListRowsResponseSchema.safeParse(result.data);

        if (parsed.success) {
          const parsedSchema = toArray(rowSchema).safeParse(parsed.data.rows);

          // console.log(parsed.data.rows);

          if (parsedSchema.success) {
            resolve(parsedSchema.data);
          } else {
            reject(parsedSchema.error);
          }
        } else {
          reject(parsed.error);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  public async addRow<T extends object>(args: {
    tableName: string;
    row: T;
  }): Promise<AsType<typeof AddRowResponseSchema>>;
  public async addRow<T extends object>(args: {
    tableName: string;
    row: T;
    anchorRowId: string;
    rowInsertPosition: RowInsertPosition;
  }): Promise<AsType<typeof AddRowResponseSchema>>;
  public async addRow<T extends object>(
    args:
      | {
          tableName: string;
          row: T;
        }
      | {
          tableName: string;
          row: T;
          anchorRowId: string;
          rowInsertPosition: RowInsertPosition;
        },
  ): Promise<AsType<typeof AddRowResponseSchema>> {
    const { tableName, row } = args;

    return new Promise(async (resolve, reject) => {
      try {
        if (!this.isAuthenticated()) {
          await this.auth();
        }

        const result = await axios({
          method: 'post',
          url: `${this.server}/api/v1/dtables/${this.uuid}/rows/`,
          headers: await this.headers(),
          data: {
            table_name: tableName,
            row: row,
            anchor_row_id: 'anchorRowId' in args ? args.anchorRowId : undefined,
            row_insert_position: 'rowInsertPosition' in args ? `insert_${args.rowInsertPosition}` : undefined,
          },
        });

        const parsed = AddRowResponseSchema.safeParse(result.data);

        if (parsed.success) {
          resolve(parsed.data);
        } else {
          reject(parsed.error);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  public async addRows<T extends object>(args: { tableName: string; rows: T[] }): Promise<number> {
    const { tableName, rows } = args;

    return new Promise(async (resolve, reject) => {
      try {
        if (!this.isAuthenticated()) {
          await this.auth();
        }

        const result = await axios({
          method: 'post',
          url: `${this.server}/api/v1/dtables/${this.uuid}/batch-append-rows/`,
          headers: await this.headers(),
          data: {
            table_name: tableName,
            rows: rows,
          },
        });

        const parsed = AddRowsResponseSchema.safeParse(result.data);

        if (parsed.success) {
          resolve(parsed.data.inserted_row_count);
        } else {
          reject(parsed.error);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  public async updateRow<T extends object>(args: { tableName: string; rowId: string; row: T }): Promise<void> {
    const { tableName, rowId, row } = args;

    return new Promise(async (resolve, reject) => {
      try {
        if (!this.isAuthenticated()) {
          await this.auth();
        }

        const result = await axios({
          method: 'put',
          url: `${this.server}/api/v1/dtables/${this.uuid}/rows/`,
          headers: await this.headers(),
          data: {
            table_name: tableName,
            row_id: rowId,
            row: row,
          },
        });

        const parsed = UpdateRowResponseSchema.safeParse(result);

        if (parsed.success) {
          if (parsed.data.success === undefined || parsed.data.success === true) {
            resolve();
          } else {
            reject('Failed');
          }
        } else {
          reject(parsed.error);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  public async updateRows<T extends object>(args: {
    tableName: string;
    rows: {
      rowId: string;
      data: T;
    }[];
  }): Promise<void> {
    const { tableName, rows } = args;

    const updates = rows.map((row) => {
      return {
        row_id: row.rowId,
        row: row.data,
      };
    });

    return new Promise(async (resolve, reject) => {
      try {
        if (!this.isAuthenticated()) {
          await this.auth();
        }

        const result = await axios({
          method: 'put',
          url: `${this.server}/api/v1/dtables/${this.uuid}/batch-update-rows/`,
          headers: await this.headers(),
          data: {
            table_name: tableName,
            updates: updates,
          },
        });

        const parsed = UpdateRowsResponseSchema.safeParse(result);

        if (parsed.success) {
          if (parsed.data.success === undefined || parsed.data.success === true) {
            resolve();
          } else {
            reject('Failed');
          }
        } else {
          reject(parsed.error);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  public async deleteRow(args: { tableName: string; rowId: string }): Promise<void> {
    const { tableName, rowId } = args;

    return new Promise(async (resolve, reject) => {
      try {
        if (!this.isAuthenticated()) {
          await this.auth();
        }

        const result = await axios({
          method: 'delete',
          url: `${this.server}/api/v1/dtables/${this.uuid}/rows/`,
          headers: await this.headers(),
          data: {
            table_name: tableName,
            row_id: rowId,
          },
        });

        const parsed = DeleteRowResponseSchema.safeParse(result.data);

        if (parsed.success) {
          if (parsed.data.success === undefined || parsed.data.success === true) {
            resolve();
          } else {
            reject('Failed');
          }
        } else {
          reject(parsed.error);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  public async deleteRows(args: { tableName: string; rowIds: string[] }): Promise<void> {
    const { tableName, rowIds } = args;

    return new Promise(async (resolve, reject) => {
      try {
        if (!this.isAuthenticated()) {
          await this.auth();
        }

        const result = await axios({
          method: 'delete',
          url: `${this.server}/api/v1/dtables/${this.uuid}/batch-delete-rows`,
          headers: await this.headers(),
          data: {
            table_name: tableName,
            row_ids: rowIds,
          },
        });

        const parsed = DeleteRowsResponseSchema.safeParse(result);

        if (parsed.success) {
          if (parsed.data.success === undefined || parsed.data.success === true) {
            resolve();
          } else {
            reject('Failed');
          }
        } else {
          reject(parsed.error);
        }
      } catch (e) {
        reject(e);
      }
    });
  }
}

import { Base } from './base';
import { AddRowResponseSchema } from './types/api-responses';
import { OrderDirection, RowInsertPosition } from './types/general';
import { AsArray, AsType, RowType } from './types/types';

export class Table {
  private readonly base: Base;
  private readonly tableName: string;

  constructor(args: { base: Base; tableName: string }) {
    const { base, tableName } = args;
    this.base = base;
    this.tableName = tableName;
  }

  public async getRow<T extends RowType>(args: {
    rowId: string;
    convertKeys?: boolean;
    rowSchema: T;
  }): Promise<AsType<T>> {
    return this.base.getRow({
      tableName: this.tableName,
      ...args,
    });
  }

  public async getRows<T extends RowType>(args: {
    viewName?: string;
    orderBy?: string;
    orderDirection?: OrderDirection;
    start?: number;
    limit?: number;
    rowSchema: T;
  }): Promise<AsType<AsArray<T>>> {
    return this.base.getRows({ tableName: this.tableName, ...args });
  }

  public async addRow<T extends object>(args: { row: T }): Promise<AsType<typeof AddRowResponseSchema>>;
  public async addRow<T extends object>(args: {
    row: T;
    anchorRowId: string;
    rowInsertPosition: RowInsertPosition;
  }): Promise<AsType<typeof AddRowResponseSchema>>;
  public async addRow<T extends object>(
    args:
      | {
          row: T;
        }
      | {
          row: T;
          anchorRowId: string;
          rowInsertPosition: RowInsertPosition;
        },
  ): Promise<AsType<typeof AddRowResponseSchema>> {
    return this.base.addRow({
      tableName: this.tableName,
      ...args,
    });
  }

  public async addRows<T extends object>(args: { rows: T[] }): Promise<number> {
    return this.base.addRows({
      tableName: this.tableName,
      ...args,
    });
  }

  public async updateRow<T extends object>(args: { rowId: string; row: T }): Promise<void> {
    return this.base.updateRow({
      tableName: this.tableName,
      ...args,
    });
  }

  public async updateRows<T extends object>(args: {
    rows: {
      rowId: string;
      data: T;
    }[];
  }): Promise<void> {
    return this.base.updateRows({
      tableName: this.tableName,
      ...args,
    });
  }

  public async deleteRow(args: { rowId: string }): Promise<void> {
    return this.base.deleteRow({
      tableName: this.tableName,
      ...args,
    });
  }

  public async deleteRows(args: { rowIds: string[] }): Promise<void> {
    return this.base.deleteRows({
      tableName: this.tableName,
      ...args,
    });
  }
}

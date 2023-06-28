# savvytable

## <a name="installing"></a> Installing

```bash
npm install savvytable
```

## <a name="about"></a> About

- Use the SeaTable API in your NodeJS project
- Typesafe with [zod](https://zod.dev)
- Extend your row schemas with zod

## <a name="examples"></a> Examples

- [Base: Initialization](#base-initialization)
- [Base: Authentication](#base-authentication)
- [Query Schema](#query-schema)
- [Base: Query](#base-query)
- [Table: Initialization](#table-initialization)
- [Row Schema](#row-schema)
- [Table: Get Row](#table-get-row)
- [Table: Get Rows](#table-get-rows)
- [Table: Append Row](#table-append-row)
- [Table: Insert Row](#table-insert-row)
- [Table: Append Rows](#table-append-rows)
- [Table: Update Row](#table-update-row)
- [Table: Update Rows](#table-update-rows)
- [Table: Delete Row](#table-delete-row)
- [Table: Delete Rows](#table-delete-rows)
- [Admin: Initialization](#admin-initialization)
- [Admin: Get User Info](#admin-get-user-info)
- [Extend Row Schema With Zod](#extend-row-schema-with-zod)

### <a name="base-initialization"></a> Base: Initialization

```ts
import { Base } from 'savvytable';

const base = new Base({
  url: 'https://table.example.com'.
  token: '<TOKEN>'
});
```

### <a name="base-authentication"></a> Base: Authentication

```ts
await base.auth();
```

### <a name="query-schema"></a> Query Schema

```ts
import { QueryResult, QueryTypes, AsType } from 'savvytable';

const EmployeeRowSchema = QueryResult({
  ID: QueryTypes.AutoNumber,
  Nr: QueryTypes.Number,
  Name: QueryTypes.Text,
  Employee: QueryTypes.Collaborator,
  Worktime: QueryTypes.Link,
});

type EmployeeRow = AsType<typeof EmployeeRowSchema>;
```

### <a name="base-query"></a> Base: Query

```ts
const result: EmployeeRow[] = await base.query({
  query: 'SELECT * FROM Employee',
  rowSchema: EmployeeRowSchema,
});
```

### <a name="table-initialization"></a> Table: Initialization

```ts
const table = base.Table({
  name: 'Employee',
});
```

### <a name="row-schema"></a> Row Schema

```ts
import { Row, RowTypes, AsType } from 'savvytable';

const EmployeeRowSchema = Row({
  _id: RowTypes._Id,
  ID: RowTypes.AutoNumber,
  Nr: Optional(RowTypes.Number),
  Name: Optional(RowTypes.Text),
  Employee: Optional(RowTypes.Collaborator),
  Worktime: Optional(RowTypes.Link),
});

type EmployeeRow = AsType<typeof EmployeeRowSchema>;
```

### <a name="table-get-row"></a> Table: Get Row

```ts
const result: EmployeeRow = await table.getRow({
  rowId: 'VV_vVwlESmWZ86ANOIt1fQ',
  rowSchema: EmployeeRowSchema,
});
```

### <a name="table-get-rows"></a> Table: Get Rows

```ts
const result: EmployeeRow[] = await table.getRows({
  rowSchema: EmployeeRowSchema,
});
```

### <a name="table-append-row"></a> Table: Append Row

```ts
const result = await table.addRow({
  row: {
    Name: 'TESTNAME',
  },
});
```

### <a name="table-insert-row"></a> Table: Insert Row

```ts
const result = await table.addRow({
  row: {
    Name: 'TEST_INSERT_ABOVE',
  },
  anchorRowId: 'MNJ3ylTORW631nDJ3OBxeQ',
  rowInsertPosition: 'above',
});
```

### <a name="table-append-rows"></a> Table: Append Rows

```ts
const result = await table.addRows({
  rows: [
    {
      Name: 'ADD_001',
    },
    {
      Name: 'ADD_002',
    },
  ],
});
```

### <a name="table-update-row"></a> Table: Update Row

```ts
await table.updateRow({
  rowId: 'PsgeZOn5Q7Cm49zZusGjow',
  row: {
    Name: '...',
  },
});
```

### <a name="table-update-rows"></a> Table: Update Rows

```ts
await table.updateRows({
  rows: [
    {
      rowId: 'PsgeZOn5Q7Cm49zZusGjow',
      data: {
        Name: 'UPDATE_ROW_1',
      },
    },
    {
      rowId: 'JEyEg166RvCGl1lsoV-6TQ',
      data: {
        Name: 'UPDATE_ROW_2',
      },
    },
  ],
});
```

### <a name="table-delete-row"></a> Table: Delete Row

```ts
await table.deleteRow({
  rowId: 'GDmShJ84SYaB4KOs_v_Tzw',
});
```

### <a name="table-delete-rows"></a> Table: Delete Rows

```ts
await table.deleteRows({
  rowIds: ['L0AJLFTMTamxpjwxR_CNbQ', 'NVGuoFibTESXme8-ySAA9w'],
});
```

### <a name="admin-initialization"></a> Admin: Initialization

```ts
import { Admin } from 'savvytable';

const admin = await Admin.withCredentials({
  url: 'https://table.example.com',
  username: 'user@example.com',
  password: '123456',
});
```

### <a name="admin-get-user-info"></a> Admin: Get User Info

```ts
const result = await admin.getUser({
  userId: '2433b1c2fac24caba92f4c48019354fa@auth.local',
});
```

### <a name="extend-row-schema-with-zod"></a> Extend Row Schema With Zod

```ts
import * as z from 'zod';
import { Row } from 'savvytable';

const EmployeeRowSchema = Row({
  _id: RowTypes._Id,
  ID: z.string().length(4),
  Nr: Optional(RowTypes.Number),
  Name: Optional(RowTypes.Text),
  Employee: Optional(RowTypes.Collaborator),
  Worktime: Optional(z.string().url().startsWith('https://')),
});
```

# savvytable

## Installing

```bash
npm install savvytable
```

## About

- Use the SeaTable API in your NodeJS project
- Typesafe with [zod](https://zod.dev)

## Examples

### SQL Query

```ts
import { Base, Table, Types, AsType } from "savvytable";

const EmployeeRowSchema = Row({
	Name: Types.String(),
	Position: Types.SingleSelect(["Consulting", "Development"]),
	Workplace: Types.Link("Workplaces"),
});

type EmployeeRow = AsType<typeof EmployeeRowSchema>;

async function query() {
	const base = new Base({
		url: "<URL>",
		token: "<TOKEN>",
	});
	await base.auth();
	try {
		const result: EmployeeRow[] = await base.query({
			query: "SELECT * FROM MyTable LIMIT 100",
			rowSchema: EmployeeRowSchema,
		});
		for (const row of result.results) {
			console.log(row.Name);
		}
	} catch (e) {
		console.log(e);
	}
}
```

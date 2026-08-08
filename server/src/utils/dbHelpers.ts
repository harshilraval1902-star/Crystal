export function mapBooleans<T extends Record<string, any>>(obj: T, fields: (keyof T)[]): T {
  if (!obj) return obj;
  for (const field of fields) {
    if (obj[field] !== undefined && obj[field] !== null) {
      obj[field] = Boolean(obj[field]) as any;
    }
  }
  return obj;
}

export function buildUpdateQuery(tableName: string, data: Record<string, any>) {
  const keys = Object.keys(data).filter((k) => data[k] !== undefined);
  if (keys.length === 0) return null;
  const setClause = keys.map((k) => `${k} = ?`).join(", ");
  const values = keys.map((k) => data[k]);
  return { setClause, values };
}

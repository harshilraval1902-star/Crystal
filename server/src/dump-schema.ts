import pool from "./config/db";

async function dumpSchema() {
  try {
    const [tables] = await pool.query("SHOW TABLES");
    
    for (const tableRow of tables as any[]) {
      const tableName = Object.values(tableRow)[0] as string;
      console.log(`\nTable: ${tableName}`);
      const [columns] = await pool.query(`DESCRIBE ${tableName}`);
      for (const col of columns as any[]) {
        console.log(`  ${col.Field} (${col.Type})`);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

dumpSchema();

import { exec } from "child_process";
import { promises as fsPromises, existsSync, mkdirSync } from "fs";
import path from "path";
import "dotenv/config";

const BACKUP_DIR = path.resolve(process.cwd(), process.env.BACKUP_DIR ?? "backups");
const RETENTION_DAYS = parseInt(process.env.BACKUP_RETENTION_DAYS ?? "30", 10);

async function parseDatabaseUrl(urlStr: string) {
  if (urlStr.startsWith("file:")) {
    const dbPath = path.resolve(process.cwd(), urlStr.replace("file:", ""));
    return { type: "sqlite", path: dbPath };
  } else if (urlStr.startsWith("mysql://")) {
    try {
      const url = new URL(urlStr);
      const username = url.username;
      const password = url.password;
      const host = url.hostname;
      const port = url.port || "3306";
      const database = url.pathname.replace("/", "");
      return { type: "mysql", host, port, username, password, database };
    } catch {
      throw new Error("Invalid MySQL database URL format.");
    }
  }
  throw new Error("Unsupported database type. Supported types: sqlite (file:), mysql (mysql://)");
}

export async function runBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("❌ DATABASE_URL environment variable is missing.");
    return;
  }

  try {
    if (!existsSync(BACKUP_DIR)) {
      mkdirSync(BACKUP_DIR, { recursive: true });
    }

    const dbConfig = await parseDatabaseUrl(databaseUrl);

    if (dbConfig.type === "sqlite" && "path" in dbConfig) {
      const sqlitePath = dbConfig.path;
      if (!sqlitePath || !existsSync(sqlitePath)) {
        console.error(`❌ SQLite source database not found at: ${sqlitePath}`);
        return;
      }
      const destPath = path.join(BACKUP_DIR, `backup-sqlite-${timestamp}.db`);
      await fsPromises.copyFile(sqlitePath, destPath);
      console.log(`✅ SQLite database backup created successfully: ${destPath}`);
    } else if (dbConfig.type === "mysql") {
      const { host, port, username, password, database } = dbConfig;
      const destPath = path.join(BACKUP_DIR, `backup-mysql-${database}-${timestamp}.sql`);

      // Set password environment variable for mysqldump securely
      const env = { ...process.env, MYSQL_PWD: password };
      
      const mysqldumpExe = process.env.MYSQLDUMP_PATH ? `"${process.env.MYSQLDUMP_PATH}"` : 'mysqldump';
      const dumpCmd = `${mysqldumpExe} -h ${host} -P ${port} -u ${username} ${database} > "${destPath}"`;

      await new Promise<void>((resolve, reject) => {
        exec(dumpCmd, { env }, (err, stdout, stderr) => {
          if (err) {
            reject(new Error(`mysqldump execution failed: ${stderr || err.message}`));
          } else {
            resolve();
          }
        });
      });
      console.log(`✅ MySQL database backup created successfully: ${destPath}`);
    }

    await pruneExpiredBackups();
  } catch (error: any) {
    console.error("❌ Database backup failed:", error.message || error);
  }
}

async function pruneExpiredBackups() {
  try {
    const files = await fsPromises.readdir(BACKUP_DIR);
    const now = Date.now();
    const retentionMs = RETENTION_DAYS * 24 * 60 * 60 * 1000;

    for (const file of files) {
      const filePath = path.join(BACKUP_DIR, file);
      const stat = await fsPromises.stat(filePath);

      if (now - stat.mtimeMs > retentionMs) {
        await fsPromises.unlink(filePath);
        console.log(`🧹 Deleted expired backup file: ${file}`);
      }
    }
  } catch (error) {
    console.error("❌ Failed to prune expired backups:", error);
  }
}

// If run directly from the command line
if (require.main === module) {
  runBackup();
}

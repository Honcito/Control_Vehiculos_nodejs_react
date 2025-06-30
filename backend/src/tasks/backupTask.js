import cron from "node-cron";
import fs from "fs";
import path from "path";

const DB_PATH = "c:/database/control_vehiculos.db";
const BACKUP_DIR = "c:/Control_Backup_react";

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

function backupDatabase() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFile = path.join(BACKUP_DIR, `backup-${timestamp}.sqlite`);

  fs.copyFile(DB_PATH, backupFile, (err) => {
    if (err) console.error("Error backup:", err);
    else console.log("Backup creado:", backupFile);
  });
}

cron.schedule("0 1 * * *", () => {
  console.log("Ejecutando backup diario...");
  backupDatabase();
});

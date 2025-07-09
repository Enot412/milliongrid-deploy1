const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');

const backupDir = path.join(__dirname, 'backup');
const adsFile = path.join(__dirname, 'ads.json');
const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupFolder = path.join(backupDir, `backup-${timestamp}`);
fs.mkdirSync(backupFolder);

fse.copyFileSync(adsFile, path.join(backupFolder, 'ads.json'));
fse.copySync(uploadsDir, path.join(backupFolder, 'uploads'));

console.log(`Backup completed: ${backupFolder}`);

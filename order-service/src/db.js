import fs from 'fs';
import path from 'path';
const dataDir = path.resolve(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'db.json');

function ensure() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({ orders: [], menu: sampleMenu() }, null, 2));
  }
}

function sampleMenu() {
  return [
    { id: 'm1', name: 'Margherita Pizza', price: 299 },
    { id: 'm2', name: 'Paneer Tikka', price: 249 },
    { id: 'm3', name: 'Veg Biryani', price: 219 }
  ];
}

export function readDB() {
  ensure();
  return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
}

export function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}
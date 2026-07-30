import https from 'https';
import fs from 'fs';
import path from 'path';

// Target repo: Reiclid/InterStellar
const repo = "Reiclid/InterStellar";
const tagName = "v1.0.0";

console.log(`Publishing GitHub Release for ${repo} tag ${tagName}...`);

// Check if releases files exist
const exePath = path.resolve("releases/interstellar.exe");
const setupPath = path.resolve("releases/InterStellar_1.0.0_x64-setup.exe");

console.log("EXE Path:", exePath, "Exists:", fs.existsSync(exePath));
console.log("Setup Path:", setupPath, "Exists:", fs.existsSync(setupPath));

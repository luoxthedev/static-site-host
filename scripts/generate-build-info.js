import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  // Get commit hash (short version)
  const commitHash = execSync('git rev-parse --short HEAD').toString().trim();
  
  // Get commit timestamp
  const commitTimestamp = execSync('git log -1 --format=%ct').toString().trim();
  
  // Get commit date in ISO format for better readability
  const commitDate = execSync('git log -1 --format=%cI').toString().trim();
  
  const buildInfo = {
    commitHash,
    commitTimestamp: parseInt(commitTimestamp, 10) * 1000, // Convert to milliseconds
    commitDate,
    buildTime: Date.now(),
  };
  
  const outputPath = join(__dirname, '..', 'src', 'buildInfo.json');
  writeFileSync(outputPath, JSON.stringify(buildInfo, null, 2));
  
  console.log('Build info generated:', buildInfo);
} catch (error) {
  console.error('Error generating build info:', error);
  // Generate fallback build info
  const buildInfo = {
    commitHash: 'unknown',
    commitTimestamp: Date.now(),
    commitDate: new Date().toISOString(),
    buildTime: Date.now(),
  };
  
  const outputPath = join(__dirname, '..', 'src', 'buildInfo.json');
  writeFileSync(outputPath, JSON.stringify(buildInfo, null, 2));
}

import { execSync } from 'child_process';

module.exports = () => {
  try {
    execSync('docker compose -f docker-compose.test.yml up -d');
    execSync('npx mikro-orm migration:up');
  } catch (error) {
    console.log(error);
  }
};

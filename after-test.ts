import { execSync } from 'child_process';

module.exports = () => {
  try {
    execSync('docker compose -f docker-compose.test.yml down');
  } catch (error) {
    console.log(error);
  }
};

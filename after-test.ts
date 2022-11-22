import { execSync } from 'child_process';

module.exports = () => {
  try {
    console.log('DB Has stopped');
    execSync('docker compose -f test.docker-compose.yml down');
  } catch (error) {
    console.log(error);
  }
};

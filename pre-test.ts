import { execSync } from 'child_process';

module.exports = async () => {
  try {
    // execSync('docker compose -f docker-compose.test.yml up -d');
    execSync('docker compose -f docker-compose.test.yml up -d');

    setTimeout(
      () => execSync('docker container exec todo_container dropdb todo-db'),
      50,
    );

    setTimeout(
      () => execSync(`docker container exec todo_container createdb todo-db`),
      50,
    );

    setTimeout(() => execSync('npx mikro-orm migration:up'), 50);
  } catch (error) {
    console.log(error);
  }
};

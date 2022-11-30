import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { promisify } from 'util';

dotenv.config({ path: path.join(process.cwd(), './.env.test') });

// eslint-disable-next-line @typescript-eslint/no-var-requires
const exec = promisify(require('child_process').exec);

module.exports = async () => {
  try {
    execSync(
      'export NODE_ENV=test && docker compose -f docker-compose.test.yml up -d',
    );

    await waitForDatabaseConnection();

    // Remove any other connection before droping database
    execSync(
      `docker container exec todo_postgres psql -U ${process.env.DB_USER} -W postgres --quiet -c "UPDATE pg_database SET datallowconn = 'false' WHERE datname = '${process.env.DB_NAME}'; SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${process.env.DB_NAME}';"`,
    );

    execSync(
      `docker container exec todo_postgres dropdb -U ${process.env.DB_USER} ${process.env.DB_NAME} --if-exists`,
    );

    execSync(
      `docker container exec todo_postgres createdb -U ${process.env.DB_USER} ${process.env.DB_NAME}`,
    );

    execSync('npx mikro-orm migration:up');
  } catch (error) {
    console.log(error);
  }
};

const waitForDatabaseConnection = async () => {
  try {
    const response = await exec(
      `docker container exec todo_postgres pg_isready`,
    );

    if (response.stdout.includes('accepting connections')) {
      return true;
    }

    await wait(100);
    return waitForDatabaseConnection();
  } catch {
    await wait(100);
    return waitForDatabaseConnection();
  }
};

const wait = (time: number) => {
  return new Promise((resolve) => setTimeout(() => resolve(undefined), time));
};

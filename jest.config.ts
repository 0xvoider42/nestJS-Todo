import type { Config } from 'jest';

const config: Config = {
  setupFiles: ['test.docker-compose.yml'],
};

export default config;

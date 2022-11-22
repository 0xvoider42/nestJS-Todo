import { Test } from '@nestjs/testing';
import { execSync } from 'child_process';

import { AppModule } from '../../app.module';
import { AuthenticationService } from '../../authentication/authentication.service';

describe('Todo service', () => {
  let service: AuthenticationService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = await moduleRef.get(AuthenticationService);

    try {
      execSync('docker compose -f test.docker-compose.yml up -d');
      execSync('npx mikro-orm migration:up');
    } catch (error) {
      console.log(error);
    }
  });

  afterAll(() => {
    try {
      execSync('docker compose down');
    } catch (error) {
      console.log(error);
    }
  });

  describe('Create todo', () => {
    it('should return 201', async () => {
      const email = 'ee@ee.com';
      const password = 'qwerty';

      const user = await service.signUp({ email, password });
      expect(user.access_token).toEqual(expect.any(String));
    });
  });
});

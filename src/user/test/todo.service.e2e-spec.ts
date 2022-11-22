import { Test } from '@nestjs/testing';

import { AppModule } from '../../app.module';
import { AuthenticationService } from '../../authentication/authentication.service';

describe('Todo service', () => {
  let service: AuthenticationService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = await moduleRef.get(AuthenticationService);
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

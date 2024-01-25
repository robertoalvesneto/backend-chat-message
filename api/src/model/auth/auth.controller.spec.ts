import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { BeforeInsert, BeforeUpdate } from 'typeorm';
import { JwtAccessToken } from './dto/jwt-token.dto';

class MockProfile {
    id: number;
    name: string;

    @BeforeInsert()
    @BeforeUpdate()
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    validate(): void {}
}

describe('AuthController', () => {
    let app: INestApplication;
    let authService: AuthService;

    const mockProfile = new MockProfile();
    mockProfile.id = 0;
    mockProfile.name = 'profile test';

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [
                PassportModule.register({ defaultStrategy: 'jwt' }),
                JwtModule.register({
                    secret: 'secret',
                    signOptions: { expiresIn: '1h' },
                }),
            ],
            controllers: [AuthController],
            providers: [AuthService],
        }).compile();

        app = moduleRef.createNestApplication();
        authService = moduleRef.get<AuthService>(AuthService);

        await app.init();
    });

    afterEach(async () => {
        await app.close();
    });

    describe('login', () => {
        it('should return an access token with valid credentials', async () => {
            const spy = jest
                .spyOn(authService, 'validateUser')
                .mockResolvedValueOnce({
                    id: 1,
                    name: 'test',
                    email: 'test@calcomp.com.br',
                    profile: mockProfile,
                });
            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password',
                });

            const body = response.body as JwtAccessToken;

            expect(response.status).toBe(HttpStatus.OK);
            expect(body.access_token).toBeDefined();
            expect(body.access_token.token).toBeDefined();
            expect(typeof body.access_token.token).toBe('string');

            spy.mockRestore();
        });

        it('should return an unauthorized error with invalid credentials', async () => {
            const spy = jest
                .spyOn(authService, 'validateUser')
                .mockResolvedValueOnce(null);
            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrong_password',
                });

            expect(response.status).toBe(HttpStatus.UNAUTHORIZED);

            spy.mockRestore();
        });
    });
});

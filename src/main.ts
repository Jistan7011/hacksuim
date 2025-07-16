import * as passport from 'passport';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
  });

  const ipRequestCounts = new Map<string, { count: number; timestamp: number }>();
  app.use((req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const windowMs = 15 * 60 * 1000;
    const max = 100;

    const entry = ipRequestCounts.get(ip) || { count: 0, timestamp: now };
    if (now - entry.timestamp > windowMs) {
      entry.count = 1;
      entry.timestamp = now;
    } else {
      entry.count += 1;
    }

    ipRequestCounts.set(ip, entry);

    if (entry.count > max) {
      return res.status(429).json({ message: 'Too many requests' });
    }

    next();
  });

  const config = new DocumentBuilder()
    .setTitle('SmartCity Automotive API for Public Transport')
    .setDescription('')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Smart City Automotive API for Public Transport',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  if (process.env.NODE_ENV !== 'production') {
    app.use('/api/api-docs', (req, res, next) => {
      const auth = req.headers.authorization;
      if (!auth || !auth.startsWith('Basic ')) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Swagger"');
        return res.status(401).send('Authentication required.');
      }

      const base64Credentials = auth.split(' ')[1];
      const [username, password] = Buffer.from(base64Credentials, 'base64').toString().split(':');

      const BASIC_USER = 'admin';
      const BASIC_PASS = 'admin123';

      if (username !== BASIC_USER || password !== BASIC_PASS) {
        return res.status(403).send('Forbidden');
      }

      next();
    });

    SwaggerModule.setup('/api/api-docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.use(
    session({
      secret: 'SESSION_SECRET',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(3000);
}

bootstrap();

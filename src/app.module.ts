import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserSchema } from './user/dto/user.schema';

const ENV = process.env.NODE_ENV;

console.log("env", ENV)

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [ENV ? `.env.${ENV}` : '.env.production'],
    }),    
    UserModule, 
    AuthModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb://${configService.get('MONGODB_URL')}:${configService.get('MONGODB_PORT')}/user?directConnection=true`,
      }),

      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
    ]),    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

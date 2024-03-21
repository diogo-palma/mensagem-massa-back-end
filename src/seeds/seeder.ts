import { seeder } from "nestjs-seeder";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersSeeder } from "./users.seeder";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserSchema } from "../user/dto/user.schema";


const ENV = process.env.NODE_ENV;
console.log("env", ENV)

seeder({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [ENV ? `.env.${ENV}` : '.env.production'],
    }),
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
}).run([UsersSeeder]);
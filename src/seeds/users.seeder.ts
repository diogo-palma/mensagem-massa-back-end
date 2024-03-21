import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Seeder, DataFactory } from "nestjs-seeder";
import { User } from "src/user/dto/user.schema";
import * as bcrypt from 'bcrypt';



@Injectable()
export class UsersSeeder implements Seeder {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>
  ) {}

  async seed(): Promise<any> {   
    const hashedPassword = await bcrypt.hash("123456", 10); 
    const hashedPassword2 = await bcrypt.hash("123456", 10); 
    const users = [
      { name: 'Admin', email: 'admin@admin.com', password: hashedPassword, role: "admin" },
      { name: 'Teste', email: 'teste@teste.com',  password: hashedPassword2, role: "user" },      
    ];

    return this.userModel.insertMany(users);
  }

  async drop(): Promise<any> {
    return this.userModel.deleteMany({});
  }
}
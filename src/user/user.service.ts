import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    try {

      const user = await this.userModel.find()
      if(user.length > 0){
        const userWithId = user.map(user => {
          const userWithId = user.toObject();
          userWithId.id = userWithId._id.toString();
          delete userWithId._id;
          delete userWithId.password;
          return userWithId;
        });

        return userWithId;
      }
      throw new HttpException(`Don't have users`, HttpStatus.CONFLICT);
    } catch (error) {
      throw new HttpException(`Error while fetching users: ${error.message}`, HttpStatus.CONFLICT);
    }
  }

  async findOne(query: any): Promise<User> {
    try {
      const user = await this.userModel.findOne(query)

      if (user) {
        const userWithId = user.toObject();
        userWithId.id = userWithId._id.toString();
        delete userWithId._id;

        return userWithId;
      }

      throw new HttpException(`User not find`, HttpStatus.NOT_FOUND);
    } catch (error) {
      throw new HttpException(`Error while fetching user: ${error.message}`, HttpStatus.FORBIDDEN);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }
  

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
  }

  async remove(id: string): Promise<void> {
    await this.userModel.findOneAndDelete({ _id: id }).exec();
  }

  async roles(userId: string, roles: string[]): Promise<void> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new Error('User not found');
    }
    user.roles = roles;
    await user.save();
  }

  async activate(userId: string): Promise<void> {
    await this.changeUserStatus(userId, "ACTIVE");
  }

  async inactivate(userId: string): Promise<void> {
    await this.changeUserStatus(userId, "INACTIVATE");
  }

  async newTokenPassword(email: string): Promise<any> {
    // Lógica para gerar um novo token de senha para um usuário
  }

  async updatePassword(token: string, password: string): Promise<void> {
    // Lógica para atualizar a senha de um usuário com base em um token
  }

  private async changeUserStatus(userId: string, active: "ACTIVE" | "INACTIVATE"): Promise<void> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new Error('User not found');
    }
    user.active = active;
    await user.save();
  }
}

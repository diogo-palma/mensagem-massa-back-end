import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';

@Injectable()
@Injectable()
export class AuthService {
  constructor(    
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  async find(userId: string): Promise<User | null> {
    return this.userService.findOne(userId);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (user) {
      if (user.active == "INACTIVATE") {
        throw new Error('Usuário inativo');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        return user
      }
    }

    return null;
  }

  async login(data: any): Promise<any> {
    try {
      const { email, password } = data;
      const user = await this.validateUser(email, password);

      if (user) {
        const payload = { sub: user.id, userName: user.name, userEmail: user.email, roles: user.roles };
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          roles: user.roles,
          access_token: this.jwtService.sign(payload),
        };
      }
      throw new Error('Erro ao fazer o login');

    } catch (error) {
      throw new Error('Erro ao fazer o login: ' + error);
    }
  }
}
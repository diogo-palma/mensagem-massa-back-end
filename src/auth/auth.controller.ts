import { Controller, Param } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async find(@Param('id') id: string) {
    // return this.authService.find(id);
  }

  async findAccount(@Param() data: any): Promise<any> {
    return this.authService.login(data);
  }
}

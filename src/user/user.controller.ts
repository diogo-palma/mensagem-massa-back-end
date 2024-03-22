import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.middleware';
import { Roles } from 'src/utils/roles.decorator';
import { RolesGuard } from 'src/auth/roles.middleware';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne({_id: id});
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Post('roles')
  async roles(@Body() data: any): Promise<void> {
    console.log(`Roles User: ${JSON.stringify(data)}`);
    await this.userService.roles(data.id, data.roles);
  }

  @Post('activate')
  async activate(@Body() data: any): Promise<void> {
    console.log(`Activate User: ${JSON.stringify(data)}`);
    await this.userService.activate(data.id);
  }

  @Post('inactivate')
  async inactivate(@Body() data: any): Promise<void> {
    console.log(`Inactivate User: ${JSON.stringify(data)}`);
    await this.userService.inactivate(data.id);
  }

  @Post('new-token')
  async newTokenPassword(@Body() data: any) {
    return this.userService.newTokenPassword(data.email);
  }

  @Patch('update-password')
  async updatePassword(@Body() data: any) {
    return this.userService.updatePassword(data.token, data.password);
  }

}

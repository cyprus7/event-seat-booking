import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'User email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'User name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'User password', minLength: 6 })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

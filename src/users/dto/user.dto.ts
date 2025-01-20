// src/users/dto/user.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;
}

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  createdAt: Date;
}

export class LoginDto {
    @ApiProperty({ 
      example: 'eric.test@codeafrica.com',
      description: 'User email address' 
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @ApiProperty({ 
      example: 'Test@123',
      description: 'User password' 
    })
    @IsString()
    @IsNotEmpty()
    password: string;
  }
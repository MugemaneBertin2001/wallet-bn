import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  UseInterceptors, 
  ClassSerializerInterceptor,
  HttpException,
  HttpStatus 
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, LoginDto, UserResponseDto } from './dto/user.dto';
import { ResponseHelper } from '../common/helpers/response.helper';
import { ApiCustomResponse } from '../common/decorators/api-response.decorator';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from './dto/login-response.dto';

@ApiTags('Users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService,
  private readonly jwtService: JwtService
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiCustomResponse({
    status: 201,
    description: 'User registered successfully',
    type: UserResponseDto,
  })
  async register(@Body() createUserDto: CreateUserDto) {
    // Check if user exists
    const existingUser = await this.usersService.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new HttpException('Email already registered', HttpStatus.BAD_REQUEST);
    }

    const user = await this.usersService.create(createUserDto);
    const { password, ...userWithoutPassword } = user;

    return ResponseHelper.success(userWithoutPassword, 'User registered successfully');
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiCustomResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseDto, 
  })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  
    const isPasswordValid = await this.usersService.validatePassword(
      loginDto.password,
      user.password
    );
  
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  
    // Generate JWT token
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email
    });
  
    const { password, ...userWithoutPassword } = user;
  
    return ResponseHelper.success({
      user: userWithoutPassword,
      accessToken: token
    }, 'Login successful');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiCustomResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: UserResponseDto,
  })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    const { password, ...userWithoutPassword } = user;
    return ResponseHelper.success(userWithoutPassword, 'User retrieved successfully');
  }
}
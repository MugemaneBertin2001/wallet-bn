import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class LoginResponseDto {
  @ApiProperty({
    example: {
      id: "uuid",
      email: "eric.test@codeafrica.com",
      firstName: "Eric",
      lastName: "Developer",
      createdAt: "2025-01-18T...",
      updatedAt: "2025-01-18T..."
    }
  })
  user: Omit<User, 'password'>;

  @ApiProperty({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    description: "JWT access token"
  })
  accessToken: string;
}
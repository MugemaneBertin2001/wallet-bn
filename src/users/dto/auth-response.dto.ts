export class AuthResponseDto {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    };
    accessToken: string;
  }
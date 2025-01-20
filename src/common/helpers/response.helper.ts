export class ResponseHelper {
    static success<T>(data: T, message: string = 'Success') {
      return {
        success: true,
        message,
        data,
      };
    }
  
    static error(message: string, statusCode: number = 400) {
      return {
        success: false,
        message,
        statusCode,
      };
    }
  }
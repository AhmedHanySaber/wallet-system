import { Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    @Post('register')
    RegisterUser() {

    }
    @Post('login')
    Login() {

    }
    @Post('verfiy-otp')
    VerfiyOTP() {

    }
}

import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() : '',
  )
  email: string;

  @IsString()
  @MinLength(5)
  @MaxLength(36)
  password: string;
}

export default LoginDto;

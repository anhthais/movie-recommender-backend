import { Transform } from 'class-transformer';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(5)
  @MaxLength(40)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : ''))
  username: string;

  @IsEmail()
  @Transform(({ value }) => (typeof value === 'string' ? value.toLowerCase() : ''))
  email: string;

  @IsString()
  @MinLength(5)
  @MaxLength(36)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;

  @IsString()
  @MinLength(1)
  @MaxLength(40)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : ''))
  fullname: string;
}

export default CreateUserDto;

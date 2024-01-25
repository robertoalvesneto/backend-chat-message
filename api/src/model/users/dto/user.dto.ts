import { ValidateRegex } from 'src/common/decorator/regex.validator.decorator';
import { Regex } from 'src/common/constant/regex.constant';
import { IsOptional, IsString } from 'class-validator';

export class UserDto {
  @IsOptional()
  id: string;

  @IsString()
  name: string;

  @ValidateRegex(Regex.PASSWORD)
  password?: string;
}

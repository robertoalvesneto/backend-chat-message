import { ValidateRegex } from 'src/common/decorator/regex.validator.decorator';
import { Regex } from 'src/common/constant/regex.constant';
import { IsOptional } from 'class-validator';

export class UserDto {
  @IsOptional()
  id: string;

  @ValidateRegex(Regex.PASSWORD)
  password?: string;
}

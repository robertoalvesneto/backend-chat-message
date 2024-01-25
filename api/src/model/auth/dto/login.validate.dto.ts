// decorator and validation
import { ValidateRegex } from '../../../common/decorator/regex.validator.decorator';
import { Regex } from '../../../common/constant/regex.constant';
import { IsUUID } from 'class-validator';

export class LoginValidateDto {
  @IsUUID(4, { each: true })
  id: string;

  @ValidateRegex(Regex.PASSWORD)
  password: string;
}

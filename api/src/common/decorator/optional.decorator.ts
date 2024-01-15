import { applyDecorators } from '@nestjs/common/decorators';
import { IsNotEmpty, ValidateIf, ValidationOptions } from 'class-validator';

/**
 * Custom decorator used to validate optional properties.
 *
 * It requires defined properties to be NonNull, and does not apply validation for undefined values.
 * @param {ValidationOptions} validationOptions (optional) Additional validation options.
 * @param {boolean} nullable (optional) checks if field accepts null values.
 */
export const IsOptional = (
  validationOptions?: ValidationOptions,
  nullable?: boolean,
): PropertyDecorator => {
  return applyDecorators(
    ValidateIf(
      (_obj, value) =>
        nullable
          ? isNotUndefined(value)
          : isNotUndefined(value) && isNotNull(value),
      validationOptions,
    ),
    IsNotEmpty(validationOptions),
  );
};

function isNotUndefined(value: any): boolean {
  return value !== undefined;
}

function isNotNull(value: any): boolean {
  return value !== null;
}

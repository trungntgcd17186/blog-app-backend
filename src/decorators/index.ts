import { Expose } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

function isValidDate(date: Date, originalValue: string): boolean {
  return (
    !isNaN(date.getTime()) && date.toISOString().slice(0, 10) === originalValue
  );
}

@ValidatorConstraint({ name: 'customDate', async: false })
export class CustomDateConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    if (typeof value !== 'string') {
      return false;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(value)) {
      return false;
    }

    const date = new Date(value);
    const month = date.getMonth() + 1;

    return (
      isValidDate(date, value) &&
      date.getDate() <= new Date(date.getFullYear(), month, 0).getDate()
    );
  }

  defaultMessage() {
    return 'Invalid or malformed date "YYYY-MM-DD"';
  }
}

export function IsCustomDateString(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isCustomDateString',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: CustomDateConstraint,
    });
  };
}

export function MinDateDynamic(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'minDateDynamic',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: any) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          const startDate = new Date(value);
          const endDate = new Date(relatedValue);

          if (
            isNaN(startDate.getTime()) ||
            isNaN(endDate.getTime()) ||
            startDate > endDate
          ) {
            return false;
          }

          return true;
        },
      },
    });
  };
}

export function DateFieldValidationDecorator(
  useNotEmpty?: boolean,
): PropertyDecorator {
  const additionalDecorators = useNotEmpty
    ? [
        IsCustomDateString(),
        Expose(),
        MinDateDynamic('endDate', {
          message: 'startDate cannot be greater than endDate',
        }),
      ]
    : [];

  return (target: any, key: string) => {
    if (useNotEmpty) {
      IsNotEmpty()(target, key);
    } else {
      IsOptional()(target, key);
    }

    for (const decorator of additionalDecorators) {
      decorator(target, key);
    }
  };
}

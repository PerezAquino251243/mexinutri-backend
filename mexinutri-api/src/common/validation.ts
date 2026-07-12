import { validate, type ValidationError } from 'class-validator';
import { plainToInstance, type ClassConstructor } from 'class-transformer';
import 'reflect-metadata';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export async function validateDto<T extends object>(
  dtoClass: ClassConstructor<T>,
  plain: Record<string, unknown>,
): Promise<ValidationResult> {
  const instance = plainToInstance(dtoClass, plain);
  const errors: ValidationError[] = await validate(instance);

  if (errors.length === 0) {
    return { valid: true, errors: [] };
  }

  const messages = flattenValidationErrors(errors);

  return { valid: false, errors: messages };
}

function flattenValidationErrors(errors: ValidationError[], parentPath = ''): string[] {
  const messages: string[] = [];

  for (const error of errors) {
    const propertyPath = parentPath ? `${parentPath}.${error.property}` : error.property;

    if (error.constraints) {
      for (const constraint of Object.values(error.constraints)) {
        messages.push(`${propertyPath}: ${constraint}`);
      }
    }

    if (error.children && error.children.length > 0) {
      messages.push(...flattenValidationErrors(error.children, propertyPath));
    }
  }

  return messages;
}
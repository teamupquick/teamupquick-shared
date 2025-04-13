import { useState, useCallback } from "react";
import * as yup from "yup";

interface UseFormValidationProps<T extends object, V extends yup.AnySchema> {
  schema: V;
  initialValues: T;
  onSuccess?: (validatedData: T) => void;
  validationContext?: object;
}

export function useFormValidation<T extends object, V extends yup.AnySchema>({
  schema,
  initialValues,
  onSuccess,
  validationContext,
}: UseFormValidationProps<T, V>) {
  const [formData, setFormData] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = useCallback(
    async (data: T) => {
      try {
        const validatedData = await schema.validate(data, {
          abortEarly: false,
          context: validationContext,
        });
        setErrors({});
        onSuccess?.(validatedData as T);
        return true;
      } catch (error) {
        if (error instanceof yup.ValidationError) {
          const errorMap = error.inner.reduce(
            (acc, err) => {
              if (err.path) {
                acc[err.path] = err.message;
              }
              return acc;
            },
            {} as Record<string, string>,
          );
          setErrors(errorMap);
        }
        return false;
      }
    },
    [schema, onSuccess, validationContext],
  );

  const updateFormData = useCallback((updates: Partial<T>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialValues);
    setErrors({});
  }, [initialValues]);

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    validateForm,
    updateFormData,
    resetForm,
  };
}

// 計算表單完成率的通用函數
export function useFormCompletionRate(
  fields: (string | null | undefined)[],
  requiredFieldCount?: number,
) {
  const calculateCompletionRate = useCallback(() => {
    let completedCount = 0;

    fields.forEach((field) => {
      if (field) completedCount += 1;
    });

    const totalFields = requiredFieldCount || fields.length;
    return Math.floor((completedCount / totalFields) * 10) * 10;
  }, [fields, requiredFieldCount]);

  return calculateCompletionRate;
}

// 處理冗餘的雙重否定
export function ensure<T>(value: T | null | undefined, fallback: T): T {
  return value ?? fallback;
}

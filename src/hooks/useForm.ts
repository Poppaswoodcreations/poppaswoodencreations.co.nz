import { useState, useCallback } from 'react';
import { FormData, FormErrors, FormState } from '../types/forms';

interface UseFormOptions {
  initialData?: FormData;
  validate?: (data: FormData) => FormErrors;
  onSubmit?: (data: FormData) => Promise<void> | void;
}

export const useForm = (options: UseFormOptions = {}) => {
  const [state, setState] = useState<FormState>({
    data: options.initialData || {},
    errors: {},
    isSubmitting: false,
    isValid: true,
    touched: {}
  });

  const setField = useCallback((name: string, value: any) => {
    setState(prev => ({
      ...prev,
      data: { ...prev.data, [name]: value },
      touched: { ...prev.touched, [name]: true }
    }));
  }, []);

  const setError = useCallback((name: string, error: string) => {
    setState(prev => ({
      ...prev,
      errors: { ...prev.errors, [name]: error }
    }));
  }, []);

  const clearError = useCallback((name: string) => {
    setState(prev => ({
      ...prev,
      errors: { ...prev.errors, [name]: '' }
    }));
  }, []);

  const validate = useCallback(() => {
    if (!options.validate) return true;

    const errors = options.validate(state.data);
    const isValid = Object.keys(errors).length === 0;

    setState(prev => ({
      ...prev,
      errors,
      isValid
    }));

    return isValid;
  }, [state.data, options.validate]);

  const reset = useCallback(() => {
    setState({
      data: options.initialData || {},
      errors: {},
      isSubmitting: false,
      isValid: true,
      touched: {}
    });
  }, [options.initialData]);

  const submit = useCallback(async () => {
    if (!options.onSubmit) return;

    setState(prev => ({ ...prev, isSubmitting: true }));

    try {
      if (validate()) {
        await options.onSubmit(state.data);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [state.data, options.onSubmit, validate]);

  return {
    ...state,
    setField,
    setError,
    clearError,
    validate,
    reset,
    submit
  };
};
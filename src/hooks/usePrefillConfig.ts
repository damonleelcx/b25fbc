"use client";

import { useCallback, useState } from 'react';
import { PrefillConfig, PrefillConfigMap } from '../lib/types';

export function usePrefillConfig() {
  const [prefillConfigs, setPrefillConfigs] = useState<PrefillConfigMap>({});

  const setPrefillForField = useCallback((
    formId: string, 
    fieldId: string, 
    config: PrefillConfig | null
  ) => {
    setPrefillConfigs(prev => {
      const formConfig = prev[formId] || {};
      
      return {
        ...prev,
        [formId]: {
          ...formConfig,
          [fieldId]: config
        }
      };
    });
  }, []);

  const clearPrefillForField = useCallback((formId: string, fieldId: string) => {
    setPrefillConfigs(prev => {
      const formConfig = {...(prev[formId] || {})};
      
      if (formConfig[fieldId]) {
        delete formConfig[fieldId];
      }
      
      return {
        ...prev,
        [formId]: formConfig
      };
    });
  }, []);

  const getFormPrefillConfig = useCallback((formId: string) => {
    return prefillConfigs[formId] || {};
  }, [prefillConfigs]);

  return {
    prefillConfigs,
    setPrefillForField,
    clearPrefillForField,
    getFormPrefillConfig
  };
}
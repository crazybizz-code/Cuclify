import type { HomeSectionType, StoreConfig, StoreConfigMutation } from '@/types';

export interface StoreMutationPlan {
  prompt: string;
  mutations: StoreConfigMutation[];
  summary: string[];
}

import type { StoreConfig, StoreConfigMutation } from '@/types';

export interface StoreMutationPlan {
  prompt: string;
  mutations: StoreConfigMutation[];
  summary: string[];
}

export async function planStoreConfigMutations(
  prompt: string,
  config: StoreConfig
): Promise<StoreMutationPlan> {
  const response = await fetch('/api/ai/mutate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, config }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Failed to generate store mutations from AI');
  }

  const data = await response.json();
  
  if (!data.ok || !data.plan) {
    throw new Error('Invalid response from AI planner');
  }

  return data.plan as StoreMutationPlan;
}


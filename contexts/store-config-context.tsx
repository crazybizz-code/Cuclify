'use client';

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { loadStoreConfig } from '@/lib/load-store-config';
import {
  applyStoreConfigMutations,
  validateStoreConfigMutations,
} from '@/lib/store-config-mutations';
import { syncStorePreviewDocument } from '@/lib/store-preview-dom';
import type { StoreConfigInput } from '@/config/store-config.schema';
import type {
  ProjectMutationRecord,
  ProjectStoreSnapshot,
  StoreConfig,
  StoreConfigMutation,
} from '@/types';

interface StoreConfigContextValue {
  config: StoreConfig;
  sourceConfig: StoreConfigInput;
  mutationHistory: ProjectMutationRecord[];
  mutationError: string | null;
  lastPrompt: string | null;
  applyMutations: (mutations: StoreConfigMutation[], prompt?: string) => void;
  applyPromptResult: (payload: {
    prompt: string;
    mutations: StoreConfigMutation[];
  }) => void;
  resetStore: () => void;
}

const StoreConfigContext = createContext<StoreConfigContextValue | undefined>(
  undefined
);

function extractSourceConfig(config: StoreConfig): StoreConfigInput {
  return {
    brand: config.brand,
    seo: config.seo,
    theme: config.theme,
    navigation: config.navigation,
    commerce: config.commerce,
    catalog: config.catalog,
    pages: config.pages,
    footer: config.footer,
  };
}

export function StoreConfigProvider({
  children,
  initialConfig,
  projectId,
  initialProjectSnapshot,
}: {
  children: ReactNode;
  initialConfig: StoreConfig;
  projectId?: string;
  initialProjectSnapshot?: ProjectStoreSnapshot;
}) {
  const initialSourceConfig = useMemo(() => {
    if (initialProjectSnapshot) {
      return initialProjectSnapshot.config;
    }

    return extractSourceConfig(initialConfig);
  }, [initialConfig, initialProjectSnapshot]);
  const initialHistory = useMemo(
    () => initialProjectSnapshot?.mutationHistory ?? [],
    [initialProjectSnapshot]
  );
  const [sourceConfig, setSourceConfig] = useState<StoreConfigInput>(
    initialSourceConfig
  );
  const [mutationHistory, setMutationHistory] = useState<ProjectMutationRecord[]>(
    initialHistory
  );
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string | null>(
    initialHistory.at(-1)?.prompt ?? null
  );
  const sourceConfigRef = useRef(sourceConfig);
  const mutationHistoryRef = useRef(mutationHistory);

  useEffect(() => {
    sourceConfigRef.current = sourceConfig;
  }, [sourceConfig]);

  useEffect(() => {
    mutationHistoryRef.current = mutationHistory;
  }, [mutationHistory]);

  const config = useMemo(() => loadStoreConfig(sourceConfig), [sourceConfig]);

  useEffect(() => {
    syncStorePreviewDocument(config);
  }, [config]);

  async function persistProjectSnapshot(
    nextSourceConfig: StoreConfigInput,
    nextHistory: ProjectMutationRecord[],
    prompt?: string
  ) {
    if (!projectId) {
      return;
    }

    const snapshot: ProjectStoreSnapshot = {
      config: nextSourceConfig,
      mutationHistory: nextHistory,
      savedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storeConfig: snapshot,
        }),
      });

      if (!response.ok) {
        throw new Error('Autosave request failed');
      }
    } catch {
      if (prompt) {
        setMutationError('Store updated locally, but autosave could not reach the database.');
      }
    }
  }

  function applyMutations(mutations: StoreConfigMutation[], prompt?: string) {
    try {
      const parsedMutations = validateStoreConfigMutations(mutations);
      const nextSourceConfig = applyStoreConfigMutations(
        sourceConfigRef.current,
        parsedMutations
      );
      const nextHistory = prompt
        ? [
            ...mutationHistoryRef.current,
            {
              prompt,
              mutations: parsedMutations,
              appliedAt: new Date().toISOString(),
            },
          ]
        : mutationHistoryRef.current;
      sourceConfigRef.current = nextSourceConfig;
      mutationHistoryRef.current = nextHistory;

      startTransition(() => {
        setSourceConfig(nextSourceConfig);
        setMutationHistory(nextHistory);
        setMutationError(null);
        if (prompt) {
          setLastPrompt(prompt);
        }
      });

      void persistProjectSnapshot(nextSourceConfig, nextHistory, prompt);
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : 'Store mutation failed');
    }
  }

  function applyPromptResult(payload: {
    prompt: string;
    mutations: StoreConfigMutation[];
  }) {
    applyMutations(payload.mutations, payload.prompt);
  }

  function resetStore() {
    sourceConfigRef.current = initialSourceConfig;
    mutationHistoryRef.current = initialHistory;
    startTransition(() => {
      setSourceConfig(initialSourceConfig);
      setMutationHistory(initialHistory);
      setMutationError(null);
      setLastPrompt(initialHistory.at(-1)?.prompt ?? null);
    });

    void persistProjectSnapshot(initialSourceConfig, initialHistory);
  }

  return (
    <StoreConfigContext.Provider
      value={{
        config,
        sourceConfig,
        mutationHistory,
        mutationError,
        lastPrompt,
        applyMutations,
        applyPromptResult,
        resetStore,
      }}
    >
      {children}
    </StoreConfigContext.Provider>
  );
}

export function useStoreConfig() {
  const context = useContext(StoreConfigContext);

  if (!context) {
    throw new Error('useStoreConfig must be used within a StoreConfigProvider');
  }

  return context;
}

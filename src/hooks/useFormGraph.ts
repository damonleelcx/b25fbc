"use client";

import { useEffect, useState } from 'react';
import { BlueprintGraph } from '../lib/types';

export function useFormGraph() {
  const [graph, setGraph] = useState<BlueprintGraph | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/blueprint');
        
        if (!response.ok) {
          throw new Error('Failed to fetch blueprint data');
        }
        
        const { data } = await response.json();
        setGraph(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching graph data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchGraph();
  }, []);

  return { graph, loading, error };
}
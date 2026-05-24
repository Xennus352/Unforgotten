import {
  fetchMilestones,
  fetchRelationshipStart,
  insertMilestone,
  saveRelationshipStart,
  type NewMilestone,
} from "@/lib/db/milestones";
import type { Milestone } from "@/types/milestone";
import { useCallback, useEffect, useState } from "react";

async function loadInitialData() {
  const [items, start] = await Promise.all([
    fetchMilestones(),
    fetchRelationshipStart(),
  ]);
  return { items, start };
}

export function useMilestones() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [relationshipStart, setRelationshipStart] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData().then(({ items, start }) => {
      setMilestones(items);
      setRelationshipStart(start);
      setLoading(false);
    });
  }, []);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [items, start] = await Promise.all([
        fetchMilestones(),
        fetchRelationshipStart(),
      ]);
      setMilestones(items);
      setRelationshipStart(start);
    } finally {
      setLoading(false);
    }
  }, []);

  const addMilestone = useCallback(
    async (input: NewMilestone) => {
      const created = await insertMilestone(input);
      await reload();
      return created;
    },
    [reload],
  );

  const setAnniversary = useCallback(
    async (isoDate: string) => {
      await saveRelationshipStart(isoDate);
      await reload();
    },
    [reload],
  );

  return {
    milestones,
    relationshipStart,
    loading,
    reload,
    addMilestone,
    setAnniversary,
  };
}

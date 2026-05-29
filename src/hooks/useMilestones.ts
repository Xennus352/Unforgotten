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
    let isMounted = true;

    loadInitialData().then(({ items, start }) => {
      if (!isMounted) return;
      setMilestones(items);
      setRelationshipStart(start);
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
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

  const addMilestone = useCallback(async (input: NewMilestone) => {
    // 1. Write to DB and get the created item with its new ID
    const created = await insertMilestone(input);

    // 2. Update local state immediately without triggering a global loading spinner
    setMilestones((prev) => {
      const updated = [...prev, created];
      // Keep it sorted by date ASC just like your SQL query does
      return updated.sort((a, b) => a.date.localeCompare(b.date));
    });

    return created;
  }, []);

  const setAnniversary = useCallback(async (isoDate: string) => {
    await saveRelationshipStart(isoDate);
    setRelationshipStart(isoDate); // Update locally, skip the reload spinner!
  }, []);

  return {
    milestones,
    relationshipStart,
    loading,
    reload,
    addMilestone,
    setAnniversary,
  };
}

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchOrphanReceives } from "../../Supabase/OrphanReceives/fetchOrphanReceives";
import { supabase } from "../../Supabase/supabase";

const WATCHED_TABLES = [
  "orphan",
  "sponsor",
  "sponsor_payment",
  "orphanage_funds",
] as const;

export function useGetOrphanReceives() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase().channel("orphan-receives-realtime");

    WATCHED_TABLES.forEach((table) => {
      channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => queryClient.invalidateQueries({ queryKey: ["orphanReceives"] }),
      );
    });

    channel.subscribe();
    return () => {
      supabase().removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["orphanReceives"],
    queryFn: fetchOrphanReceives,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: 10000,
  });
}

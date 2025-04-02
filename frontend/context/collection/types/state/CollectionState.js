import { z } from 'zod';
import { LabelSchema } from "@/types/label/label";

export const CollectionStateSchema = z.object({
  id: z.number(),
  name: z.string(),
  labels: z.array(LabelSchema),
  viewingName: z.string(),
  viewingWordIdx: z.number(),
  searchQuery: z.string().nullable(),
  error: z.string().nullable(),
});
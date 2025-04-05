// ✅ label.js
import { z } from 'zod';

export const LabelSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const LabelsSchema =  z.record(LabelSchema);

/**
 * @typedef {z.infer<typeof LabelSchema>} Label
 */

/**
 * @typedef {z.infer<typeof LabelsSchema>} Labels
 */
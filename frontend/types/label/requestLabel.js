
// ✅ label.js
import { z } from 'zod';

export const RequestLabelSchema = z.object({
  name: z.string(),
});

/**
 * @typedef {z.infer<typeof LabelSchema>} RequestLabel
 */

import { z } from 'zod';

export const RequestWordSchema = z.object({
  name:z.string(),
  description:z.string(),
  imagePath:z.string()
});
import { z } from 'zod';
const { PrivateWordSchema } = require("./privateWord");

export const ResponsePrivateWordSchema = PrivateWordSchema.extend({
  label_ids: z.array(z.number())
});

export const ResponsePrivateWordsSchema = z.array(ResponsePrivateWordSchema);
import { FormRule } from "antd";
import { z } from "zod";

export const useZodValidation = <T>(schema: z.ZodObject<any, any, any, T>): [FormRule] => {
  const rule: FormRule = {
    async validator({ field }: any, value: undefined | null | number | string | boolean) {
      const result = await schema.safeParseAsync({
        [field]: value,
      });
      if (result.success) return;
      const issues = result.error.issues.filter((x) => x.path[0] == field);
      const message = issues[0]?.message;
      if (message) throw new Error(message);
    },
  };
  return [rule];
};

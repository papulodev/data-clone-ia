import { z } from "zod"
import type { Resolver } from "react-hook-form"

export function createZodResolver<T extends z.ZodType<any, any>>(
  schema: T,
): Resolver<z.infer<T>> {
  return async (values) => {
    try {
      const parsed = schema.parse(values)
      return {
        values: parsed,
        errors: {},
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, { type: string; message: string }> = {}
        
        for (const issue of error.issues) {
          const path = issue.path.join(".")
          if (path && !errors[path]) {
            errors[path] = {
              type: issue.code,
              message: issue.message,
            }
          }
        }
        
        return {
          values: {},
          errors: errors as never,
        }
      }
      
      return {
        values: {},
        errors: {},
      }
    }
  }
}

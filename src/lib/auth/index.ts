import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { username } from "better-auth/plugins";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),
  plugins: [username()],
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
  user: {
    additionalFields: {
      verified: {
        type: "boolean",
        default: false,
        description: "Whether the user has verified their account",
        input: false,
      },
      bio: {
        type: "string",
        description: "A short biography of the user",
        returned: true,
        input: true,
        required: false,
      },
    },
  },
});

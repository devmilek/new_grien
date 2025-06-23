import { cache } from "react";
import { auth } from ".";
import { headers } from "next/headers";

export const getCurrentSession = cache(async () => {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (!data) {
    return {
      user: null,
      session: null,
    };
  }

  return {
    user: data.user,
    session: data.session,
  };
});

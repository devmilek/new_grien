import { getCurrentSession } from "@/lib/auth/get-current-session";
import { AccountSettingsView } from "@/modules/account/ui/views/account-settings-view";
import { redirect } from "next/navigation";
import React from "react";

const SettingsPage = async () => {
  const { user } = await getCurrentSession();

  if (!user) {
    return redirect("/logowanie");
  }

  return (
    <div className="container">
      <AccountSettingsView />
    </div>
  );
};

export default SettingsPage;

"use client";

import { Button } from "components/global";
import { useState } from "react";
import { logout } from "./action";

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Button
      onClick={async () => {
        setIsLoading(true);
        await logout().then(() => {
          setIsLoading(false);
        });
      }}
      isArrow={false}
      className={"my-[20px]"}
      text="Sign out"
      loading={isLoading}
      type={"submit"}
    />
  );
}

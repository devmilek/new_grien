interface Props {
  title: string;
  description: string;
  children?: ReactNode;
}

import Image from "next/image";
import React, { ReactNode } from "react";

export const EmptyState = ({ description, title, children }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Image src="/empty.svg" alt="empty" width={240} height={240} />
      <div className="flex flex-col gap-y-3 max-w-md mx-auto text-center">
        <h6 className="text-lg font-semibold">{title}</h6>
        <p className="text-sm text-muted-foreground">{description}</p>
        {children}
      </div>
    </div>
  );
};

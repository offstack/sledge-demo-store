"use client";

import { GenericError } from "components/layout/generic-error";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html className="h-full">
      <body className="bg-dark h-full">
        <div className="min-h-screen h-full lg:h-fit">
          <GenericError error={error instanceof Error ? error : undefined} />
        </div>
      </body>
    </html>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function RedirectToFirstvariant({ product }: any) {
  const { push } = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(
      new URL(window.location.href).search
    );

    const pathName = new URL(window.location.href).pathname;
    const firstVariant = product.variants[0];

    if (!Number(searchParams.size)) {
      for (const option of firstVariant.selectedOptions) {
        searchParams.set(option.name.toLowerCase(), option.value);
      }

      push(`${pathName}?${searchParams.toString()}`);
    }
  }, []);

  return null;
}

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckIcon, CopyIcon } from "@/components/ui/icons";

/** Copies a value to the clipboard with an announced confirmation. */
export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  return (
    <Button
      variant="secondary"
      size="lg"
      magnetic
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
        } catch {
          // Clipboard unavailable (permissions/insecure context): the mailto
          // link and visible address remain.
        }
      }}
    >
      {copied ? <CheckIcon className="text-positive" /> : <CopyIcon />}
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </Button>
  );
}

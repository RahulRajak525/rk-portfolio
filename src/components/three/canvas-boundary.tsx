"use client";

import { Component, type ReactNode } from "react";

/**
 * WebGL can fail at runtime even after feature detection (driver blocklist,
 * context loss, shader compile errors). R3F rethrows those errors, so this
 * boundary contains them: the 3D layer disappears, the static poster behind
 * it stays, and the rest of the page is unaffected.
 */
export class CanvasBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { failed: boolean }
> {
  override state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  override componentDidCatch(error: unknown) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[3D] Falling back to the static poster:", error);
    }
  }

  override render() {
    return this.state.failed
      ? (this.props.fallback ?? null)
      : this.props.children;
  }
}

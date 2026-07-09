"use client";

import { useState } from "react";

interface BuildDetailProps {
  id: string;
  detail: string;
}

export default function BuildDetail({ id, detail }: BuildDetailProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="build-detail-wrap">
      <button
        type="button"
        className="build-detail-toggle"
        aria-expanded={isExpanded}
        aria-controls={id}
        onClick={() => setIsExpanded((expanded) => !expanded)}
      >
        details
      </button>
      <div
        id={id}
        className="build-detail"
        role="region"
        hidden={!isExpanded}
      >
        {detail}
      </div>
    </div>
  );
}

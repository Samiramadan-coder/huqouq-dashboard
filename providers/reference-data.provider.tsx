"use client";

import { ReferenceData } from "@/types/reference-data";
import { createContext, useContext, useState, type ReactNode } from "react";

type ReferenceDataContext = {
  referenceData: ReferenceData | null;
};

const ReferenceDataContext = createContext<ReferenceDataContext | null>(null);

export function ReferenceDataProvider({
  initialReferenceData,
  children,
}: {
  initialReferenceData: ReferenceData | null;
  children: ReactNode;
}) {
  const [referenceData] = useState<ReferenceData | null>(initialReferenceData);

  return (
    <ReferenceDataContext.Provider value={{ referenceData }}>
      {children}
    </ReferenceDataContext.Provider>
  );
}

export function useReferenceData() {
  const context = useContext(ReferenceDataContext);

  if (!context) {
    throw new Error(
      "useReferenceData must be used within ReferenceDataProvider",
    );
  }

  return context;
}

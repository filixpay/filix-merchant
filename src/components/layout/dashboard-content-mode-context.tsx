"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { DashboardContentMode } from "./dashboard-content-mode";

type DashboardContentModeContextValue = {
    overrideMode: DashboardContentMode | null;
    setOverrideMode: (mode: DashboardContentMode | null) => void;
};

const DashboardContentModeContext = createContext<DashboardContentModeContextValue | null>(null);

export function DashboardContentModeProvider({ children }: { children: React.ReactNode }) {
    const [overrideMode, setOverrideModeState] = useState<DashboardContentMode | null>(null);

    const setOverrideMode = useCallback((mode: DashboardContentMode | null) => {
        setOverrideModeState(mode);
    }, []);

    const contextValue = useMemo(
        () => ({ overrideMode, setOverrideMode }),
        [overrideMode, setOverrideMode],
    );

    return (
        <DashboardContentModeContext.Provider value={contextValue}>
            {children}
        </DashboardContentModeContext.Provider>
    );
}

export function useDashboardContentMode() {
    const context = useContext(DashboardContentModeContext);
    if (!context) {
        throw new Error("useDashboardContentMode must be used within DashboardContentModeProvider");
    }
    return context;
}

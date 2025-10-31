import type { DataStore } from "@/app/form/_utils/dataStore";
import { sendGAEvent } from "@next/third-parties/google";
import { createContext, useContext, useEffect, useState } from "react";

export const DataStoreContext = createContext<DataStore>({});
export const UpdateDataStoreContext = createContext<(dataUpdates: DataStore) => void>(() => {});

export const DataStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [dataStore, setDataStore] = useState<DataStore>({});
  const updateDataStore = (dataUpdates: { [key: string]: string }) => {
    setDataStore({ ...dataStore, ...dataUpdates });
  };

  const hasData = Object.keys(dataStore).length > 0;
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasData) {
        event.preventDefault();
        event.returnValue = true; // Legacy browser support, e.g. Chrome/Edge < 119
        sendGAEvent("event", "leavePageConfirmationShown");
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasData]);

  return (
    <DataStoreContext value={dataStore}>
      <UpdateDataStoreContext value={updateDataStore}>{children}</UpdateDataStoreContext>
    </DataStoreContext>
  );
};

export const useDataStore = () => {
  return {
    dataStore: useContext(DataStoreContext),
    updateDataStore: useContext(UpdateDataStoreContext),
  };
};

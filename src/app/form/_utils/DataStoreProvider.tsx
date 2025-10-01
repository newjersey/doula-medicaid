import type { DataStore } from "@/app/form/_utils/dataStore";
import { createContext, useContext, useState } from "react";

export const DataStoreContext = createContext<DataStore>({});
export const UpdateDataStoreContext = createContext<(dataUpdates: DataStore) => void>(() => {});

export const DataStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [dataStore, setDataStore] = useState<DataStore>({});
  const updateDataStore = (dataUpdates: { [key: string]: string }) => {
    setDataStore({ ...dataStore, ...dataUpdates });
  };

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

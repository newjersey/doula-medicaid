import { type DataStore } from "@/app/form/_utils/dataStore";
import { DataStoreContext, UpdateDataStoreContext } from "@/app/form/_utils/DataStoreProvider";
import { render } from "@testing-library/react";
import {
  AppRouterContext,
  type AppRouterInstance,
} from "next/dist/shared/lib/app-router-context.shared-runtime";
import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { MemoryRouter } from "react-router";

export const renderWithProviders = (
  children: React.ReactNode,
  pathname: string,
  dataStore: DataStore = {},
) => {
  const mockUpdateDataStore = jest.fn();
  render(
    <AppRouterContext.Provider value={{} as AppRouterInstance}>
      <PathnameContext.Provider value={pathname}>
        <MemoryRouter initialEntries={[pathname]}>
          <DataStoreContext value={dataStore}>
            <UpdateDataStoreContext value={mockUpdateDataStore}>{children}</UpdateDataStoreContext>
          </DataStoreContext>
        </MemoryRouter>
      </PathnameContext.Provider>
    </AppRouterContext.Provider>,
  );
  return { mockUpdateDataStore };
};

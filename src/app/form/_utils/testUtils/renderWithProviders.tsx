import { type DataStore } from "@/app/form/_utils/dataStore";
import { DataStoreContext, UpdateDataStoreContext } from "@/app/form/_utils/DataStoreProvider";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";

export const renderWithProviders = (
  children: React.ReactNode,
  pathname: string,
  dataStore: DataStore = {},
) => {
  const mockUpdateDataStore = jest.fn();
  render(
    <MemoryRouter initialEntries={[pathname]}>
      <DataStoreContext value={dataStore}>
        <UpdateDataStoreContext value={mockUpdateDataStore}>{children}</UpdateDataStoreContext>
      </DataStoreContext>
    </MemoryRouter>,
  );
  return { mockUpdateDataStore, pathname };
};

import { getDefaultBoolean } from "@/app/form/_utils/dataStore";
import { DataStoreProvider, useDataStore } from "@/app/form/_utils/DataStoreProvider";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("<DataStoreProvider /> and useDataStore", () => {
  it("enables reading and writing to the data store", async () => {
    const Child = () => {
      const { dataStore, updateDataStore } = useDataStore();
      return (
        <>
          <h1>
            The value of isSoleProprietor is {getDefaultBoolean(dataStore, "isSoleProprietor")}.
          </h1>
          <button
            onClick={() => {
              updateDataStore({ isSoleProprietor: "true" });
            }}
          >
            Set to true
          </button>
        </>
      );
    };
    const user = userEvent.setup();
    render(
      <DataStoreProvider>
        <Child />
      </DataStoreProvider>,
    );
    screen.getByRole("heading", { name: "The value of isSoleProprietor is ." });
    await user.click(screen.getByRole("button", { name: "Set to true" }));
    screen.getByRole("heading", { name: "The value of isSoleProprietor is true." });
  });
});

import { getBooleanString } from "@/app/form/_utils/dataStore";
import { DataStoreProvider, useDataStore } from "@/app/form/_utils/DataStoreProvider";
import * as googleAnalytics from "@/app/form/_utils/googleAnalytics";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("<DataStoreProvider /> and useDataStore", () => {
  it("enables reading and writing to the data store", async () => {
    const Child = () => {
      const { dataStore, updateDataStore } = useDataStore();
      return (
        <>
          <h1>
            The value of isSoleProprietor is {getBooleanString(dataStore, "isSoleProprietor")}.
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

  it("asks the user for confirmation before leaving the page if the data store contains data", async () => {
    const mockSendGAEvent = vi.spyOn(googleAnalytics, "sendGAEvent");

    const Child = () => {
      const { updateDataStore } = useDataStore();
      return (
        <button
          onClick={() => {
            updateDataStore({ isSoleProprietor: "true" });
          }}
        >
          Add data to store
        </button>
      );
    };
    const user = userEvent.setup();
    render(
      <DataStoreProvider>
        <Child />
      </DataStoreProvider>,
    );

    const beforeUnloadEvent = new Event("beforeunload", { cancelable: true });
    const preventDefaultSpy = vi.spyOn(beforeUnloadEvent, "preventDefault");

    window.dispatchEvent(beforeUnloadEvent);

    expect(preventDefaultSpy).not.toHaveBeenCalled();
    expect(beforeUnloadEvent.defaultPrevented).toBe(false);
    expect(mockSendGAEvent).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Add data to store" }));
    window.dispatchEvent(beforeUnloadEvent);
    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(beforeUnloadEvent.defaultPrevented).toBe(true);
    expect(mockSendGAEvent).toHaveBeenCalledWith("event", "leavePageConfirmationShown");
  });
});

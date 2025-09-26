import { render } from "@testing-library/react";
import {
  AppRouterContext,
  type AppRouterInstance,
} from "next/dist/shared/lib/app-router-context.shared-runtime";
import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { MemoryRouter } from "react-router";

export const getRenderWithRouter = (children: React.ReactNode, pathname: string) => {
  return () =>
    render(
      <AppRouterContext.Provider value={{} as AppRouterInstance}>
        <PathnameContext.Provider value={pathname}>
          <MemoryRouter initialEntries={[pathname]}>{children}</MemoryRouter>
        </PathnameContext.Provider>
      </AppRouterContext.Provider>,
    );
};

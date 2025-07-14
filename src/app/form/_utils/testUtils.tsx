import {
  AppRouterContext,
  type AppRouterInstance,
} from "next/dist/shared/lib/app-router-context.shared-runtime";
import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";

export const RouterPathnameProvider = (props: {
  pathname: string;
  router?: AppRouterInstance;
  children: React.ReactNode;
}) => {
  return (
    <AppRouterContext.Provider value={props.router ?? ({} as AppRouterInstance)}>
      <PathnameContext.Provider value={props.pathname}>{props.children}</PathnameContext.Provider>
    </AppRouterContext.Provider>
  );
};

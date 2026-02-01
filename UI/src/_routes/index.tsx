import { Route } from "react-router-dom";
import type { ElementType, ReactElement } from "react";
import HomePage from "../pages/HomePage";
import ReviewSources from "../components/review-source/ReviewSources";
import DraftEditor from "../components/draft-editor";

interface AppRoute {
  path: string;
  element: ElementType;
  children?: AppRoute[];
  public?: boolean;
  protected?: boolean;
  index?: boolean;
}

export const routes: AppRoute[] = [
  { path: "/", element: HomePage, public: true },
  { path: "/draft-editor", element: DraftEditor, public: true },
  { path: "/review-sources", element: ReviewSources, public: true },
];

export const createRoutes = (routesArray: AppRoute[]): ReactElement[] =>
  routesArray.map(
    ({ path, children, index: isIndex, element: Component }, idx) => {
      const wrappedElement = <Component />;
      // handle protected and public routes

      if (isIndex) {
        return <Route key={idx} index element={wrappedElement} />;
      }

      return (
        <Route key={idx} path={path} element={wrappedElement}>
          {children && createRoutes(children)}
        </Route>
      );
    },
  );

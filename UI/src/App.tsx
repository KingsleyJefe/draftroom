import { Route, Routes } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import { createRoutes, routes } from "./_routes";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  return (
    <Routes>
      <Route element={<DefaultLayout />}>{createRoutes(routes)}</Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
export default App;

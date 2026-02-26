import { Route, Routes } from "react-router-dom";
import DefaultLayout from "./layouts/DefaultLayout";
import { createRoutes, routes } from "./_routes";
import NotFoundPage from "./pages/NotFoundPage";
import useDeviceType from "./lib/hooks/useDeviceType";
import DesktopOnly from "./components/DesktopOnly";

const App = () => {
  const { isMobile } = useDeviceType();

  if (isMobile) {
    return <DesktopOnly />;
  }
  return (
    <Routes>
      <Route element={<DefaultLayout />}>{createRoutes(routes)}</Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
export default App;

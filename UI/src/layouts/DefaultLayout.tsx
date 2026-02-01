import { Outlet } from "react-router-dom";
import DefaultHeader from "../components/DefaultHeader";

const DefaultLayout = () => {
  return (
    <div>
      <DefaultHeader />
      <Outlet />
    </div>
  );
};
export default DefaultLayout;

import { useLocation } from "react-router-dom";

const DefaultHeader = () => {
  const { pathname } = useLocation();
  const isEditorView = pathname === "/draft-editor";
  return (
    <header className={`pt-4 sm:px-8 px-4 ${isEditorView ? "pb-20" : "pb-4"}`}>
      <figure>
        <img
          src="/draftroom-logo.png"
          alt=""
          className="w-[149px] object-cover"
        />
      </figure>
    </header>
  );
};
export default DefaultHeader;

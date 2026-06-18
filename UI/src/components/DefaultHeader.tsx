import { useLocation } from "react-router-dom";

const DefaultHeader = () => {
  const { pathname } = useLocation();
  const isEditorView = pathname === "/draft-editor";
  return (
    <header className={`pt-3 sm:px-6 px-4 ${isEditorView ? "pb-10" : "pb-3"}`}>
      <figure>
        <img
          src="/draftroom-logo.png"
          alt=""
          className="w-[110px] object-cover"
        />
      </figure>
    </header>
  );
};
export default DefaultHeader;

import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 relative">
      <div className="absolute top-0 left-0 w-full h-max z-30">
        <img
          src="https://rapid-minds.com/rm-logo-black.png"
          alt="rm"
          className="mb-6 mt-4 ml-6 w-8"
        />
      </div>
      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-red-700">404</h1>
        <h2 className="text-3xl font-semibold text-red-600 mt-4">
          Page Not Found
        </h2>
        <p className="text-lg text-red-500 mt-2">
          Oops! The page you're looking for doesn't exist. Let's get you back on
          track.
        </p>

        <div className="mt-6">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-[#9f0101] text-white text-lg rounded-lg hover:bg-red-700 shadow-lg transition duration-300 cursor-pointer"
          >
            Go Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

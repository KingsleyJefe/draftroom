export default function DesktopOnly() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f7fb] p-6">
      <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-sm p-8">
        {/* icon */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
          <span className="text-2xl">💻</span>
        </div>

        <h1 className="text-xl font-semibold text-gray-800">
          Use a Desktop to Continue
        </h1>

        <p className="mt-3 text-sm text-gray-500 leading-relaxed">
          This Platform isn’t available on mobile right now. Please open this
          page on a laptop or desktop computer.
        </p>
      </div>
    </div>
  );
}

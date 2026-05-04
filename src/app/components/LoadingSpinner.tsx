export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="relative">
        <div
          className="w-12 h-12 rounded-full border-4 border-gray-200"
          style={{ borderTopColor: "#FF8C00" }}
        >
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
            .animate-spin {
              animation: spin 1s linear infinite;
            }
          `}</style>
          <div className="animate-spin w-full h-full" />
        </div>
      </div>
    </div>
  );
}

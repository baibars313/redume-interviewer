

export default function FeedBack({ isOpen, setIsOpen, text }) {

  return (
    <div className="flex justify-center items-center bg-gray-100">

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center  backdrop-blur-xl bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold">AI FeedBack</h2>
            <p className="mt-2 text-gray-600">
              {text}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

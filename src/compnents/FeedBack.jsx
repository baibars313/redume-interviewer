export default function FeedBack({ isOpen, setIsOpen, feedback, questions }) {
  return (
    <div className="flex justify-center items-center bg-gray-100">
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-center mb-4">AI Feedback</h2>

            <div className="space-y-4">
              {questions.map((q, idx) => (
                <div key={idx}>
                  <h4 className="font-semibold text-gray-800">{q}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {feedback.feedbacks[`question_${idx + 1}`]}
                  </p>
                </div>
              ))}
            </div>

            <h2 className="text-xl font-semibold mt-6 text-center">Overall Feedback</h2>
            <p className="text-sm text-gray-700 mt-2">{feedback.feedbacks.overall_feedback}</p>

            <div className="mt-6 flex justify-end">
              <button
                className="px-4 py-2 bg-blue-600 w-full text-center text-white rounded-lg hover:bg-blue-700 transition"
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

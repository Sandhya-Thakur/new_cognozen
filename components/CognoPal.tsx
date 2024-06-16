export const ChatBot = () => {
  return (
    <div className="flex flex-col h-full max-w-sm p-4 bg-white shadow-lg rounded-sm">
      {/* Messages Area */}
      <div className="flex flex-col space-y-2 overflow-y-auto mb-4 p-2 bg-gray-100 rounded-lg grow">
        {/* Sample messages */}
        <div className="self-start rounded-lg bg-blue-100 p-2">
          Hello! How can I help you?
        </div>
        <div className="self-end rounded-lg bg-green-100 p-2">
          Can you tell me about your services?
        </div>
        {/* Add more messages here */}
      </div>

      {/* Input Area */}
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Type a message…"
          className="flex-grow p-2 border rounded-md mr-2"
        />
        <button className="bg-blue-600 text-white rounded-md px-4 py-2">
          Send
        </button>
      </div>
    </div>
  );
};

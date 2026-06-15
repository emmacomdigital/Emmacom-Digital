import { useState } from "react";
import { MessageCircle, X, Send, ArrowRight } from "lucide-react";

export default function WhatsAppSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleOpenChat = () => {
    // Generate a real whatsapp link to support
    const encodedMsg = encodeURIComponent(message || "Hello Emmacom Digital Support, I need some assistance with the affiliate system!");
    const whatsappUrl = `https://wa.me/2348000000000?text=${encodedMsg}`;
    window.open(whatsappUrl, "_blank");
    setMessage("");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans" id="whatsapp-widget">
      {/* Floating Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition-transform hover:scale-115 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-400 group relative"
          id="whatsapp-bubble-btn"
          title="Contact Support"
        >
          <MessageCircle className="h-7 w-7 animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-600 border border-white text-[9px] font-bold text-white items-center justify-center">1</span>
          </span>
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div 
          className="w-80 rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 transform scale-100 ease-out origin-bottom-right"
          id="whatsapp-chat-box"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
                  ED
                </div>
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-600"></span>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Emmacom Support</h4>
                <p className="text-[11px] text-emerald-100 flex items-center">
                  Online • Replies in minutes
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/10 p-1.5 rounded-full transition-colors"
              id="whatsapp-close-btn"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Body info */}
          <div className="p-4 bg-gray-50 text-xs text-gray-600 leading-relaxed border-b border-gray-100">
            👋 Welcome to Emmacom Digital Support. Have questions about payouts, recurring donation compliance, or commission rules? Chat with an agent now.
          </div>

          {/* Chat input */}
          <div className="p-3 bg-white">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={3}
              className="w-full text-sm p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
            />
            <div className="flex justify-between items-center mt-2.5 pl-1">
              <span className="text-[10px] text-gray-400">Uses WhatsApp Web/App</span>
              <button
                onClick={handleOpenChat}
                className="flex items-center space-x-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs px-3.5 py-1.5 rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer"
                id="whatsapp-send-btn"
              >
                <span>Chat</span>
                <Send className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

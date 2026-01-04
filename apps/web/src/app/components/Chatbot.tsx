import { MessageCircle, X, Send } from "lucide-react";
import { useState } from "react";

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Merhaba! 👋 OLRIC AI Asistanı olarak size nasıl yardımcı olabilirim?'
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const quickReplies = [
    'Nasıl çalışır?',
    'Fiyatlandırma nedir?',
    'Gmail nasıl bağlanır?',
    'Hangi asistanlar var?'
  ];

  const handleQuickReply = (reply: string) => {
    setMessages(prev => [...prev, { type: 'user', text: reply }]);

    // Simulate bot response
    setTimeout(() => {
      let response = '';
      if (reply.includes('çalışır')) {
        response = 'OLRIC, e-posta hesabınızı güvenli şekilde tarayarak seyahat rezervasyonları, harcamalar, siparişler, etkinlikler ve abonelikleri otomatik olarak organize eder. 🎯';
      } else if (reply.includes('Fiyat')) {
        response = 'Ücretsiz plan, Pro plan (₺299/ay) ve Lifetime lisans (₺1499) sunuyoruz. Pro plan ile 5 asistana sınırsız erişim sağlayabilirsiniz! 💎';
      } else if (reply.includes('Gmail')) {
        response = 'Sadece 3 adım: 1) Kaydolun 2) Gmail hesabınızı OAuth ile güvenli şekilde bağlayın 3) AI analizlerini görün! 🚀';
      } else if (reply.includes('asistan')) {
        response = '5 AI Asistan: ✈️ Seyahat Organizatörü, 💰 Finans Takipçisi, 🛍️ Alışveriş Asistanı, 📅 Etkinlik Yöneticisi, 🔄 Abonelik Takipçisi';
      }
      setMessages(prev => [...prev, { type: 'bot', text: response }]);
    }, 500);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    setMessages(prev => [...prev, { type: 'user', text: inputValue }]);
    setInputValue('');

    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'bot',
        text: 'Teşekkürler! Detaylı bilgi için destek ekibimiz en kısa sürede size dönüş yapacak. 🙏'
      }]);
    }, 500);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 bg-gradient-to-br from-[#0c1844] to-[#1e3a8a] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 group"
        >
          <MessageCircle className="size-6" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full size-5 flex items-center justify-center animate-pulse">
            1
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 left-6 w-96 bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border-2 border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-br from-[#0c1844] to-[#1e3a8a] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-2">
                <MessageCircle className="size-5" />
              </div>
              <div>
                <div className="font-bold">OLRIC AI Asistan</div>
                <div className="text-xs text-blue-200">Genellikle hemen yanıt verir</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto h-96 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${msg.type === 'user'
                      ? 'bg-[#0c1844] text-white rounded-br-sm'
                      : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Quick Replies */}
            {messages.length === 1 && (
              <div className="space-y-2">
                <div className="text-xs text-gray-500 px-2">Hızlı Sorular:</div>
                {quickReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickReply(reply)}
                    className="block w-full text-left bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 p-3 rounded-xl transition-colors text-sm"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Mesajınızı yazın..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:border-[#0c1844] transition-colors"
              />
              <button
                onClick={handleSend}
                className="bg-[#0c1844] hover:bg-[#1e3a8a] text-white p-3 rounded-full transition-colors"
              >
                <Send className="size-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

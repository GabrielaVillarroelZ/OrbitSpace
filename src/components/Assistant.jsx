import { useState, useRef, useEffect } from 'react';
import { Star, X, Send, Loader2 } from "lucide-react";
import { enviarMensajeChat } from '../Servicios/api';

function Assistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false); 

  const [messages, setMessages] = useState([
    { id: 1, type: 'ai', text: 'Hola, Comandante. Soy su asistente orbital. He sincronizado la telemetría, ¿en qué puedo ayudarla hoy?' }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault(); 
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue;
    const newUserMsg = { id: Date.now(), type: 'user', text: userText };
    
    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue(""); 
    setIsTyping(true);

    try {
      const data = await enviarMensajeChat(userText);
      const aiResponse = { 
        id: Date.now() + 1, 
        type: 'ai', 
        text: data.respuesta || "Señal débil... No he podido procesar la consulta, Comandante."
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      setMessages((prev) => [...prev, { 
        id: Date.now() + 1, 
        type: 'ai', 
        text: "⚠️ Interferencia detectada. Verifique su conexión con la estación base." 
      }]);
    } finally {
      setIsTyping(false); 
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-20 md:bottom-28 right-4 left-4 md:left-auto md:right-8 md:w-96 h-[70vh] md:h-[500px] bg-[#1a0b36]/95 backdrop-blur-2xl border border-purple-500/40 rounded-3xl shadow-[0_0_40px_rgba(168,85,247,0.4)] z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          
          <div className="p-4 border-b border-purple-500/20 flex items-center justify-between bg-[#15092a]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-fuchsia-500/20 border border-fuchsia-500/40">
                <Star size={18} className="text-fuchsia-400 fill-fuchsia-400/20" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">Orbit AI Assistant</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-[10px] text-purple-300 uppercase font-medium">Enlace Activo</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-purple-300 hover:text-white p-1 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`p-3 text-sm rounded-2xl ${
                    msg.type === 'user' 
                      ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-tr-none' 
                      : 'bg-[#2a1457] text-purple-50 rounded-tl-none border border-purple-500/20 shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-2 justify-start">
                <div className="p-3 bg-[#2a1457] rounded-2xl rounded-tl-none border border-purple-500/20">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-fuchsia-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-fuchsia-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-fuchsia-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 bg-[#15092a]/50 border-t border-purple-500/20">
            <div className="flex items-center gap-2 bg-[#0a0414] border border-purple-500/30 rounded-full p-1.5 pr-2 focus-within:border-fuchsia-400/50 transition-all">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Escriba un comando orbital..."
                className="flex-1 bg-transparent px-3 text-white outline-none text-sm placeholder:text-purple-300/30"
                disabled={isTyping}
              />
              <button 
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="bg-fuchsia-600 text-white p-2 rounded-full hover:bg-fuchsia-500 transition-colors disabled:opacity-30"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 md:bottom-8 md:right-8 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white p-4 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:scale-110 transition-all z-50 border border-fuchsia-400/30"
      >
        <Star size={24} className={`${isOpen ? 'rotate-90' : ''} transition-transform duration-300`} />
      </button>
    </>
  );
}

export default Assistant;
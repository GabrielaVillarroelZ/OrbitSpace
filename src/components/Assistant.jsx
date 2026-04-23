import { useState, useRef, useEffect } from 'react';
import { Star, X, Send, Loader2 } from "lucide-react"; // Añadimos Loader2 para el efecto de carga
import { enviarMensajeChat } from '../Servicios/api'; // Importamos tu conexión

function Assistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false); // Nuevo: Estado para saber si la IA está pensando

  const [messages, setMessages] = useState([
    { id: 1, type: 'ai', text: 'Hola, Comandante. Soy su asistente orbital. ¿En qué puedo ayudarla con la red de satélites hoy?' }
  ]);

  const messagesEndRef = useRef(null);
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // --- FUNCIÓN DE ENVÍO CONECTADA AL BACKEND ---
  const handleSendMessage = async (e) => {
    e.preventDefault(); 
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue;
    const newUserMsg = { id: Date.now(), type: 'user', text: userText };
    
    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue(""); 
    setIsTyping(true); // La IA empieza a "escribir"

    try {
      // 🚀 Llamamos a la API enviando el mensaje y el Token (que va dentro de la función)
      const data = await enviarMensajeChat(userText);

      const aiResponse = { 
        id: Date.now() + 1, 
        type: 'ai', 
        text: data.respuesta || data.message || "Lo siento, Comandante. He perdido la conexión con el servidor central."
      };
      
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      setMessages((prev) => [...prev, { 
        id: Date.now() + 1, 
        type: 'ai', 
        text: "⚠️ Error en el enlace ascendente. Verifique sus credenciales de acceso." 
      }]);
    } finally {
      setIsTyping(false); // La IA termina de escribir
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-20 md:bottom-28 right-4 left-4 md:left-auto md:right-8 md:w-96 h-[70vh] md:h-[500px] bg-[#1a0b36]/95 backdrop-blur-2xl border border-purple-500/40 rounded-3xl shadow-[0_0_40px_rgba(168,85,247,0.3)] z-50 flex flex-col overflow-hidden transition-all duration-300">
          
          <div className="p-3 md:p-4 border-b border-purple-500/20 flex items-center justify-between bg-gradient-to-r from-[#15092a] to-[#1e0a3c]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-purple-600/30 border border-purple-400/50">
                <Star size={16} className="text-white fill-fuchsia-100" />
              </div>
              <div>
                <h3 className="text-sm md:text-md font-bold text-white leading-tight">Orbit Assistant</h3>
                <p className="text-[10px] md:text-xs text-purple-300/70">IA Orbital en línea</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-purple-300 hover:text-white p-1.5 rounded-full transition-all">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 p-4 md:p-5 space-y-6 overflow-y-auto text-sm flex flex-col scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-transparent">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex w-full ${msg.type === 'user' ? 'justify-end' : ''}`}>
                <div className={`flex gap-3 max-w-[90%] md:max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center border ${
                    msg.type === 'user' ? 'bg-[#15092a] border-fuchsia-400/50 text-[10px] font-bold text-fuchsia-300' : 'bg-gradient-to-br from-purple-600 to-fuchsia-600'
                  }`}>
                    {msg.type === 'user' ? 'TÚ' : <Star size={14} className="text-white fill-white" />}
                  </div>
                  <div className={`p-3 text-[13px] md:text-sm rounded-2xl leading-relaxed ${
                    msg.type === 'user' ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-tr-none' : 'bg-[#2a1457] text-purple-50 rounded-tl-none border border-purple-500/30'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            
            {/* --- INDICADOR DE CARGA (Cuando la IA piensa) --- */}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center">
                  <Loader2 size={14} className="text-white animate-spin" />
                </div>
                <div className="p-3 bg-[#2a1457] text-purple-300 rounded-2xl rounded-tl-none border border-purple-500/30 italic text-xs">
                  Sincronizando con red neuronal...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-3 md:p-4 border-t border-purple-500/20 bg-[#15092a]/80">
            <div className="flex items-center gap-2 bg-[#2a1457]/50 border border-purple-500/30 rounded-full p-1.5 pr-2 focus-within:border-fuchsia-400/80 transition-all">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isTyping ? "IA procesando..." : "Escribe tu mensaje..."}
                disabled={isTyping}
                className="flex-1 bg-transparent px-3 text-purple-100 outline-none text-[13px] md:text-sm disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={isTyping}
                className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white p-2 rounded-full hover:scale-105 transition-all disabled:grayscale disabled:scale-100"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Botón Flotante */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 md:bottom-8 md:right-8 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all z-50 group border border-fuchsia-400/50"
      >
        <Star size={24} className="text-white group-hover:fill-white transition-all duration-300" />
      </button>
    </>
  );
}

export default Assistant;
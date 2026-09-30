import { useRef, useEffect, useState } from "react";
import ChatbotIcon from "./ChatbotIcon";
import ChatForm from "./ChatForm";
import ChatMessage from "./ChatMessage";
import './Chatbot.css';

//const apiUrl = "/api/chat"; // An endpoint on your backend
//const apiUrl = "http://localhost:5001/api/chat"; //  This immediately bypasses the proxy issue!
// 1. You define the port at the very top of the file in a single, easily accessible place.
const CHAT_PORT = "5001";
// 2. You build a dynamic path using this variable
const apiUrl = `http://localhost:${CHAT_PORT}/api/chat`;
const LOADING_TEXT = "Myślę...";

const Chatbot = ({ id, activeChatId, setActiveChatId, noteContext }) => {
    const [chatHistory, setChatHistory] = useState([]);
    const chatBodyRef = useRef();
    const isThisChatOpen = activeChatId === id;

    const handleToggleChat = () => {
        if (isThisChatOpen) {
            setActiveChatId(null);
        } else {
            setActiveChatId(id);
        }
    };

    useEffect(() => {
        if (isThisChatOpen && noteContext) {
            const userName = noteContext.userName || "Użytkowniku";
            const systemPrompt = {
                id: crypto.randomUUID(),
                role: "user",
                text: `Jesteś profesjonalnym i empatycznym Coachem Rozwoju Osobistego.Rozmawiasz z użytkownikiem o imieniu: ${userName}.
                Użytkownik otworzył właśnie swój wpis z pamiętnika. 
                Tytuł wpisu: "${noteContext.title}"
                Data: ${noteContext.time}
                Treść: "${noteContext.content}"
                Przeanalizuj krótko ten tekst. Odpowiedz bardzo krótko (max 2-3 zdania).
                BEZWZGLĘDNE WYMAGANIA DOTYCZĄCE FORMATOWANIA:
                1. ROZPOCZNIJ ODPOWIEDŹ od bardzo ciepłego przywitania użytkownika po imieniu, stosując poprawną polską formę wołacza (np. "Cześć Aniu!", "Witaj Olu!", "Dzień dobry Tomku!").
                2. NATYCHMIAST PO POWITANIU wstaw dokładnie dwa znaki nowej linii (podwójny enter / '\n\n').
                3. Dopiero od nowej linii (w osobnym akapicie) nawiąż bezpośrednio do tego, co napisał, i zadaj jedno głębokie pytanie coachingowe, które skłoni go do refleksji.
    
                Schemat Twojej odpowiedzi musi wyglądać dokładnie tak:
                [Ciepłe powitanie po imieniu]!
    
                [Tutaj Twoja krótka analiza i jedno głębokie pytanie coachingowe]`
            };
            setChatHistory([systemPrompt]);
            generateBotResponse([systemPrompt]);
        } else if (!isThisChatOpen) {
            setChatHistory([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isThisChatOpen]);

    const generateBotResponse = async (history) => {
        const updateHistory = (text, isError = false) => {
            setChatHistory((prev) => {
                const lastMsgIndex = prev.length - 1;
                if (!isError && lastMsgIndex >= 0 && prev[lastMsgIndex].role === "model" && !prev[lastMsgIndex].isError) {
                    const newHistory = [...prev];
                    newHistory[lastMsgIndex] = { ...newHistory[lastMsgIndex], text, isLoading: false };
                    return newHistory;
                }
                const filtered = prev.filter((msg) => !msg.isLoading);
                return [...filtered, { id: crypto.randomUUID(), role: "model", text, isError }];
            });
        };

        const formattedHistory = history.map(({ role, text }) => ({ role, parts: [{ text }] }));

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: formattedHistory })
        };

        try {
            const response = await fetch(apiUrl, requestOptions);
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error.message || "Something went wrong!");
            }
            // Handle data streaming
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";
            // Tworzymy lokalny akumulator tekstowy dedykowany dla tej pętli,
            // aby odciąć asynchroniczne opóźnienia hooka useState w React.
            // TA ZMIENNA JEST KLUCZEM: Zapamiętuje każdą najmniejszą nową cząstkę tekstu 
            // i buduje pełne zdanie od zera, całkowicie ignorując szatkowanie pakietów przez sieć.
            let fullResponseText = "";

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop();

                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        try {
                            const json = JSON.parse(line.substring(6));

                            // Pobieramy nadesłany fragment tekstu
                            const textFragment = json.candidates[0].content.parts[0].text;

                            if (textFragment) {
                                // Sprawdzamy, czy nadesłany tekst to nowy fragment (delta), czy pełny ciąg.
                                // Jeśli to tylko mała cząstka (np. "ąbie"), doklejamy ją do całości.
                                if (!fullResponseText.endsWith(textFragment)) {
                                    if (textFragment.startsWith(fullResponseText)) {
                                        // Jeśli Google wysłało narastający tekst, nadpisujemy nim całość
                                        fullResponseText = textFragment;
                                    } else {
                                        // W standardowym przypadku po prostu doklejamy nowe słowo
                                        fullResponseText += textFragment;
                                    }
                                }
                                // Czyścimy formatowanie Markdown Twoim poprawionym regexem
                                const cleanedText = fullResponseText.replace(/\*\*(.*?)\*\*/g, "$1").trim();
                                // Wypychamy zawsze kompletny, narastający od zera tekst do okna czatu
                                updateHistory(cleanedText);
                            }
                        } catch (e) {
                            continue;
                        }
                    }
                }
            }
        } catch (error) {
            updateHistory(error.message, true);
        }
    };

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
        }
    }, [chatHistory]);

    const visibleHistory = chatHistory.filter((_, idx) => idx > 0);

    return (
        <div className={`chatbot-scope ${isThisChatOpen ? "show-chatbot" : ""}`}>
            <button
                onClick={handleToggleChat}
                className="chatbot-toggler"
            >
                <span className="material-symbols-rounded">mode_comment</span>
                <span className="material-symbols-rounded">close</span>
            </button>

            <div className="chatbot-popup">
                <div className="chat-header">
                    <div className="header-info">
                        <ChatbotIcon />
                        <h2 className="logo-text">Coach AI</h2>
                    </div>
                    <button onClick={handleToggleChat} className="material-symbols-rounded">
                        keyboard_arrow_down
                    </button>
                </div>

                <div ref={chatBodyRef} className="chat-body">
                    {visibleHistory.length === 0 && (
                        <ChatMessage
                            chat={{
                                role: "model",
                                text: "Analizuję Twój wpis... Zaraz zaczynamy sesję."
                            }}
                        />
                    )}
                    {visibleHistory.map((chat) => (
                        <ChatMessage key={chat.id} chat={chat} />
                    ))}
                </div>

                <div className="chat-footer">
                    <ChatForm
                        chatHistory={chatHistory}
                        setChatHistory={setChatHistory}
                        generateBotResponse={generateBotResponse}
                        loadingText={LOADING_TEXT}
                    />
                </div>
            </div>
        </div>
    );
};

export default Chatbot;

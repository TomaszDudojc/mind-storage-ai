import { useRef, useEffect, useState } from "react";
import ChatbotIcon from "./ChatbotIcon";
import ChatForm from "./ChatForm";
import ChatMessage from "./ChatMessage";
import './Chatbot.css';

const apiVersion = "gemini-flash-latest";

const getApiKey = () => {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
        return import.meta.env.VITE_API_KEY;
    }
    return process.env.REACT_APP_API_KEY || null;
};

const apiKey = getApiKey();
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${apiVersion}:streamGenerateContent?alt=sse`;

// Odbieramy nowe propsy kontrolne i tekst z notatek
const Chatbot = ({ id, activeChatId, setActiveChatId, noteContext }) => {
    const [chatHistory, setChatHistory] = useState([]);
    const chatBodyRef = useRef();

    // NOWOŚĆ: Sprawdzamy, czy TO konkretne okienko ma być teraz otwarte
    const isThisChatOpen = activeChatId === id;

    // NOWOŚĆ: Obsługa kliknięcia w Twój wbudowany przycisk togglera
    const handleToggleChat = () => {
        if (isThisChatOpen) {
            setActiveChatId(null); // Zamyka czat
        } else {
            setActiveChatId(id); // Otwiera czat dla tej notatki / obszaru tworzenia
        }
    };

    // NOWOŚĆ: Reagowanie na otwarcie czatu i wstrzykiwanie roli Coacha
    useEffect(() => {
        if (isThisChatOpen && noteContext) {
            const systemPrompt = {
                role: "user",
                text: `Jesteś profesjonalnym Coachem Rozwoju Osobistego. 
Użytkownik otworzył właśnie wpis z pamiętnika. 
Tytuł wpisu: "${noteContext.title}"
Data: ${noteContext.time}
Treść: "${noteContext.content}"

Przeanalizuj krótko ten tekst. Odpowiedz bardzo krótko (max 2-3 zdania), przywitaj się ciepło, nawiąż do tego co napisał i zadaj jedno głębokie pytanie coachingowe, które skłoni go do refleksji.`
            };

            setChatHistory([systemPrompt]);
            generateBotResponse([systemPrompt]);
        } else if (!isThisChatOpen) {
            setChatHistory([]); // Czyszczenie jednorazowej sesji przy zamknięciu
        }
    }, [isThisChatOpen]);

    const generateBotResponse = async (history) => {
        let accumulatedText = "";

        const updateHistory = (text, isError = false) => {
            setChatHistory((prev) => {
                const lastMsgIndex = prev.length - 1;
                if (!isError && lastMsgIndex >= 0 && prev[lastMsgIndex].role === "model" && !prev[lastMsgIndex].isError) {
                    const newHistory = [...prev];
                    newHistory[lastMsgIndex] = { ...newHistory[lastMsgIndex], text };
                    return newHistory;
                }
                const filtered = prev.filter((msg) => msg.text !== "Myślę...");
                return [...filtered, { role: "model", text, isError }];
            });
        };

        const formattedHistory = history.map(({ role, text }) => ({ role, parts: [{ text }] }));

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": apiKey
            },
            body: JSON.stringify({ contents: formattedHistory })
        };

        try {
            const response = await fetch(apiUrl, requestOptions);
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error.message || "Something went wrong!");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split("\n");

                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        try {
                            const json = JSON.parse(line.substring(6));
                            const textFragment = json.candidates[0].content.parts[0].text;

                            if (textFragment) {
                                accumulatedText += textFragment;
                                const cleanedText = accumulatedText.replace(/\*\* (.*?)\*\*/g, "$1").trim();
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

    // Ukrywamy instrukcje systemowe dla Gemini przed oczami użytkownika
    const visibleHistory = chatHistory.filter((_, idx) => idx > 0);

    return (
        /* ZMIANA: show-chatbot sterowane jest teraz zmienną isThisChatOpen */
        <div className={`chatbot-scope ${isThisChatOpen ? "show-chatbot" : ""}`}>

            {/* Przycisk Toglera z Twoim wbudowanym nasłuchiwaniem kliknięcia */}
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
                        <h2 className="logo-text">Coach AI</h2> {/* Zmiana nazwy na Coach AI */}
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

                    {visibleHistory.map((chat, index) => (
                        <ChatMessage key={index} chat={chat} />
                    ))}
                </div>

                <div className="chat-footer">
                    <ChatForm
                        chatHistory={chatHistory}
                        setChatHistory={setChatHistory}
                        generateBotResponse={generateBotResponse}
                    />
                </div>
            </div>
        </div>
    );
};

export default Chatbot;

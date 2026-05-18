import { useRef } from "react";

const Chatform = ({ chatHistory, setChatHistory, generateBotResponse }) => {
    const inputRef = useRef();

    const handleFormSubmit = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (e && e.stopPropagation) e.stopPropagation();
        const userMessage = inputRef.current.value.trim();
        if (!userMessage) return;
        inputRef.current.value = "";

        // Update chat history with th user's message
        setChatHistory(history => [...history, { role: "user", text: userMessage }]);

        // Delay 600 ms before showing "Myślę..." message
        setTimeout(() => {
            // Add a "Myślę..." placeholder for the bot's response
            setChatHistory(history => [...history, { role: "model", text: "Myślę..." }]);
            // Call the function to generate bot response
            generateBotResponse([...chatHistory, { role: "user", text: userMessage }]);
        }, 600);
    }

    return (
        <div className="chat-form">
            <input ref={inputRef} type="text" placeholder="Wiadomość..." className="message-input"
                required onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleFormSubmit(e);
                    }
                }} />
            <button onClick={handleFormSubmit} className="material-symbols-rounded">arrow_upward</button>
        </div>
    );
};

export default Chatform

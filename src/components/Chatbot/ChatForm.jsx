import { useRef } from "react";

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse, loadingText, isGenerating }) => {
    const inputRef = useRef();

    const handleInputChange = () => {
        if (inputRef.current) {
            inputRef.current.style.height = "45px";
            const newHeight = Math.min(inputRef.current.scrollHeight, 150);
            inputRef.current.style.height = `${newHeight}px`;
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (isGenerating) return;
        const userMessage = inputRef.current.value.trim();
        if (!userMessage) return;
        inputRef.current.value = "";

        if (inputRef.current) {
            inputRef.current.style.height = "45px";
        }

        // Update chat history with th user's message             
        setChatHistory(history => [...history, { id: crypto.randomUUID(), role: "user", text: userMessage }]);

        // Delay 600 ms before showing "Myślę..." message       
        setTimeout(() => {
            // Add a "Myślę..." placeholder for the bot's response
            setChatHistory(history => [...history, { id: crypto.randomUUID(), role: "model", text: loadingText, isLoading: true }]);
            // Call the function to generate bot response
            generateBotResponse([...chatHistory, { id: crypto.randomUUID(), role: "user", text: userMessage }]);
        }, 600);
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleFormSubmit(e);
        }
    };

    return (
        <form className="chat-form" onSubmit={handleFormSubmit}>
            <textarea
                ref={inputRef}
                placeholder="Wiadomość..."
                className="message-input"
                disabled={isGenerating}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                rows="1"
                required
            />
            <button className="material-symbols-rounded" disabled={isGenerating}>arrow_upward</button>
        </form>
    );
};

export default ChatForm

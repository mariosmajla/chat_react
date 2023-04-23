import React from "react";
import { useState } from "react";

function Input({ onSendMessage }) {
    const [text, setText] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim() !== "") {
            setText("");
            onSendMessage(text);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    onChange={(e) => setText(e.target.value)}
                    value={text}
                    type="text"
                    placeholder="Unesi poruku... "
                    autoFocus={true}
                />
                <button disabled={!text.trim()}>Pošalji</button>
            </form>
        </div>
    );
}

export default Input;
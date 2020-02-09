import React, { useRef, useState, useEffect } from "react";
import "./styles.css";

const placeCaretAtEnd = ref => {
  ref.focus();
  const range = document.createRange();
  range.selectNodeContents(ref);
  range.collapse(false);
  const sel = window.getSelection();
  if (sel) {
    sel.removeAllRanges();
    sel.addRange(range);
  }
};

const getErrorSpan = (textarea, allowedText, extraText) => {
  if (textarea && textarea.current)
    textarea.current.innerHTML = `${allowedText}<span>${extraText}</span>`;
};

const checkForExtraText = (textarea, maxLength, minLength) => {
  const textInputCount = textarea.current.innerText.length;
  if (maxLength < textInputCount) {
    const inputText = textarea.current.innerText;
    const allowedText = inputText.substring(0, maxLength);
    const extraText = inputText.substring(maxLength);
    if (textarea.current.children.length > 0) {
      const innerText = textarea.current.children[0].innerText;
      if (innerText.length > 0) {
        const lastIndex = innerText.lastIndexOf(extraText);
        if (lastIndex >= 0) {
          getErrorSpan(textarea, allowedText, extraText);
        }
      }
    } else {
      getErrorSpan(textarea, allowedText, extraText);
    }
    placeCaretAtEnd(textarea.current);
  }
};

export default function App() {
  const textarea = useRef();
  const [input, setInput] = useState("pravaljain");

  const maxLength = 5;
  const minLength = 15;

  useEffect(() => {
    if (input.substring(maxLength).length > 0) {
      getErrorSpan(
        textarea,
        input.substring(0, maxLength),
        input.substring(maxLength)
      );
    } else {
      const validText = input.substring(0, maxLength);
      if (textarea.current) textarea.current.innerHTML = `${validText}`;
    }
  });

  const changeInput = e => {
    setInput(textarea.current.innerText);
    checkForExtraText(textarea, maxLength, minLength);
  };

  return (
    <div
      className="editable-div"
      aria-describedby="multiline-text-area"
      role="textbox"
      aria-label="Multiline text"
      ref={textarea}
      contentEditable
      onInput={changeInput}
      suppressContentEditableWarning
    />
  );
}

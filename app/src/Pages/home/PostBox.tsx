import React, { useState, useRef, useEffect } from 'react';

const mockSuggestions = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Alice Johnson' },
  { id: 4, name: 'Bob Brown' },
  { id: 5, name: 'Charlie Black' },
  { id: 6, name: 'David White' }
];

const PostBox = () => {
  const [content, setContent] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [taggedUsers, setTaggedUsers] = useState([]);
  const contentEditableRef = useRef(null);

  useEffect(() => {
    setSuggestions(mockSuggestions);
  }, []);

  const handleInputChange = () => {
    const text = contentEditableRef.current.innerHTML;
    setContent(text);

    const lastWord = text.split(' ').pop().replace(/<[^>]*>?/gm, '');
    if (lastWord.startsWith('@')) {
      const query = lastWord.slice(1).toLowerCase();
      const filtered = suggestions.filter(suggestion =>
        suggestion.name.toLowerCase().includes(query)
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const text = contentEditableRef.current.innerHTML;
    const words = text.split(' ');
    words.pop();
    const newText = `${words.join(' ')} <span class="inline-flex items-center rounded-md bg-indigo-100 px-2 py-1 text-xs font-medium text-gray-600">@${suggestion.name}</span> `;
    setContent(newText);
    setShowSuggestions(false);
    setTaggedUsers([...taggedUsers, suggestion]);

    setTimeout(() => {
      contentEditableRef.current.innerHTML = newText;
      placeCaretAtEnd(contentEditableRef.current);
    }, 0);
  };

  const placeCaretAtEnd = (element) => {
    element.focus();
    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && showSuggestions) {
      e.preventDefault();
      handleSuggestionClick(filteredSuggestions[0]);
    }
  };

  return (
    <div className="p-6 bg-red-500">
      <div
        ref={contentEditableRef}
        contentEditable
        onInput={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="What's on your mind?"
        className="w-full rounded-lg p-2 text-sm border border-transparent appearance-none rounded-tg placeholder-gray-400 dark:bg-zinc-800"
        style={{ minHeight: '4rem', whiteSpace: 'pre-wrap' }}
      ></div>
      {showSuggestions && (
        <ul className="border border-gray-300 rounded mt-2 bg-white shadow-md max-h-40 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="p-2 hover:bg-gray-200 cursor-pointer"
            >
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}
      <input
        type="text"
        value={JSON.stringify(taggedUsers)}
        name="taggedUsers"
      />
    </div>
  );
};

export default PostBox;

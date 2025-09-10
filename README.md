# Monster Meme Memory

A retro internet-inspired interface for managing memories and conversing with an AI bot powered by mem0. Built with classic web styling featuring Times New Roman fonts, black borders, and a nostalgic 90s internet aesthetic.

## Features

- **Memory Input**: Add text memories through a simple textarea interface
- **AI Bot Conversation**: Chat with a bot that remembers and references your stored memories
- **Retro Styling**: Classic internet design with Times New Roman fonts and black/white color scheme
- **Local Storage**: Memories are stored locally in your browser
- **Responsive Design**: Works on desktop and mobile devices

## Quick Start

1. **Clone or download** this repository
2. **Open** `index.html` in your web browser
3. **Start adding memories** in the top text input
4. **Chat with the bot** in the bottom conversation area

## Usage

### Adding Memories
- Type your memory in the text input area at the top
- Click "ADD MEMORY" or press `Ctrl+Enter`
- Memories are automatically saved to your browser's local storage

### Chatting with the Bot
- Type your message in the chat input at the bottom
- Press Enter or click "SEND"
- The bot will reference your stored memories in responses

### Keyboard Shortcuts
- `Ctrl+M`: Focus memory input
- `Ctrl+L`: Focus chat input
- `Ctrl+Enter`: Add memory (when in memory input)
- `Enter`: Send message (when in chat input)

## File Structure

```
monster-meme-memory/
├── index.html          # Main HTML structure
├── style.css           # Retro internet styling
├── script.js           # Bot functionality and memory management
├── requirements.txt     # Python dependencies (for future mem0 integration)
└── README.md           # This file
```

## Styling Details

- **Colors**: Primary #000000 (black), Background #FFFFFF (white), Text #000000 (black)
- **Font**: Times New Roman throughout
- **Design**: Retro internet-inspired with simple borders, minimal padding (8-12px)
- **Elements**: Classic web form elements, monospace touches for technical elements

## Future Enhancements

This is currently a frontend-only implementation. Future versions will include:

- **mem0 Integration**: Full mem0 SDK integration for advanced memory management
- **Backend API**: Python Flask server for persistent memory storage
- **Advanced Search**: Semantic search through memories
- **Memory Categories**: Organize memories by type or topic
- **Export/Import**: Backup and restore memories

## Technical Notes

- Memories are stored in browser localStorage
- The bot uses simple keyword matching to find relevant memories
- All styling follows retro internet design principles
- Responsive design works on mobile devices

## Development

To extend this project:

1. Install Python dependencies: `pip install -r requirements.txt`
2. Set up mem0 integration for advanced memory features
3. Add backend API endpoints for persistent storage
4. Implement semantic search capabilities

## License

This project is open source and available under the MIT License.

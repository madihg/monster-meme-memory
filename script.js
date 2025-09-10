// Monster Meme Memory - Bot Interface with Mem0 Integration

class MemoryBot {
    constructor() {
        this.memories = [];
        this.conversationHistory = [];
        this.isProcessing = false;
        
        this.initializeElements();
        this.setupEventListeners();
        this.loadStoredMemories();
    }
    
    initializeElements() {
        this.memoryInput = document.getElementById('memoryInput');
        this.addMemoryBtn = document.getElementById('addMemoryBtn');
        this.memoryStatus = document.getElementById('memoryStatus');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('sendBtn');
    }
    
    setupEventListeners() {
        // Memory input events
        this.addMemoryBtn.addEventListener('click', () => this.addMemory());
        this.memoryInput.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.addMemory();
            }
        });
        
        // Chat input events
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        // Auto-focus chat input after memory is added
        this.memoryInput.addEventListener('input', () => {
            if (this.memoryInput.value.trim()) {
                this.memoryStatus.textContent = 'Ready to add memory...';
                this.memoryStatus.className = 'memory-status';
            }
        });
    }
    
    loadStoredMemories() {
        const stored = localStorage.getItem('monsterMemeMemories');
        if (stored) {
            this.memories = JSON.parse(stored);
            this.updateMemoryStatus(`Loaded ${this.memories.length} memories from storage`);
        }
    }
    
    saveMemories() {
        localStorage.setItem('monsterMemeMemories', JSON.stringify(this.memories));
    }
    
    addMemory() {
        const memoryText = this.memoryInput.value.trim();
        
        if (!memoryText) {
            this.updateMemoryStatus('Please enter a memory before adding.', 'error');
            return;
        }
        
        const memory = {
            id: Date.now(),
            text: memoryText,
            timestamp: new Date().toISOString(),
            addedAt: new Date().toLocaleString()
        };
        
        this.memories.push(memory);
        this.saveMemories();
        
        this.updateMemoryStatus(`Memory added successfully! (Total: ${this.memories.length})`, 'success');
        this.memoryInput.value = '';
        
        // Auto-focus chat input
        setTimeout(() => {
            this.chatInput.focus();
        }, 100);
    }
    
    updateMemoryStatus(message, type = '') {
        this.memoryStatus.textContent = message;
        this.memoryStatus.className = `memory-status ${type}`;
        
        // Clear status after 3 seconds
        setTimeout(() => {
            if (this.memoryStatus.textContent === message) {
                this.memoryStatus.textContent = '';
                this.memoryStatus.className = 'memory-status';
            }
        }, 3000);
    }
    
    async sendMessage() {
        const messageText = this.chatInput.value.trim();
        
        if (!messageText || this.isProcessing) {
            return;
        }
        
        // Add user message to chat
        this.addMessageToChat(messageText, 'user');
        this.chatInput.value = '';
        
        // Show typing indicator
        const typingId = this.addTypingIndicator();
        
        try {
            this.isProcessing = true;
            this.sendBtn.disabled = true;
            
            // Get bot response
            const response = await this.getBotResponse(messageText);
            
            // Remove typing indicator and add bot response
            this.removeTypingIndicator(typingId);
            this.addMessageToChat(response, 'bot');
            
        } catch (error) {
            console.error('Error getting bot response:', error);
            this.removeTypingIndicator(typingId);
            this.addMessageToChat('Sorry, I encountered an error processing your message.', 'bot');
        } finally {
            this.isProcessing = false;
            this.sendBtn.disabled = false;
            this.chatInput.focus();
        }
    }
    
    addMessageToChat(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `${sender}-message`;
        
        const timestamp = new Date().toLocaleTimeString();
        const timestampSpan = document.createElement('span');
        timestampSpan.className = 'timestamp';
        timestampSpan.textContent = `[${sender.toUpperCase()}] ${timestamp}`;
        
        const messageSpan = document.createElement('span');
        messageSpan.className = 'message';
        messageSpan.textContent = message;
        
        messageDiv.appendChild(timestampSpan);
        messageDiv.appendChild(messageSpan);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Store in conversation history
        this.conversationHistory.push({
            sender,
            message,
            timestamp: new Date().toISOString()
        });
    }
    
    addTypingIndicator() {
        const typingId = Date.now();
        const typingDiv = document.createElement('div');
        typingDiv.className = 'bot-message typing-indicator';
        typingDiv.id = `typing-${typingId}`;
        
        const timestampSpan = document.createElement('span');
        timestampSpan.className = 'timestamp';
        timestampSpan.textContent = '[BOT]';
        
        const messageSpan = document.createElement('span');
        messageSpan.className = 'message';
        messageSpan.innerHTML = 'Bot is thinking <span class="loading"></span>';
        
        typingDiv.appendChild(timestampSpan);
        typingDiv.appendChild(messageSpan);
        
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
        
        return typingId;
    }
    
    removeTypingIndicator(typingId) {
        const typingElement = document.getElementById(`typing-${typingId}`);
        if (typingElement) {
            typingElement.remove();
        }
    }
    
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    async getBotResponse(userMessage) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        // Get relevant memories for context
        const relevantMemories = this.getRelevantMemories(userMessage);
        
        // Generate response based on memories and conversation
        return this.generateResponse(userMessage, relevantMemories);
    }
    
    getRelevantMemories(query) {
        if (this.memories.length === 0) {
            return [];
        }
        
        // Simple keyword matching for relevance
        const queryWords = query.toLowerCase().split(' ');
        const relevantMemories = this.memories.filter(memory => {
            const memoryWords = memory.text.toLowerCase().split(' ');
            return queryWords.some(word => 
                memoryWords.some(memoryWord => 
                    memoryWord.includes(word) || word.includes(memoryWord)
                )
            );
        });
        
        // Return up to 3 most relevant memories
        return relevantMemories.slice(0, 3);
    }
    
    generateResponse(userMessage, relevantMemories) {
        const responses = [
            "That's interesting! Let me think about that...",
            "I see what you mean. Based on what I remember...",
            "That reminds me of something you told me before...",
            "I understand. Let me connect this to our previous conversations...",
            "That's a great point! I recall you mentioning...",
            "Interesting perspective! I remember when you said...",
            "I see the connection to what we discussed earlier...",
            "That makes sense, especially considering...",
            "I appreciate you sharing that. It relates to...",
            "That's helpful context! I remember you telling me..."
        ];
        
        let response = responses[Math.floor(Math.random() * responses.length)];
        
        // If we have relevant memories, incorporate them
        if (relevantMemories.length > 0) {
            const memoryText = relevantMemories[0].text;
            const memoryPreview = memoryText.length > 100 
                ? memoryText.substring(0, 100) + '...' 
                : memoryText;
            
            response += ` I remember you telling me: "${memoryPreview}"`;
            
            if (relevantMemories.length > 1) {
                response += ` And also: "${relevantMemories[1].text.substring(0, 80)}..."`;
            }
        } else if (this.memories.length > 0) {
            // If no specific relevant memories, reference general memory
            response += ` I have ${this.memories.length} memories stored, but I'm still learning to connect them better to our conversations.`;
        } else {
            response += " I don't have any memories stored yet, but I'm ready to learn!";
        }
        
        // Add contextual response based on message content
        if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
            response = "Hello! I'm your memory bot. I remember our conversations and the memories you've shared with me.";
        } else if (userMessage.toLowerCase().includes('memory') || userMessage.toLowerCase().includes('remember')) {
            response = `I currently have ${this.memories.length} memories stored. ${response}`;
        } else if (userMessage.toLowerCase().includes('help')) {
            response = "I'm here to chat with you using the memories you've added above. Just type naturally and I'll try to connect our conversation to your stored memories!";
        }
        
        return response;
    }
}

// Initialize the bot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MemoryBot();
});

// Add some keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl+M to focus memory input
    if (e.ctrlKey && e.key === 'm') {
        e.preventDefault();
        document.getElementById('memoryInput').focus();
    }
    
    // Ctrl+L to focus chat input
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        document.getElementById('chatInput').focus();
    }
});

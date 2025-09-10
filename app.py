#!/usr/bin/env python3
"""
Monster Meme Memory - Flask Backend with Mem0 Integration
A retro internet-inspired memory bot with intelligent memory management
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Mem0 configuration
try:
    from mem0 import Memory
    MEM0_AVAILABLE = True
    logger.info("Mem0 imported successfully")
except ImportError:
    MEM0_AVAILABLE = False
    logger.warning("Mem0 not available - using fallback mode")

# Initialize Mem0
if MEM0_AVAILABLE:
    try:
        # Configure Mem0 with OpenAI (you'll need to set OPENAI_API_KEY)
        memory = Memory(
            config={
                "llm": {
                    "provider": "openai",
                    "config": {
                        "model": "gpt-3.5-turbo",
                        "temperature": 0.1,
                    }
                },
                "embedder": {
                    "provider": "openai",
                    "config": {
                        "model": "text-embedding-ada-002"
                    }
                }
            }
        )
        logger.info("Mem0 initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize Mem0: {e}")
        MEM0_AVAILABLE = False

# Fallback memory storage for when Mem0 is not available
fallback_memories = []

@app.route('/')
def serve_index():
    """Serve the main HTML file"""
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files"""
    return send_from_directory('.', filename)

@app.route('/api/memories', methods=['POST'])
def add_memory():
    """Add a new memory using Mem0"""
    try:
        data = request.get_json()
        memory_text = data.get('text', '').strip()
        
        if not memory_text:
            return jsonify({'error': 'Memory text is required'}), 400
        
        if MEM0_AVAILABLE:
            # Use Mem0 to add memory
            result = memory.add(memory_text)
            logger.info(f"Added memory via Mem0: {result}")
            
            return jsonify({
                'success': True,
                'message': 'Memory added successfully',
                'memory_id': result.get('id'),
                'total_memories': len(memory.get_all())
            })
        else:
            # Fallback mode
            memory_id = f"fallback_{datetime.now().timestamp()}"
            fallback_memories.append({
                'id': memory_id,
                'text': memory_text,
                'timestamp': datetime.now().isoformat()
            })
            
            return jsonify({
                'success': True,
                'message': 'Memory added (fallback mode)',
                'memory_id': memory_id,
                'total_memories': len(fallback_memories)
            })
            
    except Exception as e:
        logger.error(f"Error adding memory: {e}")
        return jsonify({'error': 'Failed to add memory'}), 500

@app.route('/api/memories', methods=['GET'])
def get_memories():
    """Get all memories"""
    try:
        if MEM0_AVAILABLE:
            memories = memory.get_all()
            return jsonify({
                'success': True,
                'memories': memories,
                'total': len(memories)
            })
        else:
            return jsonify({
                'success': True,
                'memories': fallback_memories,
                'total': len(fallback_memories)
            })
    except Exception as e:
        logger.error(f"Error getting memories: {e}")
        return jsonify({'error': 'Failed to get memories'}), 500

@app.route('/api/search', methods=['POST'])
def search_memories():
    """Search memories using Mem0"""
    try:
        data = request.get_json()
        query = data.get('query', '').strip()
        
        if not query:
            return jsonify({'error': 'Search query is required'}), 400
        
        if MEM0_AVAILABLE:
            # Use Mem0 to search memories
            results = memory.search(query, limit=5)
            logger.info(f"Search results: {len(results)} memories found")
            
            return jsonify({
                'success': True,
                'query': query,
                'results': results,
                'count': len(results)
            })
        else:
            # Fallback search
            query_words = query.lower().split()
            matching_memories = []
            
            for memory_item in fallback_memories:
                memory_words = memory_item['text'].lower().split()
                if any(word in memory_words for word in query_words):
                    matching_memories.append(memory_item)
            
            return jsonify({
                'success': True,
                'query': query,
                'results': matching_memories[:5],
                'count': len(matching_memories)
            })
            
    except Exception as e:
        logger.error(f"Error searching memories: {e}")
        return jsonify({'error': 'Failed to search memories'}), 500

@app.route('/api/chat', methods=['POST'])
def chat_with_bot():
    """Chat with the bot using Mem0 for context"""
    try:
        data = request.get_json()
        user_message = data.get('message', '').strip()
        
        if not user_message:
            return jsonify({'error': 'Message is required'}), 400
        
        if MEM0_AVAILABLE:
            # Search for relevant memories
            relevant_memories = memory.search(user_message, limit=3)
            
            # Generate response using Mem0's context
            context_memories = [mem.get('memory', '') for mem in relevant_memories]
            
            # Create a more intelligent response
            if context_memories:
                response = f"I remember you telling me: \"{context_memories[0][:100]}{'...' if len(context_memories[0]) > 100 else ''}\""
                if len(context_memories) > 1:
                    response += f" I also recall: \"{context_memories[1][:80]}{'...' if len(context_memories[1]) > 80 else ''}\""
            else:
                response = "I don't have specific memories about that topic, but I'm here to learn! Tell me more about it."
            
            # Add contextual response based on message content
            if any(word in user_message.lower() for word in ['hello', 'hi', 'hey']):
                response = f"Hello! I'm your memory bot. I have {len(memory.get_all())} memories stored and I'm ready to chat!"
            elif any(word in user_message.lower() for word in ['memory', 'remember', 'recall']):
                response = f"I currently have {len(memory.get_all())} memories stored. {response}"
            elif any(word in user_message.lower() for word in ['help', 'what', 'how']):
                response = "I'm here to chat with you using the memories you've added. I can search through them and reference relevant information in our conversations!"
            
            return jsonify({
                'success': True,
                'response': response,
                'relevant_memories': len(relevant_memories),
                'total_memories': len(memory.get_all())
            })
            
        else:
            # Fallback response
            return jsonify({
                'success': True,
                'response': "I'm in fallback mode - Mem0 is not available. Please install mem0ai and set up your OpenAI API key for full functionality.",
                'relevant_memories': 0,
                'total_memories': len(fallback_memories)
            })
            
    except Exception as e:
        logger.error(f"Error in chat: {e}")
        return jsonify({'error': 'Failed to process chat message'}), 500

@app.route('/api/status', methods=['GET'])
def get_status():
    """Get system status"""
    return jsonify({
        'mem0_available': MEM0_AVAILABLE,
        'total_memories': len(memory.get_all()) if MEM0_AVAILABLE else len(fallback_memories),
        'status': 'running'
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('DEBUG', 'False').lower() == 'true'
    
    logger.info(f"Starting Monster Meme Memory server on port {port}")
    logger.info(f"Mem0 available: {MEM0_AVAILABLE}")
    
    app.run(host='0.0.0.0', port=port, debug=debug)

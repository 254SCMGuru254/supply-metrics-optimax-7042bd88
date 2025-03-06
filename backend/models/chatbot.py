"""
Supply Chain Chatbot NLP Module
100% free and open-source implementation
Uses lightweight NLP libraries with no API dependencies
"""
import os
import re
import json
import logging
import random
import string
import threading
import time
from typing import Dict, List, Any, Tuple, Optional, Union
from pathlib import Path

# Import free NLP libraries that run locally
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import numpy as np

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("chatbot")

# Download required NLTK resources if not already present
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('corpora/stopwords')
    nltk.data.find('corpora/wordnet')
except LookupError:
    # Download required NLTK data
    nltk.download('punkt', quiet=True)
    nltk.download('stopwords', quiet=True)
    nltk.download('wordnet', quiet=True)

class SupplyChainChatbot:
    """
    Simple intent-based chatbot for supply chain domain
    100% free and open-source implementation
    No external API dependencies
    """
    
    def __init__(self, knowledge_base_path: Optional[str] = None):
        """
        Initialize the chatbot with domain-specific knowledge
        
        Args:
            knowledge_base_path: Path to JSON knowledge base (optional)
        """
        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = set(stopwords.words('english'))
        
        # Initialize knowledge base with default data
        self.knowledge_base = self._get_default_knowledge_base()
        
        # Load custom knowledge base if provided
        if knowledge_base_path:
            self._load_knowledge_base(knowledge_base_path)
        
        # Prepare intents data for matching
        self._prepare_intent_data()
        
        logger.info("Supply Chain Chatbot initialized")
    
    def _get_default_knowledge_base(self) -> Dict:
        """Return default knowledge base with Kenyan supply chain domain intents"""
        return {
            "intents": [
                {
                    "tag": "greeting",
                    "patterns": [
                        "Hi", "Hello", "Hey", "Greetings", "Good day", "How are you"
                    ],
                    "responses": [
                        "Hello! How can I help with your supply chain needs?",
                        "Hi there! How can I assist with your logistics planning?",
                        "Hello, welcome to Supply Metrics Optimax. How can I help you today?"
                    ]
                },
                {
                    "tag": "goodbye",
                    "patterns": [
                        "Bye", "See you", "Goodbye", "I'm leaving", "Have a good day", "Quit"
                    ],
                    "responses": [
                        "Goodbye, thank you for using Supply Metrics Optimax!",
                        "Have a great day! Feel free to return if you need more assistance."
                    ]
                },
                {
                    "tag": "thanks",
                    "patterns": [
                        "Thank you", "Thanks", "That's helpful", "Appreciate it", "Asante"
                    ],
                    "responses": [
                        "You're welcome!", 
                        "Happy to help!",
                        "Karibu! (You're welcome in Swahili)"
                    ]
                },
                {
                    "tag": "route_optimization",
                    "patterns": [
                        "How can I optimize routes?", 
                        "Find best delivery paths",
                        "Route planning",
                        "Shortest path between locations",
                        "Optimize transportation",
                        "Delivery route",
                        "Efficient routes",
                        "Save fuel on deliveries"
                    ],
                    "responses": [
                        "For route optimization, go to the 'Route Optimizer' tab and add your locations. Our system uses OR-Tools to calculate the most efficient delivery sequence.",
                        "You can optimize routes by entering your start location, destinations, and vehicle constraints in the Route Optimizer. The system will minimize distance and time.",
                        "Our route optimization tools can help reduce transportation costs by 15-30% on average for Kenyan logistics operations."
                    ]
                },
                {
                    "tag": "facility_location",
                    "patterns": [
                        "Where should I place my warehouse?",
                        "Best location for distribution center",
                        "Facility placement",
                        "Optimal warehouse locations",
                        "Where to build depot",
                        "Strategic location planning",
                        "Best location for cold storage"
                    ],
                    "responses": [
                        "To find optimal facility locations, use our 'Facility Locator' module. The system analyzes demand points, travel distances, and existing infrastructure to recommend strategic locations.",
                        "Our facility location optimizer uses p-median algorithms to balance accessibility, cost, and coverage for your Kenyan distribution network.",
                        "For agricultural storage facilities, we recommend analyzing proximity to farms, major roads, and electricity access. Our system can help optimize these factors."
                    ]
                },
                {
                    "tag": "demand_forecasting",
                    "patterns": [
                        "How much inventory should I stock?",
                        "Predict future demand",
                        "Sales forecasting",
                        "Demand prediction",
                        "How to forecast agricultural demand",
                        "Seasonal predictions",
                        "Market demand changes"
                    ],
                    "responses": [
                        "Our demand forecasting tool uses time series analysis to predict future demand patterns. Upload your historical data in the 'Forecasting' section for accurate predictions.",
                        "For Kenyan agricultural products, our system accounts for seasonal variations, weather patterns, and market trends for more accurate forecasts.",
                        "Try our Prophet-based forecasting tool to account for weekly, monthly, and yearly seasonality in your demand patterns."
                    ]
                },
                {
                    "tag": "kenyan_market",
                    "patterns": [
                        "Kenya supply chain challenges",
                        "Logistics in Kenya",
                        "Nairobi distribution",
                        "Rural delivery in Kenya",
                        "Farm to market supply chain",
                        "Last mile delivery Kenya"
                    ],
                    "responses": [
                        "We specialize in Kenyan logistics optimization, accounting for local road conditions, traffic patterns, and infrastructure challenges.",
                        "For rural Kenyan deliveries, our system recommends multi-modal transportation strategies, combining main routes with motorcycle deliveries for last-mile service.",
                        "Our farm-to-market optimization helps minimize post-harvest losses by identifying the fastest routes from farms to collection centers and markets."
                    ]
                },
                {
                    "tag": "resilience",
                    "patterns": [
                        "How to make supply chain resilient", 
                        "Disaster preparedness",
                        "Alternative routes",
                        "Supply chain disruption",
                        "Risk mitigation",
                        "Network redundancy",
                        "Backup planning"
                    ],
                    "responses": [
                        "Use our 'Resilience Analyzer' to identify weak points in your network and develop contingency plans for disruptions.",
                        "We recommend creating a diversified network with multiple suppliers and routes. Our optimization algorithms can suggest the optimal level of redundancy.",
                        "Run disruption simulations in our platform to stress-test your supply chain and improve preparedness for weather events or road closures."
                    ]
                },
                {
                    "tag": "data_expiry",
                    "patterns": [
                        "Will my data be saved?",
                        "Data retention policy",
                        "Data deletion",
                        "How long is data kept",
                        "Data storage time",
                        "Will I lose my data"
                    ],
                    "responses": [
                        "To provide this service for free, we automatically delete inactive user data after 1 hour. Please export any results you want to keep.",
                        "Your data will be automatically removed after 1 hour of inactivity. This helps us keep the service free for everyone.",
                        "We don't permanently store your data. It will be deleted after 1 hour of inactivity to protect your privacy and keep our service free."
                    ]
                },
                {
                    "tag": "fallback",
                    "patterns": [],
                    "responses": [
                        "I'm not sure I understand. Could you rephrase that?",
                        "I'm still learning about supply chains. Could you ask differently?",
                        "I don't have information on that yet. Would you like to know about route optimization, facility location, or demand forecasting instead?"
                    ]
                }
            ]
        }
    
    def _load_knowledge_base(self, file_path: str) -> None:
        """Load knowledge base from JSON file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                self.knowledge_base = json.load(f)
            logger.info(f"Loaded knowledge base from {file_path}")
        except Exception as e:
            logger.error(f"Error loading knowledge base: {str(e)}")
            
    def _prepare_intent_data(self) -> None:
        """Prepare intent data for pattern matching"""
        # Prepare patterns for each intent
        self.intent_patterns = {}
        
        for intent in self.knowledge_base["intents"]:
            tag = intent["tag"]
            patterns = intent["patterns"]
            
            # Process each pattern
            processed_patterns = []
            for pattern in patterns:
                processed = self._preprocess_text(pattern)
                if processed:  # Only add if not empty after preprocessing
                    processed_patterns.append(processed)
            
            self.intent_patterns[tag] = processed_patterns
    
    def _preprocess_text(self, text: str) -> List[str]:
        """
        Preprocess text by tokenizing, removing stop words, and lemmatizing
        
        Args:
            text: Input text to preprocess
            
        Returns:
            List of preprocessed tokens
        """
        # Tokenize and convert to lowercase
        tokens = word_tokenize(text.lower())
        
        # Remove punctuation and stop words, then lemmatize
        tokens = [self.lemmatizer.lemmatize(token) for token in tokens 
                 if token.isalnum() and token not in self.stop_words]
        
        return tokens
    
    def _calculate_similarity(self, tokens1: List[str], tokens2: List[str]) -> float:
        """
        Calculate similarity between two token lists using Jaccard similarity
        
        Args:
            tokens1: First list of tokens
            tokens2: Second list of tokens
            
        Returns:
            Similarity score between 0 and 1
        """
        # Convert to sets for Jaccard similarity
        set1 = set(tokens1)
        set2 = set(tokens2)
        
        # Calculate Jaccard similarity: intersection / union
        if not set1 or not set2:
            return 0.0
        
        intersection = len(set1.intersection(set2))
        union = len(set1.union(set2))
        
        return intersection / union if union > 0 else 0.0
    
    def _get_intent(self, tokens: List[str]) -> str:
        """Determine the intent based on preprocessed tokens"""
        best_score = 0.0
        best_intent = "fallback"
        
        for intent, patterns in self.intent_patterns.items():
            for pattern in patterns:
                similarity = self._calculate_similarity(tokens, pattern)
                
                if similarity > best_score:
                    best_score = similarity
                    best_intent = intent
        
        # Check if the confidence meets a minimum threshold
        if best_score < 0.1:  # Low confidence threshold
            return "fallback"
            
        return best_intent
    
    def get_response(self, user_input: str) -> Dict[str, Any]:
        """
        Process user input and return an appropriate response
        
        Args:
            user_input: User's message as a string
            
        Returns:
            Dictionary with response text and metadata
        """
        # Preprocess the input
        processed_input = self._preprocess_text(user_input)
        
        # Get the intent
        intent = self._get_intent(processed_input)
        
        # Find the corresponding responses
        for intent_data in self.knowledge_base["intents"]:
            if intent_data["tag"] == intent:
                responses = intent_data["responses"]
                selected_response = random.choice(responses)
                
                return {
                    "text": selected_response,
                    "intent": intent,
                    "confidence": 1.0 if intent != "fallback" else 0.5
                }
        
        # Fallback if intent not found in knowledge base
        return {
            "text": "I'm not sure how to respond to that. Could you ask something about route optimization or facility location?",
            "intent": "fallback",
            "confidence": 0.0
        }
    
    def get_context_response(self, user_input: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Get response with context awareness
        
        Args:
            user_input: User's message
            context: Previous conversation context
            
        Returns:
            Response with updated context
        """
        context = context or {"history": []}
        
        # Get basic response
        response = self.get_response(user_input)
        
        # Update context with current interaction
        context["history"].append({
            "user": user_input,
            "bot": response["text"],
            "intent": response["intent"],
            "timestamp": time.time()
        })
        
        # Limit context history to last 5 interactions
        if len(context["history"]) > 5:
            context["history"] = context["history"][-5:]
        
        # Add context to response
        response["context"] = context
        
        return response

    def train_on_additional_data(self, new_examples: List[Dict[str, Any]]) -> None:
        """
        Add new training examples to the chatbot
        
        Args:
            new_examples: List of dictionaries with 'tag', 'pattern', and 'response' keys
        """
        # Process new examples
        for example in new_examples:
            tag = example.get("tag")
            pattern = example.get("pattern")
            response = example.get("response")
            
            if not tag or not pattern or not response:
                continue
                
            # Find if intent already exists
            intent_exists = False
            for intent in self.knowledge_base["intents"]:
                if intent["tag"] == tag:
                    # Add pattern if not already there
                    if pattern not in intent["patterns"]:
                        intent["patterns"].append(pattern)
                    
                    # Add response if not already there
                    if response not in intent["responses"]:
                        intent["responses"].append(response)
                        
                    intent_exists = True
                    break
            
            # Create new intent if it doesn't exist
            if not intent_exists:
                self.knowledge_base["intents"].append({
                    "tag": tag,
                    "patterns": [pattern],
                    "responses": [response]
                })
        
        # Rebuild intent patterns
        self._prepare_intent_data()

# Create a singleton instance
chatbot = SupplyChainChatbot()

def get_chatbot_response(user_input: str, context: Dict = None) -> Dict:
    """Helper function to get response from the chatbot"""
    return chatbot.get_context_response(user_input, context)

# Example usage
if __name__ == "__main__":
    # Simple interactive test
    print("Supply Chain Chatbot (type 'quit' to exit)")
    print("------------------------------------------")
    
    context = {"history": []}
    
    while True:
        user_input = input("You: ")
        if user_input.lower() in ['quit', 'exit', 'bye']:
            break
            
        response = chatbot.get_context_response(user_input, context)
        print(f"Bot: {response['text']}")


import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/utils/i18n";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define types for messages
type MessageRole = "user" | "assistant";
type Language = "en" | "sw";

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  language?: Language;
}

export const SupplyChainChatbot = () => {
  const { language: appLanguage, setLanguage } = useI18n();
  const [chatLanguage, setChatLanguage] = useState<Language>(appLanguage as Language);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: chatLanguage === "en" 
        ? "Hello! I'm your Kenyan Supply Chain Assistant. How can I help you optimize your logistics operations today?"
        : "Habari! Mimi ni Msaidizi wa Mnyororo wa Ugavi wa Kenya. Nawezaje kukusaidia kuboresha shughuli zako za usafirishaji leo?",
      timestamp: new Date(),
      language: chatLanguage
    }
  ]);
  const [input, setInput] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [modelLoaded, setModelLoaded] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const questionAnsweringRef = useRef<any>(null);

  // Common supply chain knowledge in English
  const kenyaSupplyChainContextEn = `
    Kenya is a key logistics hub in East Africa with major transport corridors including the Northern Corridor.
    The Port of Mombasa is Kenya's primary maritime gateway handling over 30 million tons annually.
    Kenya's key distribution centers are located in Nairobi, Mombasa, Kisumu, Nakuru, and Eldoret.
    Kenya has developed the Standard Gauge Railway (SGR) connecting Mombasa to Nairobi and Naivasha.
    Common logistics challenges in Kenya include infrastructure gaps, traffic congestion, and security concerns.
    Kenya's major agricultural exports include tea, coffee, flowers, and fresh produce requiring specialized cold chains.
    The Kenya Revenue Authority handles customs clearance through the Integrated Customs Management System.
    Key trade corridors connect Kenya to Uganda, Rwanda, South Sudan, Ethiopia, and Tanzania.
    KES (Kenyan Shilling) is the currency used for local transactions, with an average exchange rate of approximately 100 KES to 1 USD.
    Last-mile delivery in Kenya often relies on motorcycles (boda bodas) in urban areas.
    Kenya's digital payment platform M-Pesa has revolutionized financial transactions in the supply chain.
  `;

  // Common supply chain knowledge in Swahili
  const kenyaSupplyChainContextSw = `
    Kenya ni kitovu muhimu cha usafirishaji Afrika Mashariki na njia kuu za usafirishaji zikiwemo Ukanda wa Kaskazini.
    Bandari ya Mombasa ni lango kuu la bahari la Kenya ambalo linahudumia zaidi ya tani milioni 30 kila mwaka.
    Vituo vikuu vya usambazaji vya Kenya viko Nairobi, Mombasa, Kisumu, Nakuru, na Eldoret.
    Kenya imeendeleza Reli ya Kiwango cha Kimataifa (SGR) inayounganisha Mombasa na Nairobi na Naivasha.
    Changamoto za kawaida za usafirishaji nchini Kenya ni pamoja na mianya ya miundombinu, msongamano wa magari, na wasiwasi wa usalama.
    Mauzo makuu ya kilimo ya Kenya yanajumuisha chai, kahawa, maua, na matunda na mboga mboga yanayohitaji minyororo baridi maalum.
    Mamlaka ya Mapato ya Kenya inahudumia uthibitishaji wa forodha kupitia Mfumo Jumuishi wa Usimamizi wa Forodha.
    Njia kuu za biashara zinaiunganisha Kenya na Uganda, Rwanda, Sudan Kusini, Ethiopia, na Tanzania.
    KES (Shilingi ya Kenya) ni sarafu inayotumika kwa shughuli za ndani, kwa wastani wa kubadilishana wa takriban shilingi 100 kwa dola 1 ya Marekani.
    Usafirishaji wa mwisho nchini Kenya mara nyingi hutegemea pikipiki (boda boda) katika maeneo ya mijini.
    Jukwaa la malipo ya dijitali la Kenya M-Pesa limebadilisha shughuli za kifedha katika mnyororo wa ugavi.
  `;

  // Get context based on current language
  const getContextByLanguage = () => {
    return chatLanguage === "en" ? kenyaSupplyChainContextEn : kenyaSupplyChainContextSw;
  };

  // Update welcome message when language changes
  useEffect(() => {
    const welcomeMessage = {
      id: "welcome",
      role: "assistant" as MessageRole,
      content: chatLanguage === "en" 
        ? "Hello! I'm your Kenyan Supply Chain Assistant. How can I help you optimize your logistics operations today?"
        : "Habari! Mimi ni Msaidizi wa Mnyororo wa Ugavi wa Kenya. Nawezaje kukusaidia kuboresha shughuli zako za usafirishaji leo?",
      timestamp: new Date(),
      language: chatLanguage
    };
    
    setMessages([welcomeMessage]);
  }, [chatLanguage]);

  // Load the model on component mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log("Loading question-answering model...");
        // Dynamically import to avoid build errors
        if (typeof window !== 'undefined') {
          import('@huggingface/transformers').then(({ pipeline }) => {
            // Use a small question-answering model suitable for browser
            pipeline(
              "question-answering",
              "distilbert-base-cased-distilled-squad",
              { revision: "v1" }
            ).then(model => {
              questionAnsweringRef.current = model;
              console.log("Model loaded successfully");
              setModelLoaded(true);
            });
          }).catch(err => {
            console.error("Error importing transformers:", err);
          });
        }
      } catch (error) {
        console.error("Error loading model:", error);
      }
    };

    loadModel();
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Detect language of user input
  const detectLanguage = (text: string): Language => {
    // Simple language detection based on common Swahili words
    const swahiliWords = [
      'habari', 'jambo', 'kwaheri', 'asante', 'pole', 'ndiyo', 'hapana',
      'tafadhali', 'karibu', 'nini', 'wewe', 'mimi', 'sisi', 'ninyi',
      'wao', 'hapa', 'kule', 'ndani', 'nje', 'juu', 'chini', 'na',
      'ya', 'wa', 'za', 'la', 'kwa', 'kutoka', 'mpaka', 'sasa',
      'leo', 'kesho', 'jana', 'asubuhi', 'mchana', 'jioni', 'usiku'
    ];
    
    const words = text.toLowerCase().split(/\s+/);
    const swahiliWordCount = words.filter(word => swahiliWords.includes(word)).length;
    
    // If at least 15% of words are Swahili, treat as Swahili
    return swahiliWordCount / words.length > 0.15 ? 'sw' : 'en';
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return;

    const detectedLanguage = detectLanguage(input);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
      language: detectedLanguage
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);

    try {
      let responseContent = "";
      const responseLanguage = detectedLanguage || chatLanguage;

      // Use the loaded model to answer the question
      if (modelLoaded && questionAnsweringRef.current) {
        const result = await questionAnsweringRef.current({
          question: input,
          context: getContextByLanguage(),
        });
        
        // Format the response based on detected language
        if (result.score > 0.1) {
          responseContent = result.answer;
        } else {
          responseContent = responseLanguage === 'en' 
            ? "I don't have enough information about that specific aspect of Kenyan supply chains. Can I help with something else?"
            : "Sina taarifa za kutosha kuhusu kipengele hicho mahususi cha minyororo ya ugavi ya Kenya. Naweza kusaidia na jambo lingine?";
        }
      } else {
        responseContent = responseLanguage === 'en'
          ? "I'm still loading my knowledge about Kenyan supply chains. Please try again in a moment."
          : "Ningali napakia maarifa yangu kuhusu minyororo ya ugavi ya Kenya. Tafadhali jaribu tena baada ya muda mfupi.";
      }

      // Add assistant's response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
        language: responseLanguage
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error processing message:", error);
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: chatLanguage === 'en'
          ? "Sorry, I encountered an error processing your question. Please try again."
          : "Samahani, nimekumbana na hitilafu katika kuchakata swali lako. Tafadhali jaribu tena.",
        timestamp: new Date(),
        language: chatLanguage
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLanguageChange = (value: string) => {
    const newLanguage = value as Language;
    setChatLanguage(newLanguage);
    setLanguage(newLanguage);
  };

  return (
    <Card className="flex flex-col h-[600px] w-full">
      <div className="p-4 bg-primary/10 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Kenya Supply Chain Assistant</h2>
            <p className="text-sm text-muted-foreground">
              {chatLanguage === 'en' 
                ? "Ask questions about Kenyan logistics, optimization, and supply chain management" 
                : "Uliza maswali kuhusu usafirishaji wa Kenya, uboreshaji, na usimamizi wa mnyororo wa ugavi"}
            </p>
          </div>
          <Select value={chatLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[100px]">
              <Globe className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="sw">Kiswahili</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <div className="flex justify-between items-center text-xs opacity-70 mt-1">
                <span>{message.timestamp.toLocaleTimeString()}</span>
                {message.language && (
                  <span className="ml-2 px-1.5 py-0.5 bg-background/50 rounded-sm">
                    {message.language === 'en' ? 'EN' : 'SW'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={chatLanguage === 'en'
              ? "Ask about Kenyan supply chains, logistics, or optimization..."
              : "Uliza kuhusu minyororo ya ugavi ya Kenya, usafirishaji, au uboreshaji..."}
            className="min-h-[60px] flex-1"
            disabled={isProcessing || !modelLoaded}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isProcessing || !modelLoaded}
            className="h-full"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        {!modelLoaded && (
          <p className="text-sm text-muted-foreground mt-2 flex items-center">
            <Loader2 className="h-3 w-3 animate-spin mr-2" />
            {chatLanguage === 'en'
              ? "Loading Kenyan supply chain knowledge..."
              : "Inapakia maarifa ya mnyororo wa ugavi wa Kenya..."}
          </p>
        )}
      </div>
    </Card>
  );
};


import { SupplyChainChatbot } from "@/components/chatbot/SupplyChainChatbot";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquareQuote, BookOpen, FileText, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/utils/i18n";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ChatAssistant = () => {
  const { language, setLanguage, t } = useI18n();
  
  const sampleQuestions = {
    en: [
      "What are the main logistics corridors in Kenya?",
      "How does the Standard Gauge Railway impact supply chains?",
      "What are common challenges in Kenyan last-mile delivery?",
      "How do seasonal weather patterns affect Kenyan supply chains?",
      "What is the role of Mombasa port in East African logistics?",
      "How can I optimize distribution routes in Nairobi?"
    ],
    sw: [
      "Ni njia kuu zipi za usafirishaji nchini Kenya?",
      "Reli ya Kisasa (SGR) inaathiri vipi minyororo ya ugavi?",
      "Ni changamoto zipi za kawaida katika uwasilishaji wa mwisho nchini Kenya?",
      "Misimu ya hali ya hewa inaathiri vipi minyororo ya ugavi ya Kenya?",
      "Bandari ya Mombasa ina jukumu gani katika usafirishaji wa Afrika Mashariki?",
      "Nawezaje kuboresha njia za usambazaji Nairobi?"
    ]
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value as "en" | "sw");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t('chat.title')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('chat.subtitle')}
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[130px]">
              <Globe className="mr-2 h-4 w-4" />
              <SelectValue placeholder={t('chat.language')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="sw">Kiswahili</SelectItem>
            </SelectContent>
          </Select>
          <Link to="/dashboard">
            <Button variant="outline">{language === 'en' ? 'Back to Dashboard' : 'Rudi kwenye Dashibodi'}</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SupplyChainChatbot />
        </div>

        <div className="space-y-6">
          <Card className="p-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <MessageSquareQuote className="h-5 w-5" />
              {language === 'en' ? 'Sample Questions' : 'Maswali ya Mfano'}
            </h3>
            <div className="mt-4 space-y-2">
              {sampleQuestions[language as keyof typeof sampleQuestions].map((question, index) => (
                <Button 
                  key={index} 
                  variant="ghost" 
                  className="w-full justify-start text-left h-auto py-2"
                  onClick={() => {
                    // This would be connected to the chatbot in a real implementation
                    console.log("Sample question selected:", question);
                  }}
                >
                  {question}
                </Button>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {language === 'en' ? 'Assistant Capabilities' : 'Uwezo wa Msaidizi'}
            </h3>
            <ul className="mt-4 space-y-2 list-disc pl-5">
              {language === 'en' ? (
                <>
                  <li>Answer questions about Kenyan logistics</li>
                  <li>Provide information on supply chain optimization</li>
                  <li>Explain Kenyan transportation networks</li>
                  <li>Share best practices for Kenyan distribution</li>
                  <li>Give context on local business regulations</li>
                </>
              ) : (
                <>
                  <li>Kujibu maswali kuhusu usafirishaji wa Kenya</li>
                  <li>Kutoa habari kuhusu uboreshaji wa mnyororo wa ugavi</li>
                  <li>Kuelezea mitandao ya usafiri ya Kenya</li>
                  <li>Kushiriki mazoea bora ya usambazaji nchini Kenya</li>
                  <li>Kutoa muktadha wa kanuni za biashara za mitaa</li>
                </>
              )}
            </ul>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {language === 'en' ? 'Data Sources' : 'Vyanzo vya Data'}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {language === 'en' 
                ? "This assistant uses natural language processing to provide information from trusted sources including Kenya Ports Authority, Kenya National Bureau of Statistics, and academic research on East African logistics."
                : "Msaidizi huu hutumia uchakataji wa lugha asilia kutoa taarifa kutoka vyanzo vya kuaminika ikiwa ni pamoja na Mamlaka ya Bandari ya Kenya, Shirika la Kitaifa la Takwimu la Kenya, na utafiti wa kitaaluma kuhusu usafirishaji wa Afrika Mashariki."}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;

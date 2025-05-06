
import { create } from 'zustand'

type Language = 'en' | 'sw'

interface I18nStore {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Common
    'app.name': 'Supply Metrics Optimax',
    'app.description': 'Supply Chain Optimization for East Africa',
    
    // Navigation
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.analytics': 'Analytics',
    'nav.chat': 'Chat Assistant',
    
    // Supply Chain Terms
    'supply.distribution': 'Distribution Center',
    'supply.warehouse': 'Warehouse',
    'supply.route': 'Route',
    'supply.inventory': 'Inventory',
    'supply.delivery': 'Delivery',
    'supply.lastmile': 'Last-Mile Delivery',
    'supply.coldchain': 'Cold Chain',
    'supply.transport': 'Transport',
    
    // Market Types
    'market.informal': 'Informal Market',
    'market.wholesale': 'Wholesale Market',
    'market.retail': 'Retail Market',
    
    // Locations
    'location.rural': 'Rural Area',
    'location.urban': 'Urban Area',
    'location.market': 'Market',
    
    // Actions
    'action.optimize': 'Optimize',
    'action.analyze': 'Analyze',
    'action.calculate': 'Calculate',
    'action.save': 'Save',
    'action.send': 'Send',
    'action.ask': 'Ask a question',
    
    // Chatbot
    'chat.welcome': 'Hello! I\'m your Kenyan Supply Chain Assistant.',
    'chat.placeholder': 'Ask about Kenyan supply chains, logistics, or optimization...',
    'chat.loading': 'Loading Kenyan supply chain knowledge...',
    'chat.error': 'Sorry, I encountered an error processing your question. Please try again.',
    'chat.no_info': 'I don\'t have enough information about that specific aspect of Kenyan supply chains. Can I help with something else?',
    'chat.title': 'Kenya Supply Chain Assistant',
    'chat.subtitle': 'Ask questions about Kenyan logistics, optimization, and supply chain management',
    'chat.language': 'Language',
  },
  sw: {
    // Common
    'app.name': 'Supply Metrics Optimax',
    'app.description': 'Uboreshaji wa Mnyororo wa Ugavi Afrika Mashariki',
    
    // Navigation
    'nav.home': 'Nyumbani',
    'nav.dashboard': 'Dashibodi',
    'nav.analytics': 'Uchanganuzi',
    'nav.chat': 'Msaidizi wa Mazungumzo',
    
    // Supply Chain Terms
    'supply.distribution': 'Kituo cha Usambazaji',
    'supply.warehouse': 'Ghala',
    'supply.route': 'Njia',
    'supply.inventory': 'Inventori',
    'supply.delivery': 'Uwasilishaji',
    'supply.lastmile': 'Uwasilishaji wa Mwisho',
    'supply.coldchain': 'Mnyororo Baridi',
    'supply.transport': 'Usafiri',
    
    // Market Types
    'market.informal': 'Soko Isiyo Rasmi',
    'market.wholesale': 'Soko la Jumla',
    'market.retail': 'Soko la Rejareja',
    
    // Locations
    'location.rural': 'Eneo la Vijijini',
    'location.urban': 'Eneo la Mjini',
    'location.market': 'Soko',
    
    // Actions
    'action.optimize': 'Boresha',
    'action.analyze': 'Changanua',
    'action.calculate': 'Kokotoa',
    'action.save': 'Hifadhi',
    'action.send': 'Tuma',
    'action.ask': 'Uliza swali',
    
    // Chatbot
    'chat.welcome': 'Habari! Mimi ni Msaidizi wa Mnyororo wa Ugavi wa Kenya.',
    'chat.placeholder': 'Uliza kuhusu minyororo ya ugavi ya Kenya, usafirishaji, au uboreshaji...',
    'chat.loading': 'Inapakia maarifa ya mnyororo wa ugavi wa Kenya...',
    'chat.error': 'Samahani, nimekumbana na hitilafu katika kuchakata swali lako. Tafadhali jaribu tena.',
    'chat.no_info': 'Sina taarifa za kutosha kuhusu kipengele hicho mahususi cha minyororo ya ugavi ya Kenya. Naweza kusaidia na jambo lingine?',
    'chat.title': 'Msaidizi wa Mnyororo wa Ugavi wa Kenya',
    'chat.subtitle': 'Uliza maswali kuhusu usafirishaji wa Kenya, uboreshaji, na usimamizi wa mnyororo wa ugavi',
    'chat.language': 'Lugha',
  }
}

export const useI18n = create<I18nStore>((set) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
  t: (key) => {
    const state = useI18n.getState()
    return translations[state.language][key] || key
  }
}))

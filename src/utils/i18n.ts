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
    
    // Supply Chain Terms
    'supply.distribution': 'Distribution Center',
    'supply.warehouse': 'Warehouse',
    'supply.route': 'Route',
    'supply.inventory': 'Inventory',
    'supply.delivery': 'Delivery',
    
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
  },
  sw: {
    // Common
    'app.name': 'Supply Metrics Optimax',
    'app.description': 'Uboreshaji wa Mnyororo wa Ugavi Afrika Mashariki',
    
    // Navigation
    'nav.home': 'Nyumbani',
    'nav.dashboard': 'Dashibodi',
    'nav.analytics': 'Uchanganuzi',
    
    // Supply Chain Terms
    'supply.distribution': 'Kituo cha Usambazaji',
    'supply.warehouse': 'Ghala',
    'supply.route': 'Njia',
    'supply.inventory': 'Inventory',
    'supply.delivery': 'Uwasilishaji',
    
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
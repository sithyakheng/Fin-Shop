export const dictionaries = {
  en: {
    'app.title': 'Fin Shop — Cambodia Marketplace',
    'app.subtitle':
      'Browse, contact sellers, and pay via social links or QR. Admin handles commissions manually.',
    'cta.browse': 'Browse Products',
    'cta.sell': 'Start Selling',
    'nav.products': 'Products',
    'nav.seller': 'Seller',
    'nav.admin': 'Admin',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',
    'nav.terms': 'Terms',
    'sections.featured': 'Featured Listings',
    'sections.featured_desc': 'Promoted products selected by the admin.',
    'buy.contact': 'Contact Seller / Buy',
    'terms.title': 'Terms of Service',
    'terms.disclaimer':
      'This platform acts only as an intermediary connecting buyers and sellers. All payments, shipping, and product responsibility belong solely to the seller. The platform does not process payments and is not liable for disputes.'
  },
  km: {
    'app.title': 'Fin Shop — ផ្សារទំនើបកម្ពុជា',
    'app.subtitle':
      'រកមើល ទាក់ទងអ្នកលក់ និងបង់ប្រាក់តាមបណ្ដាញសង្គម ឬ QR។ អ্যাডមីនគ្រប់គ្រងកម្រៃជើងសារដោយដៃ។',
    'cta.browse': 'មើលផលិតផល',
    'cta.sell': 'ចាប់ផ្តើមលក់',
    'nav.products': 'ផលិតផល',
    'nav.seller': 'អ្នកលក់',
    'nav.admin': 'អ্যাডមីន',
    'nav.login': 'ចូលគណនី',
    'nav.register': 'បង្កើតគណនី',
    'nav.logout': 'ចាកចេញ',
    'nav.terms': 'ល័ក្ខខណ្ឌ',
    'sections.featured': 'ផលិតផលលេចធ្លោ',
    'sections.featured_desc': 'ផលិតផលដែលបានជ្រើសរើសដោយអ্যাডមីន។',
    'buy.contact': 'ទាក់ទងអ្នកលក់ / ទិញ',
    'terms.title': 'ល័ក្ខខណ្ឌប្រើប្រាស់',
    'terms.disclaimer':
      'វេទិការនេះមានតួនាទីតែជាគន្លងភ្ជាប់អ្នកទិញនិងអ្នកលក់ប៉ុណ្ណោះ។ ការទូទាត់ ការដឹកជញ្ជូន និងទំនួលខុសត្រូវលើផលិតផល ស្ថិតនៅលើអ្នកលក់តែប៉ុណ្ណោះ។ វេទិកាមិនដោះសោចំណាយទូទាត់ទេ និងមិនទទួលខុសត្រូវចំពោះវិវាទឡើយ។'
  }
} as const

export type DictKey = keyof typeof dictionaries['en']

export function getDictionary(lang: 'en' | 'km') {
  return dictionaries[lang]
}

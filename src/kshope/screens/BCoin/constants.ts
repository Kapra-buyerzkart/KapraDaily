export interface InfoSection {
  lang: string;
  title: string;
  body: string;
}

export const INFO_LANGUAGES = [
  { id: 'en', label: 'English' },
  { id: 'ml', label: 'മലയാളം' },
];

export const UD_COIN_TOKEN_INFO: InfoSection[] = [
  {
    lang: 'en',
    title: 'UD Tokens (The "Earn" Points)',
    body: 'Think of UD Tokens as bonus points you collect for helping the community grow.\n\nHow you get them: You earn them when you invite a friend (referral) and also whenever that friend buys something on the platform.\n\nThe Rule: You cannot spend UD Tokens directly to buy things. The exact number of tokens you get for invites or purchases depends on the latest company policies.',
  },
  {
    lang: 'en',
    title: 'UD Coins (The "Cash" Points)',
    body: "UD Coins are like real money sitting in your digital wallet. They have an actual cash value that can change over time.\n\nHow you get them: When you buy products, they often come with a specific UD Token value. If you already have UD Tokens in your account, the platform automatically converts those tokens into UD Coins up to the product's limit.\n\nHow to spend them: You can use UD Coins at checkout to get a direct discount on your shopping or to get discounts on movie/event tickets via the Uden Tickets platform.\n\nExample of How It Works:\n\nScenario A (You have enough tokens): You have 100 UD Tokens. You buy items that offer a total of 30 tokens.\nResult: 30 UD Tokens are converted. You get 30 UD Coins, and your token balance drops by 30. (New Balance: 70 UD Tokens & 30 UD Coins).\n\nScenario B (You run low on tokens): You only have 20 UD Tokens. You buy items that offer 30 tokens.\nResult: Since you only have 20 tokens, only 20 can convert. You get 20 UD Coins, and your UD Tokens become 0.",
  },
  {
    lang: 'ml',
    title: 'UD Tokens (പോയിന്റുകൾ)',
    body: 'UD Tokens എന്നത് നിങ്ങൾ സുഹൃത്തുക്കളെ ഈ പ്ലാറ്റ്‌ഫോമിലേക്ക് കൊണ്ടുവരുമ്പോൾ ലഭിക്കുന്ന ബോണസ് പോയിന്റുകളാണ്.\n\nഎങ്ങനെ ലഭിക്കും: നിങ്ങൾ ഒരു സുഹൃത്തിനെ ഇൻവൈറ്റ് ചെയ്യുമ്പോഴും (Referral), ആ സുഹൃത്ത് ഈ പ്ലാറ്റ്‌ഫോമിൽ നിന്ന് എന്തെങ്കിലും സാധനങ്ങൾ വാങ്ങുമ്പോഴും നിങ്ങൾക്ക് UD Tokens ലഭിക്കും.\n\nപ്രത്യേകത: കമ്പനിയുടെ തീരുമാനങ്ങൾക്ക് വിധേയമായായിരിക്കും എത്ര ടോക്കൺ ലഭിക്കുമെന്ന് നിശ്ചയിക്കുന്നത്. ഈ ടോക്കണുകൾ ഉപയോഗിച്ച് നിങ്ങൾക്ക് നേരിട്ട് സാധനങ്ങൾ വാങ്ങാൻ കഴിയില്ല.',
  },
  {
    lang: 'ml',
    title: 'UD Coins (പണത്തിന് തുല്യമായ കോയിനുകൾ)',
    body: 'UD Coins എന്നാൽ നിങ്ങളുടെ വാലറ്റിലുള്ള യഥാർത്ഥ പണം പോലെയാണ്. ഇതിന് കൃത്യമായ ഒരു മൂല്യമുണ്ട് (ഇത് മാറിക്കൊണ്ടിരിക്കാം).\n\nഎങ്ങനെ ലഭിക്കും: നിങ്ങൾ ഓരോ പ്രൊഡക്റ്റ് വാങ്ങുമ്പോഴും അതിനോടൊപ്പം ചില ടോക്കൺ മൂല്യങ്ങൾ ഉണ്ടാകും. നിങ്ങളുടെ കയ്യിൽ ആവശ്യത്തിന് UD Tokens ഉണ്ടെങ്കിൽ, അത് UD Coins ആയി മാറും.\n\nഎങ്ങനെ ഉപയോഗിക്കാം: സാധനങ്ങൾ വാങ്ങുമ്പോൾ ബില്ലിൽ ഡിസ്‌കൗണ്ട് (കിഴിവ്) ലഭിക്കാനായി ഈ കോയിനുകൾ ഉപയോഗിക്കാം. കൂടാതെ Uden Tickets പ്ലാറ്റ്‌ഫോമിൽ നിന്ന് ടിക്കറ്റുകൾ എടുക്കുമ്പോഴും ഡിസ്‌കൗണ്ടിനായി ഇത് ഉപയോഗിക്കാവുന്നതാണ്.\n\nഇത് എങ്ങനെയെന്ന് ഒരു ഉദാഹരണത്തിലൂടെ മനസ്സിലാക്കാം:\n\nഉദാഹരണം 1: നിങ്ങളുടെ കയ്യിൽ 100 UD Tokens ഉണ്ട്. നിങ്ങൾ വാങ്ങിയ സാധനങ്ങൾക്ക് ആകെ 30 ടോക്കണിന്റെ അർഹതയുണ്ട്.\nബാക്കി വരുന്നത്: നിങ്ങളുടെ 30 ടോക്കണുകൾ കുറയുകയും പകരം 30 UD Coins നിങ്ങൾക്ക് ലഭിക്കുകയും ചെയ്യും. (ഇപ്പോൾ നിങ്ങളുടെ കയ്യിൽ 70 UD Tokens-ഉം 30 UD Coins-ഉം ഉണ്ടാകും).\n\nഉദാഹരണം 2: നിങ്ങളുടെ കയ്യിൽ 20 UD Tokens മാത്രമേ ഉള്ളൂ. എന്നാൽ നിങ്ങൾ വാങ്ങിയ സാധനങ്ങൾക്ക് 30 ടോക്കൺ ആവശ്യമുണ്ട്.\nബാക്കി വരുന്നത്: നിങ്ങളുടെ കയ്യിൽ 20 ടോക്കൺ ഉള്ളതുകൊണ്ട് 20 UD Coins മാത്രമേ ലഭിക്കൂ. നിങ്ങളുടെ UD Token ബാലൻസ് 0 ആയി മാറുകയും ചെയ്യും.',
  },
];

export const REDEEM_METHODS = [
  {
    id: 'bank' as const,
    label: 'Bank Transfer',
    caption: 'To your linked account',
    icon: 'account-balance',
  },
  {
    id: 'wallet' as const,
    label: 'Wallet',
    caption: 'Instant to UD wallet',
    icon: 'account-balance-wallet',
  },
];

export const QUICK_AMOUNTS = [
  { id: 'q25', label: '25%', fraction: 0.25 },
  { id: 'q50', label: '50%', fraction: 0.5 },
  { id: 'qmax', label: 'MAX', fraction: 1 },
];

export const COIN_ICON = require('../../assets/images/bcoin/udcoinUpdated.png');
export const BACK_ICON = require('../../assets/images/bcoin/backArrowNew.png');
export const TOKEN_GLYPH = 'ticket-confirmation-outline';
export const TREND_UP = require('../../assets/images/bcoin/up.png');
export const TREND_DOWN = require('../../assets/images/bcoin/down.png');

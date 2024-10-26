const translations = {
  en: {
      pricing: "Pricing",
      privacy: "Privacy Policy",
      about: "About Us",
      advertising: "Advertising",
      support: "Support",
      login: "Register/Login"
  },
  uk: {
      pricing: "Цінова політика",
      privacy: "Політика конфіденційності",
      about: "Про нас",
      advertising: "Реклама",
      support: "Служба підтримки",
      login: "Реєстрація/Вхід в аккаунт"
  },
  pl: {
      pricing: "Cennik",
      privacy: "Polityka prywatności",
      about: "O nas",
      advertising: "Reklama",
      support: "Wsparcie",
      login: "Rejestracja/Logowanie"
  }
};

function changeLanguage(language) {
  document.querySelectorAll('nav a, .login-button').forEach(link => {
      const key = link.getAttribute('data-key') || 'login';
      link.textContent = translations[language][key];
  });
}
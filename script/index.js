function changeLanguage(language) {
  var texts = {
      freelancers: {
          en: 'For freelancers',
          uk: 'Фрілансерам',
          pl: 'Dla freelancerów'
      },
      clients: {
          en: 'For clients',
          uk: 'Замовникам',
          pl: 'Dla klientów'
      },
      pricing: {
          en: 'Pricing',
          uk: 'Цінова політика',
          pl: 'Cennik'
      },
      privacy: {
          en: 'Privacy Policy',
          uk: 'Політика конфіденційності',
          pl: 'Polityka prywatności'
      },
      about: {
          en: 'About Us',
          uk: 'Про нас',
          pl: 'O nas'
      },
      advertising: {
          en: 'Advertising',
          uk: 'Реклама',
          pl: 'Reklama'
      },
      support: {
          en: 'Support',
          uk: 'Служба підтримки',
          pl: 'Wsparcie'
      }
  };

  // Update text for buttons and links
  document.getElementById('freelancers-button').textContent = texts.freelancers[language];
  document.getElementById('clients-button').textContent = texts.clients[language];
  document.getElementById('nav-pricing').textContent = texts.pricing[language];
  document.getElementById('nav-privacy').textContent = texts.privacy[language];
  document.getElementById('nav-about').textContent = texts.about[language];
  document.getElementById('nav-advertising').textContent = texts.advertising[language];
  document.getElementById('nav-support').textContent = texts.support[language];
}
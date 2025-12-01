# ✅ SEO Чеклист для FreelanceHub

## 📋 Вже налаштовано ✅

- [x] **Metadata в root layout** - Open Graph, Twitter Card, keywords
- [x] **Sitemap.xml** - автоматична генерація на `/sitemap.xml`
- [x] **Robots.txt** - автоматична генерація на `/robots.txt`
- [x] **PWA Manifest** - додаток можна встановити
- [x] **Metadata для сторінок** - Projects, Login, Register
- [x] **Структуровані URL** - SEO-friendly маршрутизація
- [x] **Мобільна адаптивність** - responsive дизайн
- [x] **Semantic HTML** - правильна структура тегів

## 🔧 Потрібно зробити вручну

### 1. Іконки та зображення
Створіть та додайте в `frontend/public/`:

- [ ] `favicon.ico` (32x32, 16x16)
- [ ] `icon-192.png` (192x192)
- [ ] `icon-512.png` (512x512)
- [ ] `apple-touch-icon.png` (180x180)
- [ ] `og-image.png` (1200x630) - для соцмереж

**Інструмент для створення:** [favicon.io](https://favicon.io/) або [realfavicongenerator.net](https://realfavicongenerator.net/)

### 2. Google Search Console
- [ ] Зареєструйте сайт на [search.google.com/search-console](https://search.google.com/search-console)
- [ ] Додайте код верифікації в `frontend/src/app/layout.jsx`:
```jsx
export const metadata = {
  // ...
  verification: {
    google: 'ваш-код-верифікації',
  },
};
```
- [ ] Підтвердіть sitemap.xml
- [ ] Перевірте покриття індексації

### 3. Google Analytics (опціонально)
- [ ] Створіть обліковий запис GA4
- [ ] Додайте tracking ID в `.env`:
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```
- [ ] Додайте скрипт в `layout.jsx`

### 4. Yandex Webmaster (для України)
- [ ] Зареєструйте на [webmaster.yandex.ua](https://webmaster.yandex.ua)
- [ ] Додайте код верифікації
- [ ] Підтвердіть sitemap.xml

### 5. Structured Data (Schema.org)
Додайте JSON-LD на ключових сторінках:

**Головна сторінка (`page.jsx`):**
```jsx
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'FreelanceHub',
  url: 'https://yourdomain.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://yourdomain.com/projects?search={search_term_string}',
    'query-input': 'required name=search_term_string'
  }
};
```

**Сторінка проєкту (`projects/[id]/page.jsx`):**
```jsx
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'JobPosting',
  title: project.title,
  description: project.description,
  datePosted: project.created_at,
  hiringOrganization: {
    '@type': 'Organization',
    name: 'FreelanceHub'
  }
};
```

### 6. Open Graph зображення
- [ ] Додайте OG image в metadata:
```jsx
openGraph: {
  images: ['/og-image.png'],
}
```

### 7. Performance оптимізація
- [ ] Оптимізуйте зображення (WebP формат)
- [ ] Перевірте Core Web Vitals на [PageSpeed Insights](https://pagespeed.web.dev/)
- [ ] Додайте lazy loading для зображень
- [ ] Мінімізуйте JavaScript

### 8. Додаткові теги
- [ ] Додайте canonical URLs для уникнення дублікатів
- [ ] Налаштуйте hreflang для багатомовності (якщо потрібно)

### 9. Content SEO
- [ ] Унікальні title для кожної сторінки
- [ ] Description 150-160 символів
- [ ] H1 теги на кожній сторінці
- [ ] Alt теги для всіх зображень
- [ ] Внутрішня перелінковка

### 10. Технічне SEO
- [ ] HTTPS налаштовано (SSL)
- [ ] Швидкість завантаження < 3 сек
- [ ] Mobile-first індексація готова
- [ ] XML sitemap актуальний
- [ ] 404 сторінка налаштована

## 📊 Інструменти для перевірки

- **Google Search Console** - покриття індексації
- **PageSpeed Insights** - швидкість сайту
- **Google Mobile-Friendly Test** - мобільна версія
- **Ahrefs/SEMrush** - аналіз SEO
- **Schema Markup Validator** - перевірка structured data

## 🎯 Ключові метрики для відстеження

- Органічний трафік (Google Analytics)
- Позиції в пошуку (Google Search Console)
- CTR в пошуку
- Час на сайті
- Показник відмов
- Core Web Vitals (LCP, FID, CLS)

## 🚀 Після запуску

- [ ] Моніторте індексацію щотижня
- [ ] Оновлюйте контент регулярно
- [ ] Аналізуйте пошукові запити
- [ ] Створюйте зворотні посилання
- [ ] Публікуйте блог-пости (якщо можливо)

---

**Останнє оновлення:** Грудень 2025

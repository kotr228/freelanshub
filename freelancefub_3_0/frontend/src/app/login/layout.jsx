export const metadata = {
  title: 'Вхід',
  description: 'Увійдіть до FreelanceHub та отримайте доступ до сотень проєктів або знайдіть найкращих фрілансерів для вашого бізнесу.',
  robots: {
    index: false, // Сторінки входу краще не індексувати
    follow: true,
  },
};

export default function LoginLayout({ children }) {
  return children;
}

import HeaderBar from "../src/componets/HeaderBar.jsx";
import FooterBar from "../src/componets/FooterBar.jsx";
import AppRoutes from "./routes.jsx";
import LanguageProvider from "../src/contexts/LanguageContext.jsx";
import I18nProvider from "./i18n/I18nProvider";

export default function App() {
  return (
    <I18nProvider>
    <div className="app-shell">
      <HeaderBar />
      <main className="p-1">
        <AppRoutes />
      </main>
      <FooterBar />
    </div>
    </I18nProvider>
    
  );
}

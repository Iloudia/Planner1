import { PropsWithChildren } from "react";
import { useCookieConsent } from "../context/CookieConsentContext";
import { useTranslation } from "react-i18next";

const InstagramIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    role="img"
    aria-hidden="true"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="currentColor"
      d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9Zm9.75 2.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
    />
  </svg>
);

const FooterLink = ({ href, children }: PropsWithChildren<{ href: string }>) => (
  <a className="site-footer__link" href={href}>
    {children}
  </a>
);

const Footer = () => {
  const { t } = useTranslation();
  const instagramUrl =
    "https://www.instagram.com/meandrituals?igsh=YmdwbmRmbTB1cW4w&utm_source=qr";
  const { openPreferences } = useCookieConsent();

  return (
    
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <h2 className="site-footer__title">
            {t("footer.motto").split("\n").map((line, index) => (
              <span key={line}>{index > 0 ? <br /> : null}{line}</span>
            ))}
          </h2>
        </div>

        <div className="site-footer__sections" aria-label={t("footer.complementaryNavigation")}>
          <div className="site-footer__section">
            <h3 className="site-footer__section-title">{t("footer.about")}</h3>
            <FooterLink href="/a-propos">{t("footer.aboutMe")}</FooterLink>
            <FooterLink href="/contact">{t("footer.contactMe")}</FooterLink>
            <FooterLink href="/faq">FAQ</FooterLink>
          </div>

          <div className="site-footer__section">
            <h3 className="site-footer__section-title">{t("footer.info")}</h3>
            <FooterLink href="/mentions-legales">{t("footer.legal")}</FooterLink>
            <FooterLink href="/confidentialite">{t("footer.privacy")}</FooterLink>
            <FooterLink href="/cookies">{t("footer.cookies")}</FooterLink>
          </div>

          <div className="site-footer__section">
            <h3 className="site-footer__section-title">{t("footer.follow")}</h3>
            <a className="site-footer__social-link" href={instagramUrl} target="_blank" rel="noreferrer noopener">
              <InstagramIcon className="site-footer__social-icon" />
              Instagram
            </a>
          </div>
        </div>
      </div>

      <div className="site-footer__bottom">
        <span>© 2025 Me&rituals.</span>
        <span>{t("footer.rights")} {t("footer.date")}</span>
      </div>
    </footer>
  );
};

export default Footer;


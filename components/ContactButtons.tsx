import { ChatCircle, TelegramLogo } from "@phosphor-icons/react/dist/ssr";
import { KAKAO_URL, TELEGRAM_URL } from "@/lib/contact";

type Props = {
  className?: string;
  onClick?: () => void;
};

export function ContactButtons({ className = "contact-buttons", onClick }: Props) {
  return (
    <div className={className}>
      <a className="gold-button" href={KAKAO_URL} target="_blank" rel="noopener noreferrer" onClick={onClick}>
        <ChatCircle weight="fill" /> 카카오톡 상담
      </a>
      <a className="outline-button" href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" onClick={onClick}>
        <TelegramLogo weight="fill" /> 텔레그램 상담
      </a>
    </div>
  );
}

export function ContactLinks() {
  return (
    <>
      <a href={KAKAO_URL} target="_blank" rel="noopener noreferrer">카카오톡 상담</a>
      <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">텔레그램 상담</a>
    </>
  );
}

export function FloatingContact() {
  return (
    <div className="floating-contact">
      <a className="floating-kakao" href={KAKAO_URL} target="_blank" rel="noopener noreferrer" aria-label="카카오톡 상담">
        <ChatCircle weight="fill" /><span>카카오톡</span>
      </a>
      <a className="floating-telegram" href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="텔레그램 상담">
        <TelegramLogo weight="fill" /><span>텔레그램</span>
      </a>
    </div>
  );
}

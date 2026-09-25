import {
  Buildings,
  Car,
  Compass,
  Confetti,
  Crown,
  Golf,
  Heart,
  Martini,
  MapPin,
  Spade,
  Ticket,
  Wine,
} from "@phosphor-icons/react/dist/ssr";

export const iconOptions = [
  { value: "spade", label: "카드(스페이드)" },
  { value: "wine", label: "와인잔" },
  { value: "martini", label: "칵테일" },
  { value: "golf", label: "골프" },
  { value: "buildings", label: "건물" },
  { value: "car", label: "자동차" },
  { value: "crown", label: "왕관" },
  { value: "compass", label: "나침반" },
  { value: "map-pin", label: "지도 핀" },
  { value: "ticket", label: "티켓" },
  { value: "confetti", label: "파티" },
  { value: "heart", label: "하트" },
] as const;

const icons = {
  spade: Spade,
  wine: Wine,
  martini: Martini,
  golf: Golf,
  buildings: Buildings,
  car: Car,
  crown: Crown,
  compass: Compass,
  "map-pin": MapPin,
  ticket: Ticket,
  confetti: Confetti,
  heart: Heart,
} as const;

export function BoardIcon({ name, ...props }: { name: string } & React.ComponentProps<typeof Spade>) {
  const Icon = icons[name as keyof typeof icons] ?? Spade;
  return <Icon {...props} />;
}

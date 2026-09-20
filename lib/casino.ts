export type CasinoCity = {
  slug: string;
  name: string;
  heading: string;
  subtitle: string;
  description: string;
};

export const casinoCities: CasinoCity[] = [
  {
    slug: "nha-trang",
    name: "나트랑",
    heading: "나트랑 카지노",
    subtitle: "해변 리조트와 가까운 카지노",
    description: "리조트 단지 안 카지노를 중심으로, 해변 일정과 저녁 게임을 하루에 이어서 안내합니다.",
  },
  {
    slug: "da-nang",
    name: "다낭",
    heading: "다낭 카지노",
    subtitle: "짧은 이동, 골프와 함께",
    description: "시내와 해변 리조트가 가까워 이동이 짧습니다. 낮 라운딩과 저녁 게임을 묶는 일정에 잘 맞습니다.",
  },
  {
    slug: "ha-noi",
    name: "하노이",
    heading: "하노이 카지노",
    subtitle: "격식 있는 VIP 룸 중심",
    description: "조용하고 격식 있는 VIP 룸을 중심으로, 시내 호텔과 전용 차량까지 함께 준비합니다.",
  },
];

export function findCity(slug: string) {
  return casinoCities.find((city) => city.slug === slug);
}

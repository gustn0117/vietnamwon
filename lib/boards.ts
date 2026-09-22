export type Board = {
  slug: string;
  name: string;
  heading: string;
  description: string;
  group: "casino" | "main";
  href: string;
};

type BoardInput = Omit<Board, "group" | "href">;

const casino = (board: BoardInput): Board => ({ ...board, group: "casino", href: `/casino/${board.slug}` });
const main = (board: BoardInput): Board => ({ ...board, group: "main", href: `/${board.slug}` });

export const casinoBoards: Board[] = [
  casino({
    slug: "nha-trang",
    name: "나트랑",
    heading: "나트랑 카지노",
    description: "리조트 단지 안 카지노를 중심으로, 해변 일정과 저녁 게임을 하루에 이어서 안내합니다.",
  }),
  casino({
    slug: "da-nang",
    name: "다낭",
    heading: "다낭 카지노",
    description: "시내와 해변 리조트가 가까워 이동이 짧습니다. 낮 라운딩과 저녁 게임을 묶는 일정에 잘 맞습니다.",
  }),
  casino({
    slug: "ha-noi",
    name: "하노이",
    heading: "하노이 카지노",
    description: "조용하고 격식 있는 VIP 룸을 중심으로, 시내 호텔과 전용 차량까지 함께 준비합니다.",
  }),
];

export const mainBoards: Board[] = [
  main({
    slug: "nightlife",
    name: "밤문화",
    heading: "밤문화",
    description: "루프톱 라운지와 클럽, 프라이빗 룸까지 직접 다녀온 곳을 소개합니다.",
  }),
  main({
    slug: "golf",
    name: "골프",
    heading: "골프",
    description: "베트남 주요 골프장과 티오프 예약, 라운딩 동선을 안내합니다.",
  }),
  main({
    slug: "hotel",
    name: "호텔",
    heading: "호텔",
    description: "여행 목적과 밤 동선에 맞는 호텔과 풀빌라를 소개합니다.",
  }),
  main({
    slug: "vehicle",
    name: "차량",
    heading: "차량",
    description: "공항 픽업부터 전 일정 전용 차량까지, 이동 서비스를 안내합니다.",
  }),
  main({
    slug: "travel-tip",
    name: "여행 TIP",
    heading: "여행 TIP",
    description: "환전, 유심, 입국 절차처럼 베트남 여행 전에 알아두면 좋은 정보를 모았습니다.",
  }),
];

export const allBoards = [...casinoBoards, ...mainBoards];

export function findBoard(slug: string, group?: Board["group"]) {
  return allBoards.find((board) => board.slug === slug && (!group || board.group === group));
}

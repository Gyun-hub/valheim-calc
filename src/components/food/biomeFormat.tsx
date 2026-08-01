/**
 * 바이옴 전용 서식 변환 헬퍼.
 *
 * `notable_structures`(고유명사 목록)와 `special_mechanics`(영문 자유 서술)는
 * 원본을 그대로 노출하지 않는다. 구조물은 용어 번역, 메커니즘은 데이터에
 * 담긴 사실을 근거로 직접 쓴 한국어 문장이다 (위키 문장 번역 아님).
 */

const STRUCTURE_KO: Record<string, string> = {
  "Ancient Stone Tower": "고대 석탑",
  "Bee Nests": "벌집",
  "Burial Grounds": "매장지",
  "Burial Chambers": "매장굴",
  "Troll Caves": "트롤 굴",
  "Leviathan Nests": "리바이어던 서식지",
  Barnacles: "따개비 군락",
  "Sunken Crypts": "가라앉은 지하묘지",
  "Draugr Fortresses": "드라우그르 요새",
  "Frost Caves": "서리 동굴",
  Cabins: "오두막",
  "Ancient Shrines": "고대 제단",
  "Fuling Villages": "풀링 마을",
  "Tar Pits": "타르 늪",
  "Abandoned Farms": "버려진 농장",
  "Infested Mines": "감염된 광산",
  "Infested Citadel": "감염된 성채",
  "Ancient Ruins": "고대 유적",
  "Ashlands Altar": "애쉬랜즈 제단",
  "Fortified Ruins": "요새화된 유적",
  "Lava Pits": "용암 구덩이",
  "Abandoned Viking Villages": "버려진 바이킹 마을",
  "Underground Dungeons": "지하 던전",
  "Frozen Ruins": "얼어붙은 유적",
};

export function structureKo(name: string): string {
  return STRUCTURE_KO[name] ?? name;
}

/**
 * 바이옴별 특수 메커니즘 자체 서술.
 * `special_mechanics` 원본 필드에 담긴 사실을 근거로 직접 작성했다.
 */
const SPECIAL_MECHANICS_KO: Record<string, string> = {
  Meadows: "초심자를 위한 안전한 시작 지역으로, 기본 제작과 요리를 익히는 곳입니다.",
  "Black Forest":
    "채굴 시 몬스터가 몰려들기 쉽고 광석 채굴에는 사슴뿔 곡괭이가 필요합니다. 청동기 진행의 중심 지역입니다.",
  Ocean: "이동에는 배가 필수이며 포탈로는 금속을 옮길 수 없습니다. 바다 생물들의 서식지입니다.",
  Swamp:
    "'젖음' 상태가 되면 회복력이 떨어지고 독 피해가 흔해 독 저항 미드가 거의 필수입니다. 철기 시대로 넘어가는 관문입니다.",
  Mountains:
    "동상 상태가 회복력을 크게 깎습니다. 위시본으로 은맥을 찾을 수 있고, 드래곤 알은 무거워 포탈로 옮길 수 없습니다.",
  Plains:
    "농사 핵심 자원을 제공하며 타르 구덩이에서 건축 자재를 얻습니다. 적이 무리로 몰려다녀 위험합니다.",
  Mistlands:
    "짙은 안개로 시야 확보가 가장 큰 과제이며 이동에는 위스프라이트가 필요합니다. 마법 시스템과 에이트르가 처음 등장합니다.",
  Ashlands:
    "준비되지 않은 플레이어를 압도하도록 설계된 최종기 지역으로, 극한의 환경 위협 속에 전략적 위치 선정이 필요합니다.",
  "Deep North":
    "만년설과 오로라가 펼쳐지는 최북단 지역입니다. 그래플링 훅이 해금되고 새로운 던전 두 종류가 등장하며, 발헤임 1.0 정식 출시와 함께 공개될 예정입니다.",
};

export function specialMechanicsKo(biomeNameEn: string): string {
  return SPECIAL_MECHANICS_KO[biomeNameEn] ?? "정리된 설명이 없습니다.";
}

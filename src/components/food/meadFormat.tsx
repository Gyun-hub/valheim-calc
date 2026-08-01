/**
 * 미드·포션 전용 서식 변환 헬퍼.
 *
 * `magnitude` · `brewTime` · `brewYield` 는 원본이 영문 자유 텍스트라
 * 그대로 노출하지 않고 수치를 뽑아 한국어 문장으로 다시 쓴다.
 * 위키 설명문 번역이 아니라 데이터에 들어있는 수치 기반 재구성이다.
 */

export const EFFECT_KO: Record<string, string> = {
  "Health Restoration": "체력 회복",
  "Health Restoration (Lingering)": "체력 지속 회복",
  "Stamina Restoration": "스태미나 회복",
  "Stamina Restoration (Lingering)": "스태미나 지속 회복",
  "Frost Resistance": "냉기 저항",
  "Poison Resistance": "독 저항",
  "Fire Resistance": "화염 저항",
  "Combat Buff": "전투 강화",
  "Movement Speed Buff": "이동속도 강화",
  "Carry Weight Buff": "소지 무게 강화",
  "Eitr Restoration": "에이트르 회복",
  "Eitr Restoration (Lingering)": "에이트르 지속 회복",
  "Stamina Regeneration Buff": "스태미나 재생 강화",
};

export function effectKo(effect: string): string {
  return EFFECT_KO[effect] ?? effect;
}

/** `magnitude` 자유 텍스트를 수치 기반 한국어 문장으로 재구성 */
export function describeMagnitude(magnitude: string): string {
  const text = magnitude.trim();

  // "50 HP over 10 seconds" 류
  let m = text.match(/^(\d+(?:\.\d+)?)\s*HP\s+over\s+(\d+(?:\.\d+)?)\s*seconds?$/i);
  if (m) return `${m[2]}초에 걸쳐 체력 ${m[1]} 회복`;

  // "125 HP instantaneous" 류
  m = text.match(/^(\d+(?:\.\d+)?)\s*HP\s+instantaneous$/i);
  if (m) return `체력을 즉시 ${m[1]} 회복`;

  // "25% health over 5 minutes" 류
  m = text.match(/^(\d+(?:\.\d+)?)%\s*health\s+over\s+(\d+(?:\.\d+)?)\s*minutes?$/i);
  if (m) return `${m[2]}분에 걸쳐 최대 체력의 ${m[1]}% 회복`;

  // "80 stamina + faster regen for 120 seconds" 류
  m = text.match(
    /^(\d+(?:\.\d+)?)\s*stamina\s*\+\s*faster\s+regen\s+for\s+(\d+(?:\.\d+)?)\s*seconds?$/i,
  );
  if (m) return `스태미나 ${m[1]} 즉시 회복 + ${m[2]}초간 재생 속도 증가`;

  // "25% stamina over 5 minutes" 류
  m = text.match(/^(\d+(?:\.\d+)?)%\s*stamina\s+over\s+(\d+(?:\.\d+)?)\s*minutes?$/i);
  if (m) return `${m[2]}분에 걸쳐 최대 스태미나의 ${m[1]}% 회복`;

  // "125 Eitr instantaneous" 류
  m = text.match(/^(\d+(?:\.\d+)?)\s*Eitr\s+instantaneous$/i);
  if (m) return `에이트르를 즉시 ${m[1]} 회복`;

  // "25% eitr regen over 5 minutes" 류
  m = text.match(/^(\d+(?:\.\d+)?)%\s*eitr\s+regen\s+over\s+(\d+(?:\.\d+)?)\s*minutes?$/i);
  if (m) return `${m[2]}분에 걸쳐 최대 에이트르의 ${m[1]}% 회복`;

  // "Resist freezing damage" / "Resist fire damage" 류
  m = text.match(/^Resist\s+(\w+)\s+damage(?:\s*&\s*shorten\s+(\w+)\s+duration)?$/i);
  if (m) {
    const dmgKo: Record<string, string> = { freezing: "냉기", fire: "화염", poison: "독" };
    const base = `${dmgKo[m[1].toLowerCase()] ?? m[1]} 피해 저항`;
    return m[2] ? `${base}, 상태이상 지속시간 단축` : base;
  }

  // "-80% stamina cost for attack, block, dodge" 류
  m = text.match(/^-(\d+(?:\.\d+)?)%\s*stamina\s+cost\s+for\s+(.+)$/i);
  if (m) return `공격·방어·회피 스태미나 소모 ${m[1]}% 감소`;

  // "+15% running speed, +7.5% swimming speed" 류
  if (/speed/i.test(text) && text.includes("+")) {
    const parts = text
      .split(",")
      .map((seg) => {
        const s = seg.match(/\+(\d+(?:\.\d+)?)%\s*(running|swimming)\s+speed/i);
        if (!s) return null;
        const kind = s[2].toLowerCase() === "running" ? "이동" : "수영";
        return `${kind} 속도 +${s[1]}%`;
      })
      .filter((s): s is string => Boolean(s));
    if (parts.length > 0) return parts.join(", ");
  }

  // "+250 carry weight" 류
  m = text.match(/^\+(\d+(?:\.\d+)?)\s*carry\s+weight$/i);
  if (m) return `소지 무게 한도 +${m[1]}`;

  // "+100% stamina regen, -50% HP regen" 류
  if (/regen/i.test(text) && text.includes(",")) {
    const parts = text
      .split(",")
      .map((seg) => {
        const s = seg.match(/([+-]\d+(?:\.\d+)?)%\s*(stamina|hp)\s+regen/i);
        if (!s) return null;
        const kind = s[2].toLowerCase() === "hp" ? "체력" : "스태미나";
        return `${kind} 재생 ${s[1]}%`;
      })
      .filter((s): s is string => Boolean(s));
    if (parts.length > 0) return parts.join(", ");
  }

  // 알려진 패턴에 없으면 숫자·기호만 추려 안내 (원본 영문 문장은 노출하지 않음)
  const numbers = text.match(/[+-]?\d+(?:\.\d+)?%?/g);
  return numbers && numbers.length > 0
    ? `수치 효과 (${numbers.join(", ")}) — 상세 서술 미정리`
    : "효과 상세 수치 미정리";
}

/** `brewTime` — 데이터셋 전체가 동일 표기라 고정 패턴으로 처리 */
export function describeBrewTime(brewTime: string | null): string {
  if (!brewTime) return "정보 없음";
  const m = brewTime.match(/(\d+(?:\.\d+)?)\s*in-game days?\s*\((\d+(?:\.\d+)?)\s*minutes?/i);
  if (m) return `게임 내 ${m[1]}일 (실시간 약 ${m[2]}분)`;
  return "정보 없음";
}

/** `brewYield` — "6 bottles per batch" 류 */
export function describeBrewYield(brewYield: string | null): string {
  if (!brewYield) return "정보 없음";
  const m = brewYield.match(/(\d+)\s*bottles?\s*per\s*batch/i);
  if (m) return `1회 양조당 ${m[1]}병`;
  return "정보 없음";
}

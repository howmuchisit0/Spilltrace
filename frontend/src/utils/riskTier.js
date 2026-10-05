// Risk tier — muted, professional palette
export function riskTier(scorePct) {
  if (scorePct > 70) return { label: 'high-risk', color: '#c25d5d' };
  if (scorePct > 40) return { label: 'med-risk', color: '#b8943a' };
  return { label: 'low-risk', color: '#5a9e7c' };
}
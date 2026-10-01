export function economics(v) {
  const members = Math.floor(v.contacts * v.conversion / 100);
  const gross = members * v.price;
  const hours = (members * v.minutes / 60 + v.shared) * 4.33;
  const fees = gross * v.fee / 100;
  const labor = hours * v.hourly;
  const contribution = gross - fees - labor - v.tools - v.displaced;
  const unitMargin = v.price * (1 - v.fee / 100) - v.minutes / 60 * 4.33 * v.hourly;
  const fixed = v.tools + v.shared * 4.33 * v.hourly + v.displaced;
  return {members, gross, hours, fees, labor, contribution, firstMonth: contribution - v.setup - v.campaign,
    breakEven: unitMargin > 0 ? Math.ceil(fixed / unitMargin) : null,
    month3: gross * (1 - v.churn / 100) ** 2,
    replacements: members * v.churn / 100};
}

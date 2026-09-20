// Explicit week -> banner-asset map. Deliberately a literal table, not a
// derived `week-${n}.svg` string: a typo or an off-by-one in a template
// silently produces a broken image path, while a lookup against this table
// throws at build time for any week that isn't listed here.
const WEEK_BANNERS: Readonly<Record<number, string>> = {
  1: "/src/assets/images/banners/week-01.svg",
  2: "/src/assets/images/banners/week-02.svg",
  3: "/src/assets/images/banners/week-03.svg",
  4: "/src/assets/images/banners/week-04.svg",
  5: "/src/assets/images/banners/week-05.svg",
  6: "/src/assets/images/banners/week-06.svg",
  7: "/src/assets/images/banners/week-07.svg",
  8: "/src/assets/images/banners/week-08.svg",
  9: "/src/assets/images/banners/week-09.svg",
  10: "/src/assets/images/banners/week-10.svg",
  11: "/src/assets/images/banners/week-11.svg",
  12: "/src/assets/images/banners/week-12.svg",
};

export function weekBanner(week: number): string {
  const path = WEEK_BANNERS[week];
  if (!path) throw new Error(`No banner mapped for week ${week}. Add it to WEEK_BANNERS.`);
  return path;
}

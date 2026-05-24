/** Floating tab bar in `(tabs)/_layout.tsx` */
export const TAB_BAR_HEIGHT = 76;
export const TAB_BAR_BOTTOM_GAP = 16;
export const TAB_BAR_SIDE_MARGIN = 20;
export const CONTENT_GAP_ABOVE_TAB_BAR = 16;

/** Bottom padding so scroll content clears the floating tab bar */
export function getFloatingTabBarPadding(bottomSafeInset: number) {
  return (
    bottomSafeInset +
    TAB_BAR_BOTTOM_GAP +
    TAB_BAR_HEIGHT +
    CONTENT_GAP_ABOVE_TAB_BAR
  );
}

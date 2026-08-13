import { getArcApexOffset } from '../src/screens/ticketLandingScreen/backdropArc';

// The backdrop is a 430x932 canvas with its curve bottoming out at y=610.
const APEX_RATIO = 610 / 932;

describe('getArcApexOffset', () => {
  it('puts the apex at the design position on the design canvas', () => {
    expect(getArcApexOffset(430, 932)).toBeCloseTo(610, 5);
  });

  it('follows the box ratio while the box is narrower than the canvas', () => {
    // 412x915 (Pixel-class): taller than 430:932, so cover scales by height and
    // crops the sides — nothing moves vertically.
    expect(getArcApexOffset(412, 915)).toBeCloseTo(915 * APEX_RATIO, 5);
  });

  it('accounts for the vertical crop on boxes wider than the canvas', () => {
    // 360x640: cover scales by width, so the image overflows top and bottom and
    // the apex sits well below where the raw ratio would put it.
    const scale = 360 / 430;
    const cropTop = (640 - 932 * scale) / 2;
    expect(getArcApexOffset(360, 640)).toBeCloseTo(cropTop + 610 * scale, 5);

    // The bug this replaced: treating the apex as 610/932 of the screen. On
    // this box that is more than 20pt of misalignment.
    expect(getArcApexOffset(360, 640) - 640 * APEX_RATIO).toBeGreaterThan(20);
  });

  it('returns null before the box has been laid out', () => {
    expect(getArcApexOffset(0, 0)).toBeNull();
    expect(getArcApexOffset(undefined, undefined)).toBeNull();
  });
});

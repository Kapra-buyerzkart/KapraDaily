// Geometry of the curve baked into the ticket landing backdrop.
//
// `movieticketbg .png` is a 430x932 design canvas whose arc bottoms out at
// y=610 on the horizontal centre. The backdrop is painted with
// resizeMode="cover", so on any box that is not exactly 430:932 the image is
// scaled up and centre-cropped: the apex is only at 610/932 of the *image*, not
// of the box it is painted into. Deriving the offset from the measured box (and
// never from Dimensions.get('window'), which reports different things on iOS
// and Android) is what keeps the arrow pill on the curve everywhere.

export const BACKDROP_SOURCE = require('../../assets/images/movieticketbg .png');

const BACKDROP_WIDTH = 430;
const BACKDROP_HEIGHT = 932;
const ARC_APEX_Y = 610;

export const BACKDROP_ARC_APEX_RATIO = ARC_APEX_Y / BACKDROP_HEIGHT;

/**
 * Distance from the top of a cover-fitted backdrop box to the arc's apex.
 *
 * @param {number} width  painted box width
 * @param {number} height painted box height
 * @returns {number|null} offset in points, or null when the box has no size yet
 */
export const getArcApexOffset = (width, height) => {
  if (!width || !height) return null;

  const scale = Math.max(width / BACKDROP_WIDTH, height / BACKDROP_HEIGHT);
  const paintedHeight = BACKDROP_HEIGHT * scale;
  const cropTop = (height - paintedHeight) / 2;

  return cropTop + ARC_APEX_Y * scale;
};

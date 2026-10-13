const Toast = {
  show: jest.fn(),
  showWithGravity: jest.fn(),
  showWithGravityAndOffset: jest.fn(),
  SHORT: 0,
  LONG: 1,
  TOP: 1,
  BOTTOM: 2,
  CENTER: 3,
};

export default Toast;
module.exports = Toast;

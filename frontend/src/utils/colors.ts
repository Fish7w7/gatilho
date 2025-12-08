import { ColorKey, COLOR_MAP, ColorMap } from '../types';

export function getColorClasses(color: ColorKey): ColorMap {
  return COLOR_MAP[color];
}

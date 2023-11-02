import {Category} from "./category";

const CategoryCoefficient = {
  LEISURE: 0.3,
  NECESSARY: 0.1,
  SPORT: 0.1,
  STUDY: 0.05,
  DIFFERENT: 0.3,
  HYGIENE: 0.02,
  CLEAN: 0.05,
  FAMILY: 0.05,
  PEOPLE: 0.03,
}

export const categoryCoefficient: Record<string, number> = {
  [Category.LEISURE]: CategoryCoefficient.LEISURE,
  [Category.NECESSARY]: CategoryCoefficient.NECESSARY,
  [Category.SPORT]: CategoryCoefficient.SPORT,
  [Category.STUDY]: CategoryCoefficient.STUDY,
  [Category.DIFFERENT]: CategoryCoefficient.DIFFERENT,
  [Category.HYGIENE]: CategoryCoefficient.HYGIENE,
  [Category.CLEAN]: CategoryCoefficient.CLEAN,
  [Category.FAMILY]: CategoryCoefficient.FAMILY,
  [Category.PEOPLE]: CategoryCoefficient.PEOPLE,
};

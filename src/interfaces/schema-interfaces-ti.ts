/**
 * This module was automatically generated by `ts-interface-builder`
 */
import * as t from "ts-interface-checker";
// tslint:disable:object-literal-key-quotes

export const IUserUrlQuerys = t.iface([], {
  "favoriteExercise": t.opt("string"),
  "country": t.opt("string"),
  "usrName": t.opt("string"),
  "name": t.opt(t.iface([], {
    "first": t.opt("string"),
    "last": t.opt("string"),
  })),
  "age": t.opt("string"),
});

const exportedTypeSuite: t.ITypeSuite = {
  IUserUrlQuerys,
};
export default exportedTypeSuite;
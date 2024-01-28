import { atom } from "recoil";

const searchAtom = atom({
  key: "searchThreadAtom",
  default: "",
});

export default searchAtom;

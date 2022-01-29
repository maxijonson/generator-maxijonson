import _ from "lodash";

type SumResult = number;

export const sum = (a: number, b: number): SumResult => _.sum([a, b]);

console.log(`1 + 2 = ${sum(1, 2)}`);

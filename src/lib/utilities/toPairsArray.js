/**
 * Merkle Tree
 *
 * Copyright © 2015-2016 Lionshead Consulting Group, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

export default function toPairsArr(arr) {
  if(!arr.length) return [];

  return arr.reduce((acc, currVal, idx, arr) => {
    // If staging already has a pair of items, promote staging to pairs, then add the currVal to staging.
    if(acc.staging.length === 2) {
      acc.pairs.push(acc.staging);
      acc.staging = [currVal];
    } else {
      acc.staging.push(currVal);
    }

    // If last element in the array, push staging to pairs
    if(idx === arr.length - 1) {
      acc.pairs.push(acc.staging);

      return acc.pairs;
    }

    return acc;
  }, { pairs: [], staging: [] });
}

// @flow
/**
 * Merkle Tree Implementation
 *
 * Copyright © 2015-2016 Lionshead Consulting Group, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import { pipe, last } from 'ramda';
import { set as _set, isString as _isString } from 'lodash';
import Maybe from 'folktale/maybe';
import toPairsArray from '../utilities/toPairsArray';
import hashArrays from '../utilities/hashArrays';
import hash from '../utilities/hash';

const lastLeafIsSingle = leavesArr => (last(leavesArr).length === 1) ? Maybe.Just(leavesArr) : Maybe.Nothing();

export default class MerkleTree {
  constructor(dataArr: Array<any>) {
    if (!dataArr.length) throw new Error('An array consisting of at least one element of data must be supplied.');

    this.memoized = {};
    this.data = dataArr;
    [this.tree, this.merkleRoot] = this.create(this.data);
  }

  create() {
    const buildTree = (leavesArr, level = 1, tree = { levels: {}, remainder: [] }) => {
      // First, record the current level
      tree.levels[level] = leavesArr;

      // Second, we define our Base case - when leavesArr has a length of 1.
      if (leavesArr.length === 1 && !tree.remainder.length && leavesArr[0].length === 1) {
        tree.merkleRoot = leavesArr[0];
        delete tree.remainder;

        return [tree, tree.merkleRoot];
      } // ***END Base case

      // Third, check if the last item in leavesArr (remember every item in the leavesArr is an array as well) is a single element,
      // if so, concat the item in the 'tree.remainder' array (if any exists) to the last item of the leavesArr.
      const nextLeavesArr = lastLeafIsSingle(leavesArr)
        .map(arr => {
          // At this point the last item in the 'leavesArr' has a single value, if there is a remainder, push that remainder
          // value to the last item of the 'leavesArr'. However, if there is no remainder and the last value in the 'leavesArr'
          // has a single value, simply remove that item from the 'leavesArr' and concat it to the 'tree.remainder' array.
          if(!tree.remainder) tree.remainder.concat(arr.splice(arr.length-1, 1));

          return arr;
        })
        .getOrElse(leavesArr);

      // Fourth, iterate over the 'nextLeavesArr' and flatten each array.
      // Flattening the array consists of taking both items (sha256 64 byte hexadecimal strings) will be concatenated then hashed.
      const nextLeavesArrFlattened = _isString(nextLeavesArr) ? [nextLeavesArr] : nextLeavesArr.map(currVal => {
        return hash(
          currVal.reduce((acc, currItem) => {
            return acc + currItem;
          }, '')
        );
      });

      return buildTree(toPairsArray(nextLeavesArrFlattened), level + 1, tree);
    };

    return buildTree(pipe(toPairsArray, hashArrays)(this.data));
  }

  level(num: number): Array<any> {
    return (this.tree.levels[num]) ? this.tree.levels[num] : new Error('The level you are requesting does not exist.')
  }

  levels() {
    const calculateLevels = (tree) => {
      return Object.keys(tree.levels).length;
    };

    if(!this.memoized.levels || !this.memoized.levels[this.merkleRoot]) {
      _set(this.memoized, `levels.${this.merkleRoot}`, calculateLevels(this.tree));
    }

    return this.memoized.levels[this.merkleRoot];
  }
}

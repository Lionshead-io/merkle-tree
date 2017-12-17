/**
 * Merkle Tree Implementation
 *
 * Copyright © 2015-2016 Lionshead Consulting Group, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { expect } from 'chai';
import merkleTree from '../src/lib/services/MerkleTree';

describe('merkleTree Service:', () => {

  describe('merkleTree([])', () => {

    it('should return an error message for invalid/empty argument passed', () => {
      expect(() => merkleTree([])).to.throw('An array consisting of at least one element of data must be supplied.');
    });

  });

});

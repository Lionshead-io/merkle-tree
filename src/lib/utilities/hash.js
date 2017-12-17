// @flow
/**
 * Hashing function utility
 *
 * Copyright © 2015-2016 Lionshead Consulting Group, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import hasha from 'hasha';
import { isString as _isString, isNumber as _isNumber, toString as _toString } from 'lodash';

export default function hash(data: any): string {
  const safeData = (_isNumber(data) || _isString(data)) ? _toString(data) : JSON.stringify(data);

  return hasha(safeData, { algorithm: 'sha256' });
}

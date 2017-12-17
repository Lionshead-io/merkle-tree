import hash from '../utilities/hash';

export default function hashArrays(arr) {
  return arr.map(currPair => currPair.map(currVal => hash(currVal)));
}

import * as RndWord from 'random-words';

export const getWord = (length: number): string => {

  // anoyingly random-words doesn't allow min-length specifier
  const words = RndWord.default({maxLength: length, exactly: 10});
  console.log(`getting word of length: ${length}`, words);
  const found = words.find(word => word.length === length);
  if (found) {
    return found;
  }
  return getWord(length);
}
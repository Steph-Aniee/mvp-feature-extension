export default class MatchingGame {
  constructor(list) {
    this.matches = [];
    this.board = this.shuffle(this.duplicate(list));
  }

  checkMatch(a, b) {
    if (a === b) {
      this.matches.push(a);
      return true;
    }
    return false;
  }

  //prettier-ignore
  duplicate(list) {
    // Steph: Adding the wildcard after the new set of cards and their dublicates have been defined/set up for the match
    return [
      ...list,
      ...list,
      {
        image_url:
          "https://cdn.bfldr.com/Z0BJ31FP/at/vjc7chngjc36vgpxmr3fhm7x/golden-card-icon.svg",
        text: "WildCard",
        isWildcard: true // Steph: adding the boolean state to make things easier when rendering the wildcard
      },
    ];
  }

  shuffle(list) {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = list[i];
      list[i] = list[j];
      list[j] = temp;
    }
    return list;
  }
}

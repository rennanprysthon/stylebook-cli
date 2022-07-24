function normalizeToken(tokenName) {
  let final = tokenName.split("-").reduce((prev, next) => {
    prev += next.charAt(0).toLocaleUpperCase() + next.substr(1);
    return prev;
  }, "");

  let firstLetter = final.charAt(0).toLocaleLowerCase();
  let token = final.substr(1);

  return firstLetter + token;
}

export { normalizeToken };

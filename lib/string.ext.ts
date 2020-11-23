interface String {
  isspace(): boolean;
  isdigit(): boolean;
  isalnum(): boolean;
  isalpha(): boolean;
}

// This adds definitions to lib.es5.d.ts in node_modules
// is this what we want?
String.prototype.isspace = function () {
  return (
    this.charAt(0) === ' ' || this.charAt(0) === '\n' || this.charAt(0) === '\r'
  );
};

String.prototype.isdigit = function () {
  return isNumeric(this.charAt(0));
};

// Added in part9
String.prototype.isalnum = function () {
  const regExp = /^[A-Za-z0-9]+$/;
  return this.charAt(0).match(regExp) ? true : false;
};

String.prototype.isalpha = function () {
  const regExp = /^[A-Za-z]+$/;
  return this.charAt(0).match(regExp) ? true : false;
};

// jQuery - return !isNaN(s - parseFloat(s));
const isNumeric = (num: string) => {
  return !isNaN(parseInt(num));
};

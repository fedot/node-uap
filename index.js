var path = require('path'),
    fs = require('fs'),
    yaml = require('yamlparser'),
    regexes_base_path = 'node_modules/uap-core/regexes.yaml',
    uap_regexes_path = [
        path.join(__dirname, regexes_base_path),
        path.join(__dirname, '../..', regexes_base_path)
    ].find(fs.existsSync),
    refImpl = require('uap-ref-impl')(readYAML(uap_regexes_path));

function readYAML(file) {
    var data = fs.readFileSync(file, 'utf8');
    return yaml.eval(data);
}

// uap-ref-impl does not provide a `toVersionString` function. Add it.
function ensureToVersionString(context) {
  if (context && ! context.toVersionString) {
    context.toVersionString = toVersionString.bind(context);
  }
}

// taken from https://github.com/tobie/ua-parser/blob/8bc22f74e3a4515633d975cd535e94e5ae9699d2/js/lib/os.js#L12
function toVersionString () {
  var output = '';
  if (this.major != null) {
    output += this.major;
    if (this.minor != null) {
      output += '.' + this.minor;
      if (this.patch != null) {
        if (startsWithDigit(this.patch)) {
          output += '.';
        }
        output += this.patch;
        if (this.patchMinor != null) {
          if (startsWithDigit(this.patchMinor)) {
            output += '.';
          }
          output += this.patchMinor;
        }
      }
    }
  }

  return output;
}

function startsWithDigit(str) {
  return /^\d/.test(str);
}

var _parse = refImpl.parse;
refImpl.parse = function (ua) {
  var result = _parse.call(refImpl, ua);

  // ua-parser results had a `toVersionString` function on `os` and `ua`.
  // Add the missing support.
  ensureToVersionString(result.os);
  ensureToVersionString(result.ua);

  return result;
};

module.exports = refImpl;

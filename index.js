var path = require('path'),
    fs = require('fs'),
    yaml = require('yamlparser'),
    find = require('array-find'),
    regexes_base_path = 'node_modules/uap-core/regexes.yaml',
    uap_regexes_path = find([
        path.join(__dirname, regexes_base_path),
        path.join(__dirname, '../..', regexes_base_path)
    ], fs.existsSync),
    refImpl = require('uap-ref-impl')(readYAML(uap_regexes_path));

function readYAML(file) {
    var data = fs.readFileSync(file, 'utf8');
    return yaml.eval(data);
}

module.exports = refImpl;

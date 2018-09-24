let source = require("fs").readFileSync("./dist/rot.js");
eval(source + "global.ROT = ROT;");

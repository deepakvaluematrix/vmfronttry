const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const fs = require('fs');
const { minify } = require('uglify-js');

const buildPath = path.join(__dirname, 'build');
const jsFilePath = path.join(buildPath, 'static/js');

const files = fs.readdirSync(jsFilePath);
const jsFiles = files.filter((file) => file.endsWith('.js') && !file.endsWith('.map'));

const terserOptions = {
    mangle: {
    keep_fnames: false,
    keep_classnames: false,
    reserved: ['$super', '$', 'exports', 'require'],
  },
  compress: {
    booleans_as_integers: true,
    drop_console: true,
    drop_debugger: true,
    ecma: 5,
    keep_fargs: false,
    passes: 2,
  },
};

const terserPlugin = new TerserPlugin({
  terserOptions,
});

jsFiles.forEach((file) => {
  const filePath = path.join(jsFilePath, file);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  try{
    const minifiedContent = minify(fileContent, terserOptions);
    if (minifiedContent && minifiedContent.code) {
      fs.writeFileSync(filePath, minifiedContent.code, 'utf8');
    }
  }catch(err){
    console.log(err);
  }
});
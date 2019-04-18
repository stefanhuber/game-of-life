const typescript = require('rollup-plugin-typescript');
const copy = require('rollup-plugin-copy');

module.exports = {
    input: 'src/index.ts',
    output: {
      file: 'dist/js/bundle.js',
      format: 'umd',
      name: 'gol',
      sourcemap: true
    },
    plugins: [
        typescript() ,
        copy({
            targets: [
                'src/www/index.html',
                'src/www/style.css'
            ],
            outputFolder:'dist'
        })
    ]
};
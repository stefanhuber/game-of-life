import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';

export default {
    input: 'src/index.ts',
    output: {
      file: 'docs/js/bundle.js',
      format: 'umd',
      name: 'gol',
      sourcemap: true
    },
    plugins: [
        typescript() ,
        copy({
            targets: [{
                src: ['src/www/index.html', 'src/www/style.css'],
                dest: 'docs'
            }]
        })
    ]
};
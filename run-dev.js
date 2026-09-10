process.versions.webcontainer = 'true';
process.env.NEXT_SWC_LOAD_WASM = '1';
process.argv = [process.argv[0], './node_modules/next/dist/bin/next', 'dev', '-p', '3005'];
require('./node_modules/next/dist/bin/next');

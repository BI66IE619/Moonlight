// Function to get the currently selected server from the UI or default
const getBare = () => {
    return localStorage.getItem('moonlight_bare') || 'https://bare.benroberts.dev/';
};

self.__uv$config = {
    prefix: '/proxy/uv/service/',
    bare: getBare(),
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/proxy/uv/uv.handler.js',
    bundle: '/proxy/uv/uv.bundle.js',
    config: '/proxy/uv/uv.config.js',
    sw: '/proxy/uv/uv.sw.js',
};

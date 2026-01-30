self.__uv$config = {
    prefix: '/proxy/uv/service/',
    bare: 'https://bare.benroberts.dev/', // This is a 2026 active bare server
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/proxy/uv/uv.handler.js',
    bundle: '/proxy/uv/uv.bundle.js',
    config: '/proxy/uv/uv.config.js',
    sw: '/proxy/uv/uv.sw.js',
};

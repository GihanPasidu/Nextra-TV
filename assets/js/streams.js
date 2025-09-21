// Stream Sources Configuration
// This file contains multiple streaming sources for Sri Lankan TV channels

export const streamSources = {
    "sirasa": [
        "https://live.sirasa.tv/sirasa/sirasamain.m3u8",
        "https://raw.githubusercontent.com/jishan101/livestream/main/streams/sirasa.m3u8",
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Demo fallback
    ],
    "hiru": [
        "https://live.hirutv.lk/hiru/hirutvmain.m3u8",
        "https://raw.githubusercontent.com/jishan101/livestream/main/streams/hiru.m3u8",
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", // Demo fallback
    ],
    "derana": [
        "https://live.adaderana.lk/derana/deranatvmain.m3u8",
        "https://raw.githubusercontent.com/jishan101/livestream/main/streams/derana.m3u8",
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", // Demo fallback
    ],
    "itn": [
        "https://live.itn.lk/itn/itnmain.m3u8",
        "https://raw.githubusercontent.com/jishan101/livestream/main/streams/itn.m3u8",
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", // Demo fallback
    ],
    "demo": [
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
    ]
};

// Free working HLS streams for testing
export const testStreams = [
    "https://demo-videos.particle.media/uploads/sampleVideo.m3u8",
    "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
    "https://multiplatform-f.akamaihd.net/i/multi/will/bunny/big_buck_bunny_,640x360_400,640x360_700,640x360_1000,950x540_1500,.f4v.csmil/master.m3u8",
    "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8"
];

// MP4 video sources (always work)
export const mp4Sources = [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
];
/*
 * This is the only file most project updates need to touch.
 * Keep paper metadata, metrics, links, and media paths centralized here.
 * Video files belong in assets/videos/. Use H.264 MP4 for browser compatibility.
 */
function resultSequence(subtitle, prefix, frameCount, hasOdom = false) {
  const assetVersion = "20260826-9";
  return {
    subtitle,
    frameLabel: `${frameCount.toLocaleString("en-US")} ${hasOdom ? "front-view" : "inference"} frames · stride 1`,
    rgb: [1, 2, 3, 4].slice(0, hasOdom ? 2 : 4).map((index) => `assets/images/results/${prefix}-rgb-${index}.jpg?v=${assetVersion}`),
    auxiliary: hasOdom ? { name: "Raw odometry", image: `assets/images/results/${prefix}-raw-odom.jpg?v=${assetVersion}` } : null,
    methods: [
      { name: "LingBot-Map", image: `assets/images/results/${prefix}-lingbot.png?v=${assetVersion}` },
      { name: "HorizonStream w/ LC", image: `assets/images/results/${prefix}-horizon-lc.png?v=${assetVersion}` },
      { name: "Ours w/ LC", image: `assets/images/results/${prefix}-ours-lc.png?v=${assetVersion}` },
    ],
  };
}

window.SITE_CONFIG = {
  shortTitle: "ABot-Recon",
  paperTitle: "Revisiting Local Context for Long-Horizon Streaming 3D Reconstruction",
  tagline: "Stable streaming 3D reconstruction for ultra-long sequences using a fixed 12-frame local context.",
  authors: "AMAP CV Lab",
  abstract:
    "ABot-Recon solves a fixed local reconstruction problem using the current frame and an 11-frame KV cache. It predicts local geometry and adjacent motion, then composes both into a stable global reconstruction.",
  links: [
    { label: "Tech Report", href: "assets/paper/ABot-Recon.pdf", icon: "file" },
    { label: "Code", href: "https://github.com/amap-cvlab/ABot-Recon", icon: "code" },
    { label: "Hugging Face", href: "https://huggingface.co/acvlab/ABot-Recon", icon: "download" },
    { label: "ModelScope", href: "https://modelscope.cn/models/amap_cvlab/ABot-Recon", icon: "download" },
    { label: "Online Demo", href: "https://modelscope.cn/studios/amap_cvlab/ABot-Recon", icon: "play" },
  ],
  metrics: [
    { value: "12", label: "frame context" },
    { value: "~50K", label: "stable frames" },
    { value: "0", label: "persistent long-range states" },
  ],
  capabilities: [
    { index: "01", title: "Fixed local target", text: "Prediction difficulty remains independent of elapsed sequence length." },
    { index: "02", title: "Stable rotation", text: "Temporal rotation refiner and composition-aware supervision reduce accumulated drift." },
    { index: "03", title: "Composable motion", text: "Adjacent relative poses recover the global trajectory through online composition." },
  ],
  demoScenes: [
    { category: "Driving", title: "Beijing Third Ring Road Driving", meta: "Long-range urban driving", device: "Dash camera", credit: { label: "Source: Bilibili", href: "https://www.bilibili.com/video/BV1TGxJeoE6H/?share_source=copy_web&vd_source=d4dc472ef901c502f53a0c400dc54dce" }, src: "assets/videos/sanhuan_compact_gray.mp4", poster: "assets/images/poster-driving-02.jpg" },
    { category: "Driving", title: "Wangjing Urban Driving", meta: "8.6 km · 48,656 frames · 27 min", device: "Dash camera", src: "assets/videos/wangjing_compact_gray.mp4", poster: "assets/images/poster-driving-wangjing.jpg" },
    { category: "Exploration", title: "WHU Campus Exploration", meta: "8.8 km · 14,338 frames · 20 min", device: "iPhone", src: "assets/videos/whu_compact_gray.mp4", poster: "assets/images/poster-campus-01.jpg" },
    { category: "Exploration", title: "ZJU Campus Exploration", meta: "11.3 km · 11,942 frames · 33 min", device: "iPhone", src: "assets/videos/zju_compact_gray.mp4", poster: "assets/images/poster-campus-02.jpg" },
    { category: "Exploration", title: "Indoor Exploration", meta: "Indoor exploration", device: "DJI Pocket 3", src: "assets/videos/ikea_compact_gray.mp4", poster: "" },
    { category: "Exploration", title: "Embodied Indoor Exploration", meta: "Indoor embodied exploration", device: "Quadruped Robot Locomotion", src: "assets/videos/changzhou_compact_gray.mp4", poster: "" },
  ],
  performance: {
    methods: ["LongStream", "LingBot-Map", "HorizonStream", "Ours"],
    colors: ["#66717c", "#55a6b8", "#e59b4a", "#3dd6e8"],
    metrics: [
      { label: "ATE ↓", unit: "m", direction: "down", values: [15.92, 7.32, 8.81, 4.35] },
      { label: "RPE-R ↓", unit: "°", direction: "down", values: [0.30, 2.29, 0.20, 0.12] },
      { label: "VRAM ↓", unit: "GB", direction: "down", values: [6.62, 18.87, 13.04, 6.71] },
      { label: "FPS ↑", unit: "", direction: "up", values: [10.36, 19.74, 8.02, 24.45] },
    ],
  },
  /* Each dataset carousel compares the same three methods across representative sequences. */
  datasetResults: [
    {
      title: "KITTI",
      sequences: [
        resultSequence("Sequence 05 · outdoor driving", "kitti-2", 2761),
        resultSequence("Sequence 00 · outdoor driving", "kitti-1", 4541),
        resultSequence("Sequence 07 · outdoor driving", "kitti-3", 1101),
        resultSequence("Sequence 09 · outdoor driving", "kitti-4", 1591),
      ],
    },
    {
      title: "Oxford Spires",
      sequences: [
        resultSequence("Bodleian Library 02 · indoor / outdoor", "oxford-1", 3840),
        resultSequence("Christ Church 05 · indoor / outdoor", "oxford-2", 3840),
        resultSequence("Keble College 03 · indoor / outdoor", "oxford-3", 3840),
        resultSequence("Observatory Quarter 01 · indoor / outdoor", "oxford-4", 3840),
      ],
    },
    {
      title: "VBR",
      sequences: [
        resultSequence("Campus 0 · hand-held traversal", "vbr-1", 12042),
        resultSequence("Campus 1 · hand-held traversal", "vbr-2", 11671),
        resultSequence("Pincio 0 · hand-held traversal", "vbr-3", 11142),
        resultSequence("Spagna 0 · hand-held traversal", "vbr-4", 14141),
      ],
    },
    {
      title: "Quadruped Robot",
      sequences: [
        resultSequence("AMAP HQ 1F · quadruped traversal", "dog-1", 2790, true),
        resultSequence("AMAP HQ 2F · quadruped traversal", "dog-2", 2194, true),
        resultSequence("AMAP HQ 30F · quadruped traversal", "dog-3", 1330, true),
        resultSequence("APEC · quadruped traversal", "dog-4", 728, true),
      ],
    },
  ],
  bibtex: `@article{abot_recon2026,
  title         = {Revisiting Local Context for Long-Horizon Streaming 3D Reconstruction},
  author        = {{AMAP CV Lab}},
  journal       = {arXiv preprint arXiv:TBD},
  year          = {2026},
  eprint        = {TBD},
  archivePrefix = {arXiv},
  primaryClass  = {cs.CV},
  doi           = {TBD},
  url           = {https://arxiv.org/abs/TBD}
}`,
};

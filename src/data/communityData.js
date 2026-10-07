export const INITIAL_SUBGEEKS = [
  { id: "all", name: "r/all", description: "The frontpage of GeekHub" },
  { id: "gamedev", name: "r/gamedev", description: "Game architecture, engines, & shaders" },
  { id: "rustaceans", name: "r/rust", description: "Memory safety, borrow checker, and blazingly fast systems" },
  { id: "cybersec", name: "r/netsec", description: "CTF writeups, vulnerability research, and cryptography" },
  { id: "anime_sci", name: "r/scifi_anime", description: "Evangelion lore, cyberpunk aesthetics, and mech builders" },
  { id: "hardware", name: "r/mechanicalkeyboards", description: "Custom PCB design, soldering, and tactile switches" }
];

export const INITIAL_POSTS = [
  {
    id: "post-1",
    subgeek: "rustaceans",
    author: "elena_rs",
    authorRole: "Mentor",
    authorSkills: ["rust", "neovim", "dnd", "arch"],
    authorFandoms: ["Warhammer 40k", "Ghost in the Shell"],
    title: "Looking for a mentee to build a toy WebGPU rendering engine in Rust from scratch",
    content: "I've been writing systems code for 4 years. Want to mentor someone eager to learn graphics pipelines, memory management, and compute shaders. Prefer someone comfortable with basic linear algebra.",
    upvotes: 42,
    commentCount: 14,
    timeAgo: "2 hours ago",
    badge: "1-on-1 Pair",
    comments: [
      { id: "c1", author: "mvance_ai", text: "Would love to join! I have a background in CUDA and PyTorch.", timeAgo: "1 hour ago", upvotes: 5 }
    ]
  },
  {
    id: "post-2",
    subgeek: "gamedev",
    author: "aria_quantum",
    authorRole: "Squad Leader",
    authorSkills: ["gamedev", "cpp", "indie", "pixel"],
    authorFandoms: ["Hollow Knight", "Metroid", "Studio Trigger"],
    title: "Assembling a 3-person squad for the upcoming 48-Hour Autumn Game Jam",
    content: "I'm handling UE5 gameplay mechanics and C++ gameplay systems. Need 1 audio/sound designer and 1 3D asset artist. Let's build a fast-paced cyberpunk speedrunner.",
    upvotes: 38,
    commentCount: 9,
    timeAgo: "4 hours ago",
    badge: "Squad Formation",
    comments: [
      { id: "c2", author: "maya_cosplay", text: "I can model hard-surface mech assets in Blender! Count me in.", timeAgo: "2 hours ago", upvotes: 7 }
    ]
  },
  {
    id: "post-3",
    subgeek: "cybersec",
    author: "hex_security",
    authorRole: "Member",
    authorSkills: ["cybersec", "go", "crypto", "open_source"],
    authorFandoms: ["Mr. Robot", "Tron: Legacy"],
    title: "Weekly CTF reverse engineering team: looking for someone deep into x86 assembly",
    content: "Our team regularly places top 50 globally. Looking for a partner who loves disassembly, Ghidra, and binary exploitation. Drop your skills or send a direct pair request.",
    upvotes: 27,
    commentCount: 6,
    timeAgo: "6 hours ago",
    badge: "Pair Search",
    comments: []
  },
  {
    id: "post-4",
    subgeek: "hardware",
    author: "marcus_v",
    authorRole: "Member",
    authorSkills: ["hardware", "python", "ai"],
    authorFandoms: ["Evangelion", "Steins;Gate"],
    title: "Showcase: Hand-wired Alice keyboard with custom rotary encoder and OLED display",
    content: "Took about 3 weekends of 3D printing, laser cutting acrylic plates, and soldering diodes directly. Happy to share the CAD files and QMK firmware firmware config if anyone wants to fork it.",
    upvotes: 64,
    commentCount: 19,
    timeAgo: "9 hours ago",
    badge: "Discussion",
    comments: []
  }
];

export const CURRENT_USER = {
  id: "curr-user",
  name: "You",
  handle: "alex_coder",
  role: "Learner",
  tags: ["rust", "react", "cybersec"],
  fandoms: ["Ghost in the Shell", "Cyberpunk 2077", "Hollow Knight"],
  stats: {
    tabVsSpace: "2 Spaces",
    favoriteIDE: "Neovim"
  }
};

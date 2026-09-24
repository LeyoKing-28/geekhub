export const SAMPLE_PROFILES = [
  {
    id: "profile-1",
    name: "Elena Rostova",
    handle: "elena_rs",
    age: 24,
    headline: "Senior Rustacean & Neon Cyberpunk Enthusiast",
    bio: "Looking for someone with zero memory leaks and high concurrency. On weekends, I run a 4-year D&D campaign in an Eberron cyberpunk homebrew. If you can explain the borrow checker to my cat, dinner is on me.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80",
    coverImg: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    distance: "2.4 km away",
    statusText: "Compiling shaders... ⚙️",
    compatibilityScore: 96,
    tags: [
      { id: "rust", label: "Rust & Memory Safety", category: "dev", icon: "Code2" },
      { id: "neovim", label: "Neovim + Lua", category: "dev", icon: "Terminal" },
      { id: "dnd", label: "D&D 5e Dungeon Master", category: "tabletop", icon: "Dice5" },
      { id: "cyberpunk", label: "Cyberpunk 2077 & Edgerunners", category: "gaming", icon: "Gamepad2" },
      { id: "arch", label: "I use Arch btw", category: "os", icon: "Cpu" },
      { id: "sci-fi", label: "Isaac Asimov & Dune", category: "books", icon: "BookOpen" }
    ],
    fandoms: ["Warhammer 40k", "Ghost in the Shell", "Doctor Who", "Studio Ghibli"],
    stats: {
      commitsThisYear: "1,420",
      topLangs: ["Rust", "TypeScript", "GLSL"],
      favoriteIDE: "Neovim",
      tabVsSpace: "2 Spaces",
      coffeeIndex: "Pour-over Ethiopian",
      alignment: "Chaotic Good"
    },
    prTitle: "feat(relationship): implement heart connection v2.0",
    prDescription: "Resolves #404 (Loneliness). Adds zero-allocation cuddle protocols, low-latency banter, and 24/7 sci-fi movie night sync.",
    quiz: {
      question: "Tabs vs Spaces, and why?",
      answer: "Spaces, because code should render identically regardless of your terminal setup. Fight me."
    }
  },
  {
    id: "profile-2",
    name: "Marcus Vance",
    handle: "mvance_ai",
    age: 26,
    headline: "ML Researcher & Retro Mech Anime Aficionado",
    bio: "Training diffusion models by day, assembling Gundam Master Grades by night. Looking for a co-pilot to debate Evangelion lore and build hackathon projects at 3 AM. Can cook a mean tonkotsu ramen.",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=700&q=80",
    coverImg: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    distance: "5.1 km away",
    statusText: "Epoch 84/100 • Loss: 0.0412 📉",
    compatibilityScore: 92,
    tags: [
      { id: "ai", label: "PyTorch & Transformers", category: "dev", icon: "Cpu" },
      { id: "gundam", label: "Gunpla Builder", category: "anime", icon: "Bot" },
      { id: "anime", label: "Evangelion & Cowboy Bebop", category: "anime", icon: "Tv" },
      { id: "mechanical_kb", label: "Custom Keyboards (Lubed Holy Pandas)", category: "hardware", icon: "Keyboard" },
      { id: "linux", label: "Debian Sid / Zsh", category: "os", icon: "Terminal" },
      { id: "synthwave", label: "Synthwave & Lo-Fi", category: "music", icon: "Headphones" }
    ],
    fandoms: ["Neon Genesis Evangelion", "Steins;Gate", "The Matrix", "Blade Runner 2049"],
    stats: {
      commitsThisYear: "980",
      topLangs: ["Python", "CUDA C++", "Julia"],
      favoriteIDE: "VS Code with Vim Keybindings",
      tabVsSpace: "4 Spaces",
      coffeeIndex: "Double Espresso",
      alignment: "True Neutral"
    },
    prTitle: "chore(heart): gradient descent into mutual affection",
    prDescription: "Fine-tuned hyper-parameters for optimal synergy. High validation accuracy on late-night arcade dates.",
    quiz: {
      question: "Sub or Dub?",
      answer: "Sub for Japanese voice acting nuances, but 90s Cowboy Bebop dub gets an honorary pass."
    }
  },
  {
    id: "profile-3",
    name: "Aria Chen",
    handle: "aria_quantum",
    age: 23,
    headline: "Game Dev & Speedrunner | Cozy Indie & Rogue-likes",
    bio: "Unreal Engine 5 specialist. I hold a top 10 speedrun leaderboard time in Celeste. When my builds aren't compiling, I'm playing Hollow Knight or collecting vintage Nintendo handhelds. Let's trade Steam libraries!",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80",
    coverImg: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
    distance: "1.8 km away",
    statusText: "Baking lightmaps... 💡",
    compatibilityScore: 89,
    tags: [
      { id: "gamedev", label: "Unreal Engine & C++", category: "dev", icon: "Gamepad2" },
      { id: "indie", label: "Celeste / Hades / Hollow Knight", category: "gaming", icon: "Flame" },
      { id: "pixel", label: "Pixel Art & Aseprite", category: "art", icon: "Palette" },
      { id: "switch", label: "OLED Switch & Steam Deck", category: "gaming", icon: "Sparkles" },
      { id: "zelda", label: "Zelda: Tears of the Kingdom", category: "gaming", icon: "Compass" }
    ],
    fandoms: ["Studio Trigger", "Metroid", "Doctor Who", "Portal"],
    stats: {
      commitsThisYear: "2,150",
      topLangs: ["C++", "C#", "HLSL"],
      favoriteIDE: "Rider",
      tabVsSpace: "Tabs (Accessibility matters!)",
      coffeeIndex: "Matcha Oat Latte",
      alignment: "Neutral Good"
    },
    prTitle: "fix(co-op): player 2 detected in lobby",
    prDescription: "Instantiates high-framerate multiplayer session. Guarantees pizza, split-screen Mario Kart, and endless joy.",
    quiz: {
      question: "Which gaming soundtrack gives you chills?",
      answer: "Christopher Larkin's Hollow Knight: City of Tears. Pure masterpiece."
    }
  },
  {
    id: "profile-4",
    name: "Devon 'Hex' Sterling",
    handle: "hex_security",
    age: 27,
    headline: "Ethical Hacker & Cryptography Nerd",
    bio: "Penetration tester, CTF addict, and amateur lockpicker. If your love language is mutual privacy, end-to-end encryption, and soldering custom hardware dongles, let's exchange PGP keys.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80",
    coverImg: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    distance: "7.8 km away",
    statusText: "Cracking cryptographic hashes 🔐",
    compatibilityScore: 94,
    tags: [
      { id: "infosec", label: "Offensive Security / Kali", category: "security", icon: "Shield" },
      { id: "crypto", label: "Zero-Knowledge & RSA", category: "dev", icon: "Lock" },
      { id: "flipper", label: "Flipper Zero & SDR", category: "hardware", icon: "Radio" },
      { id: "mr_robot", label: "Mr. Robot Fanatic", category: "media", icon: "Tv" },
      { id: "open_source", label: "FOSS Advocate", category: "dev", icon: "GitBranch" }
    ],
    fandoms: ["Mr. Robot", "Tron: Legacy", "Cyberpunk", "Ghost in the Shell"],
    stats: {
      commitsThisYear: "1,110",
      topLangs: ["Go", "Python", "Assembly x86"],
      favoriteIDE: "Helix / Tmux",
      tabVsSpace: "Tabs",
      coffeeIndex: "Cold Brew (Overnight steep)",
      alignment: "Chaotic Neutral"
    },
    prTitle: "security(firewall): whitelist mutual heart traffic",
    prDescription: "Bypasses intrusion defense system for designated VIP. Encrypted tunnel established with 4096-bit TLS.",
    quiz: {
      question: "Favorite Linux distribution?",
      answer: "NixOS for deterministic reproducible pain, Void for minimalism."
    }
  },
  {
    id: "profile-5",
    name: "Maya Lin",
    handle: "maya_cosplay",
    age: 25,
    headline: "Bioinformatician & Master Cosplayer",
    bio: "Cracking genome sequences with Python by day, 3D printing armor and styling wigs for Comic-Con by night. Seeking an adventure partner for conventions, escape rooms, and board game marathons.",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80",
    coverImg: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80",
    distance: "3.5 km away",
    statusText: "3D printer nozzle: 215°C 🖨️",
    compatibilityScore: 91,
    tags: [
      { id: "cosplay", label: "Cosplay & Prop Fabrication", category: "craft", icon: "Scissors" },
      { id: "bioinfo", label: "Genomics & BioPython", category: "science", icon: "Dna" },
      { id: "3dprint", label: "Bambu Lab 3D Printing", category: "hardware", icon: "Box" },
      { id: "boardgames", label: "Terraforming Mars & Settlers", category: "tabletop", icon: "Dice6" },
      { id: "genshin", label: "Genshin & Honkai Star Rail", category: "gaming", icon: "Sparkles" }
    ],
    fandoms: ["Arcane", "Frieren", "Lord of the Rings", "Monster Hunter"],
    stats: {
      commitsThisYear: "840",
      topLangs: ["Python", "R", "OpenSCAD"],
      favoriteIDE: "JupyterLab / VS Code",
      tabVsSpace: "4 Spaces",
      coffeeIndex: "Boba Milk Tea (Half sweet)",
      alignment: "Lawful Good"
    },
    prTitle: "feat(dna): complementary base pairing match found",
    prDescription: "Adenine bonded to Thymine. High annealing temperature; zero mismatched base pairs detected.",
    quiz: {
      question: "Ultimate board game night snack?",
      answer: "Chopsticks with Cheetos so our sleeves and board game pieces stay pristine!"
    }
  }
];

export const CATEGORIES = [
  { id: "all", label: "All Fandoms & Stacks", icon: "Compass" },
  { id: "dev", label: "Coding & Dev", icon: "Code2" },
  { id: "gaming", label: "Gaming & Esports", icon: "Gamepad2" },
  { id: "anime", label: "Anime & Manga", icon: "Tv" },
  { id: "tabletop", label: "D&D & Board Games", icon: "Dice5" },
  { id: "hardware", label: "Hardware & Keyboards", icon: "Cpu" },
  { id: "science", label: "Math & Science", icon: "Dna" },
  { id: "security", label: "Cybersec & CTF", icon: "Shield" }
];

export const INITIAL_MATCHES = [
  {
    id: "match-1",
    profileId: "profile-1",
    matchedAt: "10 mins ago",
    lastMessage: "Wait, you actually prefer Vim over VS Code? Prove it 😉",
    unread: 1,
    messages: [
      { id: 1, sender: "them", text: "Pull request merged! 🎉", time: "10:30 AM" },
      { id: 2, sender: "them", text: "I saw you like Rust and Cyberpunk. Have you played the Phantom Liberty expansion yet?", time: "10:32 AM" },
      { id: 3, sender: "me", text: "Yes! The dogtown vibe is unmatched. Plus the soundtrack is straight fire 🔥", time: "10:35 AM" },
      { id: 4, sender: "them", text: "Wait, you actually prefer Vim over VS Code? Prove it 😉", time: "10:37 AM" }
    ]
  }
];

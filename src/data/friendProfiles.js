export const GEEK_FRIENDS_POOL = [
  {
    id: "user-1",
    name: "Elena Rostova",
    handle: "elena_rs",
    age: 23,
    location: "Berlin / Remote",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    headline: "Rust systems hacker & cozy D&D dungeon master",
    skills: ["Rust", "Neovim", "WebGPU", "Linux"],
    fandoms: ["Warhammer 40k", "Cyberpunk", "Ghost in the Shell"],
    stats: { tabVsSpace: "2 Spaces", editor: "Neovim" },
    photos: [
      {
        url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
        caption: "My cyberpunk home battlestation. 34-inch ultrawide running Arch."
      },
      {
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
        caption: "Hand-painted miniatures for this weekend's tabletop campaign."
      }
    ],
    prompts: [
      {
        id: "p1",
        question: "My toxic dev trait is...",
        answer: "Refactoring working code into Rust at 2 AM just to satisfy the borrow checker."
      },
      {
        id: "p2",
        question: "Best way to break the ice with me:",
        answer: "Send me your dotfiles or tell me your most controversial sci-fi movie opinion."
      }
    ]
  },
  {
    id: "user-2",
    name: "Marcus Vance",
    handle: "marcus_v",
    age: 25,
    location: "Tokyo / Remote",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80",
    headline: "ML researcher & mechanical keyboard builder",
    skills: ["Python", "PyTorch", "Custom Keyboards", "CUDA"],
    fandoms: ["Evangelion", "Cowboy Bebop", "Steins;Gate"],
    stats: { tabVsSpace: "4 Spaces", editor: "VS Code (Vim mode)" },
    photos: [
      {
        url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
        caption: "Latest custom build: Lubed Holy Pandas on a brass plate Alice board."
      },
      {
        url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
        caption: "Vintage Gunpla corner in my apartment."
      }
    ],
    prompts: [
      {
        id: "p3",
        question: "Ideal weekend with a friend:",
        answer: "Late night ramen, building keyboards or coding hackathon prototypes together."
      },
      {
        id: "p4",
        question: "The anime that altered my brain chemistry:",
        answer: "Neon Genesis Evangelion. Still analyzing the ending 10 years later."
      }
    ]
  },
  {
    id: "user-3",
    name: "Aria Chen",
    handle: "aria_quantum",
    age: 22,
    location: "Seattle / Remote",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    headline: "Indie game dev & retro console restorer",
    skills: ["C++", "Unreal Engine 5", "Pixel Art", "Game Design"],
    fandoms: ["Hollow Knight", "Celeste", "Metroid", "Zelda"],
    stats: { tabVsSpace: "Tabs", editor: "Rider" },
    photos: [
      {
        url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
        caption: "Restored this GameBoy Color with an IPS backlit screen and transparent shell."
      }
    ],
    prompts: [
      {
        id: "p5",
        question: "A gaming soundtrack that gives me goosebumps:",
        answer: "City of Tears from Hollow Knight. Instant calm."
      },
      {
        id: "p6",
        question: "We'll get along if:",
        answer: "You enjoy cozy co-op games, trading Steam libraries, or debugging physics bugs together."
      }
    ]
  },
  {
    id: "user-4",
    name: "Devon 'Hex' Sterling",
    handle: "hex_sec",
    age: 26,
    location: "Amsterdam / Remote",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    headline: "Ethical hacker & hardware tinkerer",
    skills: ["Cybersec", "Go", "Assembly x86", "Flipper Zero"],
    fandoms: ["Mr. Robot", "Tron", "Blade Runner"],
    stats: { tabVsSpace: "Tabs", editor: "Helix" },
    photos: [
      {
        url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
        caption: "Soldering station & logic analyzer for hardware CTF challenges."
      }
    ],
    prompts: [
      {
        id: "p7",
        question: "Something introverted I love:",
        answer: "Spending 6 hours quietly reverse-engineering a binary while listening to ambient synthwave."
      }
    ]
  }
];

export const CURRENT_USER_PROFILE = {
  id: "curr-alex",
  name: "Alex",
  handle: "alex_coder",
  skills: ["Rust", "Neovim", "Cybersec", "Linux"],
  fandoms: ["Ghost in the Shell", "Cyberpunk", "Hollow Knight"],
  stats: { tabVsSpace: "2 Spaces", editor: "Neovim" }
};

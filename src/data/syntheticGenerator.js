import { SAMPLE_PROFILES } from './profiles';

const TECH_TAGS = [
  { id: 'react', label: 'React / Next.js', category: 'dev', icon: 'Code2' },
  { id: 'rust', label: 'Rust', category: 'dev', icon: 'Terminal' },
  { id: 'python', label: 'Python / PyTorch', category: 'dev', icon: 'Cpu' },
  { id: 'go', label: 'Go / Microservices', category: 'dev', icon: 'Terminal' },
  { id: 'cpp', label: 'C++ Systems', category: 'dev', icon: 'Cpu' },
  { id: 'cybersec', label: 'Cybersecurity & CTF', category: 'security', icon: 'Shield' },
  { id: 'gamedev', label: 'Unreal Engine', category: 'gaming', icon: 'Gamepad2' },
  { id: 'devops', label: 'Kubernetes & Docker', category: 'dev', icon: 'Box' }
];

const FANDOMS = [
  'Cyberpunk 2077', 'Evangelion', 'Dune', 'Warhammer 40k',
  'Lord of the Rings', 'Ghost in the Shell', 'Hollow Knight', 'Doctor Who'
];

const EDITORS = ['Neovim', 'VS Code', 'Emacs', 'Helix', 'Zed', 'IntelliJ'];
const INDENT = ['2 Spaces', '4 Spaces', 'Tabs'];

export function generateSyntheticUsers(count = 20) {
  const users = [...SAMPLE_PROFILES];
  for (let i = users.length + 1; i <= count; i++) {
    const randomTags = TECH_TAGS.sort(() => 0.5 - Math.random()).slice(0, 3);
    const randomFandoms = FANDOMS.sort(() => 0.5 - Math.random()).slice(0, 2);
    users.push({
      id: `synth-${i}`,
      name: `Geek_${i}`,
      handle: `hacker_${i}`,
      role: i % 2 === 0 ? 'Mentor / Backend' : 'Learner / Frontend',
      tags: randomTags,
      fandoms: randomFandoms,
      stats: {
        commitsThisYear: Math.floor(Math.random() * 2000 + 200),
        favoriteIDE: EDITORS[Math.floor(Math.random() * EDITORS.length)],
        tabVsSpace: INDENT[Math.floor(Math.random() * INDENT.length)]
      }
    });
  }
  return users;
}

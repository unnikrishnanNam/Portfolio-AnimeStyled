// All story content in one place. Facts come from Unnikrishnan_Master_Profile.md.

export const person = {
  name: 'Unnikrishnan Namboothiri',
  syllables: ['UN', 'NI', 'KRISH', 'NAN'],
  surname: 'NAMBOOTHIRI',
  title: 'Platform / Cloud-Native Engineer',
  email: 'unnikrishnan.professional@gmail.com',
  links: {
    github: 'https://github.com/unnikrishnanNam',
    linkedin: 'https://www.linkedin.com/in/unnikrishnan-namboothiri/',
    leetcode: 'https://leetcode.com/u/unnikrishnanNam/',
    // Drop a PDF at public/resume.pdf to switch the résumé buttons on.
    resume: '/resume.pdf',
  },
};

// Episode list drives the notch, the palette, and the title cards.
export const episodes = [
  { id: 'ep00', n: '00', name: 'Cold open', short: 'OP', ml: '' },
  { id: 'ep01', n: '01', name: 'Origin arc', short: 'Origin', ml: 'ഉത്ഭവം' },
  { id: 'ep02', n: '02', name: 'Training arc', short: 'Training', ml: 'പരിശീലനം' },
  { id: 'ep03', n: '03', name: 'Battle arc', short: 'Battle', ml: 'യുദ്ധം' },
  { id: 'ep04', n: '04', name: 'Journey arc', short: 'Journey', ml: 'യാത്ര' },
  { id: 'ep05', n: '05', name: 'Slice of life', short: 'Slice of life', ml: 'ജീവിതം' },
  { id: 'ep06', n: '06', name: 'Finale', short: 'Finale', ml: 'തുടരും' },
];

export const routine = ['100 kubectl commands.', '100 YAML files.', '100 failed pods.', '10 km of logs.', 'Every single day.'];

// Ranks are placeholders to tune. `form` is the breathing-form name flashed on hover.
export const skills = [
  { name: 'Kubernetes', rank: 'S', level: 0.95, form: 'Container Breathing, First Form: Rolling Update', loop: 'GIF-03' },
  { name: 'PostgreSQL · CNPG', rank: 'A', level: 0.84, form: 'Database Breathing, Third Form: Point-in-Time Recovery', loop: 'GIF-03' },
  { name: 'Java 21 · Spring Boot', rank: 'A', level: 0.82, form: 'Thread Breathing, Second Form: Virtual Threads', loop: 'GIF-03' },
  { name: 'Go', rank: 'A', level: 0.78, form: 'Gopher Breathing, Fourth Form: Goroutine Flurry', loop: 'GIF-03' },
  { name: 'NATS · Kafka · RabbitMQ', rank: 'B', level: 0.68, form: 'Message Breathing, Fifth Form: Exactly-Once Delivery', loop: 'GIF-03' },
  { name: 'Swift', rank: '???', level: 0.22, form: 'Notch Breathing, Form Zero: Still Learning', loop: 'R-01' },
];

export const licenses = [
  { name: 'CKA', note: 'Certified Kubernetes Administrator · 2026', state: 'gold' },
  { name: 'AWS CCP', note: 'Cloud Practitioner · 2025', state: 'on' },
  { name: 'Java SE 21', note: 'Oracle 1Z0-830 · charging', state: 'charging' },
];

export const protocols = ['DNP3', 'Modbus', 'IEEE 2030.5', 'OPC-UA', 'IEC 60870-5-104'];

export const bosses = [
  {
    id: 'interceptor', n: 1, art: 'BOSS-01', project: 'Interceptor', year: '2025',
    boss: 'The DROP TABLE Phantom',
    intro: 'A wild DROP TABLE Phantom appears! It targets production.',
    problem: 'One destructive query can wipe production.',
    moves: 'A PostgreSQL wire-protocol proxy that holds DROP, ALTER and TRUNCATE for human approval. JWT roles, a full audit trail, and a live SSE dashboard.',
    stack: ['Node.js', 'PostgreSQL wire protocol', 'SQLite', 'SSE', 'JWT'],
    repo: 'https://github.com/unnikrishnanNam/interceptor-v1',
    replay: 'interceptor',
    victory: [['Boss', 'DROP TABLE Phantom'], ['Held', 'DROP · ALTER · TRUNCATE'], ['Roles', 'Admin / Peer'], ['Loot', 'Every query audited'], ['Paper', 'Presented at ICACSDF, UPES Dehradun · 12 Sep 2026']],
    win: 'Just as planned.',
  },
  {
    id: 'vm', n: 2, art: 'BOSS-02', project: 'VM Provisioning Service', year: '2025',
    boss: 'The Ticket-Queue Sloth',
    intro: 'The Ticket-Queue Sloth blocks the road. Nobody has had a VM since Tuesday.',
    problem: 'Labs and dev teams wait ages for a configured VM.',
    moves: 'A Spring Boot API with RabbitMQ in front of libvirt. KVM/QEMU with QCOW2 base images and cloud-init, plus a Next.js self-service portal.',
    stack: ['Java', 'Spring Boot', 'RabbitMQ', 'KVM / QEMU', 'libvirt', 'cloud-init', 'Next.js'],
    repo: 'https://github.com/unnikrishnanNam/VM-Provisioning-Service',
    replay: 'vm',
    victory: [['Boss', 'Ticket-Queue Sloth'], ['Time to a VM', '10–15 s'], ['Hypervisor', 'KVM · libvirt'], ['Loot', 'cloud-init configs']],
    win: 'The Sloth is defeated. Your VM is ready.',
  },
  {
    id: 'queuectl', n: 3, art: 'BOSS-03', project: 'QueueCTL', year: '2025',
    boss: 'The Backlog Swarm',
    intro: 'The Backlog Swarm multiplies. Two workers just grabbed the same job.',
    problem: 'Hundreds of jobs pile up, and two workers grab the same one.',
    moves: 'A single-JAR queue on Java 21 virtual threads. Atomic UPDATE-based claiming, exponential backoff, a dead-letter queue, scheduled jobs and an embedded dashboard.',
    stack: ['Java 21', 'Virtual threads', 'SQLite', 'Embedded HTTP', 'Docker'],
    repo: 'https://github.com/unnikrishnanNam/QueueCTL',
    replay: 'queuectl',
    victory: [['Boss', 'Backlog Swarm'], ['Claiming', 'Exactly once'], ['External services', 'Zero'], ['Loot', 'One JAR']],
    win: 'Every job claimed once. The Swarm scatters.',
  },
];

export const finalBoss = {
  id: 'opscope', art: 'BOSS-04', project: 'Opscope', year: 'now',
  boss: 'The CrashLoop Hydra',
  problem: 'Cut one failing pod and two more appear. Dashboards show state, not why.',
  moves: 'Multi-cluster control, a live topology graph, a ⌘K palette and one-click fixes. A dependency graph and change timeline are in progress.',
  stack: ['Go', 'React', 'Kubernetes API'],
  repo: 'https://github.com/unnikrishnanNam/opscope',
};

export const bestiary = [
  { art: 'MINI-01', name: 'The Failover Kraken', project: 'CNPG HA Lab', text: 'A 3-instance CloudNativePG cluster on a hand-built kubeadm cluster, with WAL archiving and PITR.' },
  { art: 'MINI-02', name: 'The Distance Wyrm', project: 'VergeCDN', text: 'A self-hostable multi-node CDN with a Redis edge cache and socket invalidation.', repo: 'https://github.com/unnikrishnanNam/Verge-CDN' },
  { art: 'MINI-03', name: 'The SQL Gremlin', project: 'DataClerk', text: 'Ask your database questions in plain language. Read-only by design.', repo: 'https://github.com/unnikrishnanNam/Data-Agent-Lite' },
  { art: 'MINI-04', name: 'The Folder Maze', project: 'Xplore', text: 'A developer file explorer with a terminal, SSH and a command palette.', repo: 'https://github.com/unnikrishnanNam/xplore-v2' },
];

// Wheel of time: 8 spokes, 8 chapters, in date order.
export const chapters = [
  { when: 'Home', title: 'Kottayam, Kerala', text: 'Where the story starts: hills, monsoon rain, and a lot of questions about how computers work.', tile: 0 },
  { when: 'Oct 2022', title: 'Amrita Vishwa Vidyapeetham, Amritapuri', text: 'B.Tech in Computer Science begins, on the coast between the sea and the backwaters.', tile: 1 },
  { when: 'Feb – Jun 2025', title: 'Side-quest season', text: 'VM Provisioning Service, Xplore and VergeCDN. Building tools that did not exist yet.', tile: 1 },
  { when: 'Aug – Nov 2025', title: 'First license', text: 'AWS Cloud Practitioner. Interceptor and QueueCTL ship.', tile: 1 },
  { when: 'Dec 2025 – Feb 2026', title: 'Crossover episodes', text: 'A JPMorgan Chase job simulation with Kafka and Spring Boot. Open-source fixes merged into Zerodha’s Whatomate.', tile: 2 },
  { when: 'Apr – Aug 2026', title: 'Kalkitech, Kochi, and a rank up', text: 'SDE Intern in Energy IoT: HA PostgreSQL and a TLS-secured NATS cluster. Then the CKA, Graduate Engineer Trainee, and graduation on 8 August.', tile: 2 },
  { when: '12 Sep 2026', title: 'Tournament arc: ICACSDF, UPES Dehradun', text: 'Presenting “Smart Database Query Proxy”, the paper behind Interceptor, in a suit, in front of a giant stone wheel.', tile: 3 },
  { when: 'Now → next', title: 'Opscope, and the horizon', text: 'Building Opscope. The long-term goal: founding an infrastructure / B2B company.', tile: 3 },
];

export const tiles = [
  { art: 'BG-06a', name: 'Kottayam hills', tint: '#3f7d4e' },
  { art: 'BG-06b', name: 'Amritapuri coast', tint: '#2e9beb' },
  { art: 'BG-06d', name: 'Kochi skyline', tint: '#c98a3e' },
  { art: 'BG-06c', name: 'Dehradun foothills', tint: '#6c7a9b' },
];

export const inProduction = ['GlassNotch: the MacBook notch as a Liquid Glass island', 'A native macOS video editor', 'A self-hosted family cloud'];

// Slice of life: each photo is a manga panel with a sound effect. `pos` frames the crop.
export const photos = [
  { art: 'PH-01', caption: 'Drone shot. One very small drone, one very big sky.', sfx: 'BZZZ', pos: '50% 55%' },
  { art: 'PH-02', fallback: 'CH-05', caption: 'Hilltop. The clouds got there first.', sfx: 'FWOOSH', pos: '50% 50%' },
  { art: 'PH-03', caption: 'Day out with the squad. Nobody mentioned Kubernetes. Once.', sfx: 'HAHA!', pos: '50% 30%' },
  { art: 'PH-04', caption: 'Muffins, co-pilot. Strict about the playlist.', sfx: 'VROOM', pos: '50% 78%' },
];

export const sideQuests = [
  { name: 'GlassNotch', text: 'The MacBook notch as a Liquid Glass island.' },
  { name: 'Video editor', text: 'A native macOS video editor.' },
  { name: 'Family cloud', text: 'A self-hosted family cloud.' },
];
export const nightstand = 'The Indian business ecosystem. Long-term goal: an infrastructure company.';

export const reactions = [
  { id: 'R-01', label: 'Confused', emoji: '😵‍💫' },
  { id: 'R-02', label: 'Rage', emoji: '😡' },
  { id: 'R-03', label: 'Laughing', emoji: '😂' },
  { id: 'R-04', label: 'Shocked', emoji: '😱' },
  { id: 'R-05', label: 'Starry-eyed', emoji: '🤩' },
  { id: 'R-06', label: 'Sleepy', emoji: '😴' },
];

export const credits = [
  ['Starring', ['Unnikrishnan Namboothiri']],
  ['And introducing', ['Muffins']],
  ['Platform', ['Kubernetes', 'Helm', 'CloudNativePG', 'NATS / JetStream', 'Prometheus · Grafana']],
  ['Languages', ['Java 21', 'Go', 'TypeScript', 'Python', 'SQL', 'Kotlin', 'Swift (in training)']],
  ['Licenses', ['Certified Kubernetes Administrator', 'AWS Certified Cloud Practitioner']],
  ['Day job', ['Kalkitech · Energy IoT · Graduate Engineer Trainee']],
  ['Open source', ['Whatomate by Zerodha · −50% DB queries per webhook event']],
  ['Aerial unit', ['One very small drone']],
  ['Animation', ['GSAP · Lenis · Astro']],
  ['Filmed on location in', ['Kerala, India']],
];

export const kubectl = {
  'kubectl get episodes': `NAME                 STATUS             AGE
ep00-cold-open       Completed          4m
ep01-origin          Running            2022
ep02-training        Running            CKA
ep03-battle          Running            4 bosses
ep03-final-boss      CrashLoopBackOff   in progress
ep04-journey         Running            8 chapters
ep05-slice-of-life   Running            -
ep06-finale          Pending            next season`,
  'kubectl describe pod unnikrishnan': `Name:        unnikrishnan
Namespace:   kerala
Role:        platform-engineer
Certs:       CKA, AWS-CCP
Sidecars:    muffins (shih-tzu)
Status:      Running, open to opportunities`,
  'kubectl logs muffins': `[09:00] woke human
[09:01] demanded breakfast
[09:02] sat on keyboard
[09:03] deployed to prod (accidentally)`,
  'kubectl get pods -n kerala': `NAME            READY   STATUS    RESTARTS
unnikrishnan    1/1     Running   0
muffins         1/1     Running   47 (naps)`,
  'kubectl delete pod muffins': `Error from server (Forbidden): muffins is protected by a PodDisruptionBudget of 1 (one).`,
};
kubectl['kubectl get eps'] = kubectl['kubectl get episodes'];
kubectl['k get episodes'] = kubectl['kubectl get episodes'];

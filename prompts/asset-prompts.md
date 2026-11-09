# Prompt pack · Debug, Deploy, Adventure, Repeat

Prompts for every generated asset, written for ChatGPT. Storyboard: https://claude.ai/artifact/9Saj7x5VmU14HpFyKzEox8

## Setup

1. **Create a ChatGPT Project.** Name it "Debug, Deploy, Adventure, Repeat". Paste the style bible below into the project's instructions, so every chat in the project starts with it.
2. **Upload the reference files.** Add to the project files: your 5 photos and 5 Muffins photos from Reference Images/, the two trial stills, and the two trial GIFs.
3. **Make the model sheets first.** Generate REF-01 and REF-02 and regenerate until they are right. Everything else depends on them. Then upload both sheets to the project files too.
4. **One chat per group.** Start a new chat inside the project for each group (characters, backgrounds, bosses, loops). Attach the files listed on each card even if they are already in the project; explicit attachments keep the faces consistent.
5. **Save with the exact filename.** Put each result in assets/raw/<folder>/ using the filename on its card. For animations, save the GIF and the frames zip side by side.
6. **If transparency fails.** Ask again with: "Same image, but on a flat magenta #FF00FF background." The build pipeline keys magenta out.

## Style bible (paste into the ChatGPT Project instructions)

```text
You are the art department for an anime-styled portfolio website called "Debug, Deploy, Adventure, Repeat". Every image and animation in this project must share one look and follow the rules below.

STYLE
Trending anime art style with a 90s TV-anime soul. Confident line-work with slight weight variation. Minimal cel shading using flat, hard-edged shadow shapes. Bright, saturated colours and clean graphic lighting. Expressive, simplified faces with a huge emotional range. For comedy beats, exaggerated cartoonish proportions and stretched anatomy are welcome. Environments are slightly warped, with playful perspective and simplified objects. Energetic, lively and comedic. Fully stylized, never photorealistic.

HARD RULES (apply to every request unless it says otherwise)
1. No text of any kind: no letters, numbers, words, logos, brand marks, speech bubbles, captions, sound-effect lettering, signatures or watermarks. Screens and stickers show simple wordless shapes only.
2. Keep every character exactly on model with the attached model sheets and reference photos: same face, hair, glasses, skin tone and outfit details.
3. Never imitate or reference characters, costumes, symbols or logos from existing anime, manga or games.
4. Keep the whole subject inside the canvas with a little breathing room, unless the request asks for a crop.
5. "Transparent background" means a PNG with a true transparent background and clean edges, no white fringe. "Flat magenta background" means one solid #FF00FF fill: no gradient, no floor shadow, no glow, no vignette.
6. For animations: keep the camera, framing, scale, line-work and background identical across frames; only what the request says should move may move. Always also provide every frame as a separate PNG in a zip file.

THE HERO (match the attached photos and the REF-01 model sheet)
A tall, slim young South Indian software engineer in their early twenties. Warm brown skin. Thick, wavy black hair with lots of volume on top and shorter sides. Thin rectangular glasses with fine silver rims and a faint blue-violet lens tint. Friendly, confident face. A red thread bracelet on the right wrist and a black smartwatch on the left wrist.
- SIGNATURE OUTFIT (default): cream / off-white crew-neck sweatshirt, a dark bottle-green hoodie tied around the waist by its sleeves, off-white joggers, white sneakers.
- QUARTER-ZIP OUTFIT: plain white quarter-zip pullover (no print), dark trousers.
- MONSOON OUTFIT: bottle-green knit sweater, long grey scarf with red and cream stripes, off-white joggers.
- FORMAL OUTFIT: navy suit, white shirt, red lanyard with a blank white ID card.
- HIKE OUTFIT: signature sweatshirt and green hoodie at the waist, maroon-brown joggers, small dark backpack, trekking pole.

MUFFINS (match the attached Muffins photos and the REF-02 model sheet)
A small female Shih Tzu, the hero's dog. Long, flowing gold-and-white coat: golden-tan ears and back, white chest, legs and muzzle, a white blaze running up the middle of the forehead, darker brown tips on the long ear fur. Big round dark eyes, a black button nose, a slight underbite that shows tiny bottom teeth, often a happy tongue-out grin. A fluffy plumed tail that curls over her back. Anime-cute, but unmistakably a Shih Tzu. She stands just below the hero's knee.

PROPS
- THE LAPTOP: a space-grey MacBook Pro-style laptop with a display notch. The lid is covered in wordless stickers: a ship's wheel, a small elephant, a penguin, a steaming coffee cup and a paw print.
- THE DRONE: a palm-sized folding camera drone in light grey with four small propellers and a tiny camera gimbal.
```

## P0 · First playable build (15)

### REF-01 · Hero model sheet

- **Save as:** `assets/raw/reference/REF-01-hero-model-sheet.png`
- **Attach:** Image-1, Image-3, Image-4, Image-5 (photos) · Anime Avatar Chaos Collage.png · Debug, Deploy, Adventure, Repeat.png
- **Ratio:** 16:9 · **Background:** Plain white

```text
Create a character model sheet for THE HERO in the project style. Use the attached photos for the face, hair, glasses and build, and the two attached anime images for the art style.

Lay everything out on one plain white sheet, evenly spaced and clearly separated:
Row 1: a full-body turnaround in the SIGNATURE OUTFIT: front, three-quarter front, side profile and back. Neutral, relaxed standing pose, same scale, feet on one shared baseline. The green hoodie is tied at the waist in every view.
Row 2: six head-and-shoulders expressions: confident smirk; huge open-mouthed laugh; extreme confusion with spiral eyes; furious shouting; asleep and drooling; starry-eyed amazement.
Row 3: the props drawn on their own: THE LAPTOP open at a three-quarter angle, THE LAPTOP closed showing the sticker-covered lid, THE DRONE, and a trekking pole.

No labels, names or text anywhere on the sheet.
Output: 16:9, plain white background.
```

> Check: The face reads as you at a glance, the glasses are thin rectangles, and the hoodie is tied at the waist in every full-body view. Regenerate until it is right; every later prompt depends on this sheet.

### REF-02 · Muffins model sheet

- **Save as:** `assets/raw/reference/REF-02-muffins-model-sheet.png`
- **Attach:** Muffins-Image-1 … Muffins-Image-5 · REF-01
- **Ratio:** 16:9 · **Background:** Plain white

```text
Create a character model sheet for MUFFINS in the project style, using the attached photos of her for the coat colours, face and proportions.

Lay everything out on one plain white sheet, evenly spaced:
Row 1: sitting facing front; standing in side view; walking in three-quarter view; back view showing the plumed tail curled over her back. Next to the front view, draw the hero's lower leg in the signature outfit so her size is clear (her head reaches just below the knee).
Row 2: four head close-ups: happy tongue-out grin; cheeky underbite smirk with tiny bottom teeth showing; sleepy half-closed eyes; startled, ears up.
Row 3: mid-leap with ears and coat flying; curled up asleep.

No labels or text anywhere.
Output: 16:9, plain white background.
```

> Check: White forehead blaze, darker ear tips and the little underbite are all visible. She should look like a Shih Tzu, not a generic puppy.

### CH-01 · Pointing at you (OP hero shot)

- **Save as:** `assets/raw/characters/CH-01-pointing.png`
- **Attach:** REF-01 · Image-1 · Anime Avatar Chaos Collage.png (pose reference)
- **Ratio:** 4:5 · **Background:** Transparent

```text
The hero in the SIGNATURE OUTFIT points straight at the viewer with the right index finger. The arm thrusts toward the camera with dramatic foreshortening, so the hand is huge in the foreground. Head tilted slightly, confident smirk, a sharp white highlight across the glasses. Low camera angle, an energetic diagonal pose, hair and the tied hoodie sleeves whipping in the wind. Show the hero from mid-thigh up.
Output: 4:5, transparent background.
```

> Check: The pointing hand is crisp and correctly drawn (five fingers), and the face stays on model despite the foreshortening.

### CH-04 · Battle stance with the laptop

- **Save as:** `assets/raw/characters/CH-04-battle-stance.png`
- **Attach:** REF-01 · Image-4
- **Ratio:** 4:5 · **Background:** Transparent

```text
The hero in the QUARTER-ZIP OUTFIT in a fighting-game battle stance: feet wide apart, knees bent, leaning forward. The left arm holds THE LAPTOP open in front of the body like a shield, screen facing outward and glowing bright blue. The right hand is drawn back, fingers poised as if about to strike the keyboard like drawing a sword. A determined grin, glasses flashing white, hair blown back by an unseen wind. Full body, facing right.
Output: 4:5, transparent background.
```

> Check: Facing right (the bosses face left). The laptop reads clearly as a laptop with a notch.

### MUF-01 · Muffins, cheeky sit

- **Save as:** `assets/raw/muffins/MUF-01-sit-cheeky.png`
- **Attach:** REF-02 · Muffins-Image-1
- **Ratio:** 1:1 · **Background:** Transparent

```text
MUFFINS sitting upright and facing the viewer, head tilted, a cheeky underbite smirk showing her tiny bottom teeth, one ear flopped slightly forward, tail curled over her back, big shiny eyes. Full body.
Output: 1:1, transparent background.
```

> Check: She is used all over the site as the guide, so make sure you love this one.

### WHEEL-01 · The stone wheel (timeline)

- **Save as:** `assets/raw/props/WHEEL-01-stone-wheel.png`
- **Attach:** Image-2 (the wheel photo)
- **Ratio:** 1:1 · **Background:** Transparent

```text
A single ancient carved stone chariot wheel, like the great sundial wheels of Indian sun temples, inspired by the wheel in the attached photo, drawn in the project style with flat cel shading.
Strictly face-on: a perfect circle, centred, filling about 92% of the canvas, with no perspective tilt and no cast shadow. Eight thick spokes and eight thin spokes alternating at perfectly even intervals. A carved central hub with a small round medallion, a thick decorated rim with beading and floral carving. Warm sandstone colours with darker carved crevices.
Output: 1:1, transparent background.
```

> Check: It must be perfectly round, front-on and evenly spaced: the site rotates it in code, so any tilt or uneven spoke will wobble.

### BG-01 · Sky plate

- **Save as:** `assets/raw/backgrounds/BG-01-sky.png`
- **Attach:** Debug, Deploy, Adventure, Repeat.png (style reference)
- **Ratio:** 16:9, then 9:16 · **Background:** Scene

```text
A wide anime sky with nothing else in it: towering monsoon-season cumulus clouds, deep saturated blue at the top fading to pale blue near the bottom edge, sunlight edging the clouds with crisp white highlights, two or three tiny birds. No ground, no buildings, no people. Keep the left half calmer with fewer clouds, because large title text will sit there.
Output: 16:9. Then create a second version of the same sky at 9:16 for phones.
```

> Check: Save the phone version as BG-01-sky-9x16.png.

### BG-03 · Bedroom desk at night

- **Save as:** `assets/raw/backgrounds/BG-03-desk-night.png`
- **Attach:** REF-01 (props row, for the laptop)
- **Ratio:** 16:9, then 9:16 · **Background:** Scene

```text
Interior at night: a small bedroom study corner in a Kerala home, seen from a slightly high angle. A desk against a window streaked with rain. THE LAPTOP sits open on the desk and its cool blue screen is the main light source. Around it: a stack of thick technical books, a mug, a switched-off desk lamp, a coiled charger, a small potted plant. Blank posters on the wall. A round blue-and-black bean-bag dog bed on the floor. Warm-cool contrast, deep indigo shadows, cosy and a little messy. No people and no animals.
Keep the area in front of the laptop clear: a character will be animated asleep there.
Output: 16:9. Then a 9:16 version of the same room.
```

> Check: This exact image is attached to GIF-01 and GIF-02, so the room must look right before you animate.

### BG-07 · Kochi rooftop at golden hour

- **Save as:** `assets/raw/backgrounds/BG-07-rooftop-golden.png`
- **Attach:** Debug, Deploy, Adventure, Repeat.png (style reference)
- **Ratio:** 16:9, then 9:16 · **Background:** Scene

```text
Exterior at golden hour: the flat rooftop of an apartment building in Kochi, Kerala. A low parapet wall along the front, a water tank, potted plants, a string of unlit fairy lights. Beyond the roof: the Kochi skyline with mid-rise towers and glass IT-park buildings, coconut palms between the buildings, a strip of backwater shimmering in the distance, and the silhouettes of large cantilevered fishing nets on the far shore. The sky grades from warm orange to pink to violet, with a big low sun on the left. No people.
Keep the right-centre of the rooftop clear for two characters.
Output: 16:9. Then a 9:16 version.
```

> Check: This image is attached to GIF-06, so lock it in first.

### BOSS-01 · The DROP TABLE Phantom (Interceptor)

- **Save as:** `assets/raw/bosses/BOSS-01-drop-table-phantom.png`
- **Attach:** Anime Avatar Chaos Collage.png (style reference)
- **Ratio:** 1:1 · **Background:** Transparent

```text
An anime boss monster, comedic but menacing: a tall ragged phantom made of tattered black and crimson cloth and drifting shreds of paper, with a grinning white mask-like face, glowing red eyes and long skeletal fingers. In one hand it holds an open black notebook with blank pages, a pen poised over it. With the other hand it flicks at a database drawn as a stack of three glowing cyan disc-shaped cylinders, which is cracking and crumbling apart. Small fragments of empty table grids swirl around it. Floating, dynamic pose, facing left toward an unseen hero. Full body.
Output: 1:1, transparent background.
```

> Check: Blank notebook pages and blank table grids: no writing anywhere.

### BOSS-02 · The Ticket-Queue Sloth (VM Provisioning)

- **Save as:** `assets/raw/bosses/BOSS-02-ticket-queue-sloth.png`
- **Attach:** Anime Avatar Chaos Collage.png (style reference)
- **Ratio:** 1:1 · **Background:** Transparent

```text
An anime boss monster: a gigantic, lazy, moss-covered sloth beast sprawled on a mountain of blank paper request tickets and hourglasses. Heavy-lidded, half-asleep eyes and a smug yawn. One long claw holds a tiny hourglass whose sand barely moves. Cobwebs in its fur, and a few small rack-server boxes hugged in its arms like pillows. Funny, and menacing in a lazy way. Facing left. Full body including the ticket mountain.
Output: 1:1, transparent background.
```

> Check: It should read as slow and lazy at thumbnail size.

### BOSS-04 · The CrashLoop Hydra (Opscope, final boss)

- **Save as:** `assets/raw/bosses/BOSS-04-crashloop-hydra.png`
- **Attach:** Anime Avatar Chaos Collage.png (style reference)
- **Ratio:** 4:3 · **Background:** Transparent

```text
The final boss: a huge hydra serpent whose five long necks are built from stacked, glowing red and orange shipping containers that interlock like scales. One head is cracked open and sparking; from its broken stump, two smaller new heads are sprouting. Warning-red lights for eyes. Its body coils around a ruined server rack, with smoke and red sparks in the air. Truly boss-level and menacing, but still stylized and fun. Facing left, filling the frame.
Output: 4:3, transparent background.
```

> Check: The 'cut one head, two grow back' detail is the joke; make sure it is visible.

### GIF-01 · Asleep at the laptop (loop)

- **Save as:** `assets/raw/loops/GIF-01-asleep.gif`
- **Attach:** BG-03 · REF-01
- **Ratio:** 4:3 · **Background:** BG-03 as the set

```text
Create a seamless looping animated GIF: 10 frames at about 220 ms per frame (limited animation, like 90s TV anime). Use the attached BG-03 image as the exact set, cropped to 4:3 around the desk.

The hero, in the SIGNATURE OUTFIT, is fast asleep slumped over the desk, cheek resting on folded arms beside the glowing laptop, glasses pushed crooked, mouth open. Animate only: slow breathing (shoulders rise and fall), a small sleep bubble at the nose inflating and shrinking, and a strand of hair fluttering. The last frame flows back into the first.

Camera locked, background identical in every frame. Also give me the 10 frames as separate PNGs in a zip.
Output: 4:3.
```

> Check: Frame 1 of this GIF is the starting frame for GIF-02, so keep it.

### GIF-02 · Muffins licks the hero awake (one-shot)

- **Save as:** `assets/raw/loops/GIF-02-wake-up.gif`
- **Attach:** GIF-01 frame 1 (PNG from the zip) · REF-02 · BG-03
- **Ratio:** 4:3 · **Background:** BG-03 as the set

```text
Create an animated GIF that plays once and does not loop: 12 frames at about 150 ms per frame. Start from the attached frame exactly: same set, camera and lighting.

MUFFINS hops up onto the desk from the bottom-left, plants her front paws on the sleeping hero's shoulder and gives a big lick on the cheek. The hero's eyes snap wide open, the whole body jolts upright, glasses fly crooked, hair spikes up in shock with comic shock lines. Final frame: the hero wide awake and staring at the viewer, Muffins sitting proudly on the desk with her tongue out.

Camera locked. Also give me the 12 frames as separate PNGs in a zip.
Output: 4:3.
```

> Check: Frame 1 must match GIF-01 frame 1 exactly so the cut is invisible.

### GIF-04 · Walk cycle (scroll-scrubbed)

- **Save as:** `assets/raw/loops/GIF-04-walk-cycle.gif`
- **Attach:** REF-01 · Image-3
- **Ratio:** 1:1 · **Background:** Flat magenta

```text
Create a seamless 8-frame walk-cycle GIF at about 110 ms per frame. The hero in the SIGNATURE OUTFIT with a small dark backpack, in strict side profile facing right, walking in place: the character does not move across the frame.

Standard walk cycle: contact, down, passing and up positions for each leg. Arms swing naturally, the tied hoodie sleeves bounce, hair bobs slightly. Feet stay on the same baseline in every frame; the scale and position of the character are identical across frames. Cheerful, determined expression.

Flat magenta background. Also give me the 8 frames as separate PNGs in a zip.
Output: 1:1.
```

> Check: Play it on loop: if the character slides or bobs out of place, ask for the frames again with the feet locked to one baseline. Scroll drives these frames directly.

## P1 · The full site (25)

### CH-02 · Arms crossed, side glance (Origin)

- **Save as:** `assets/raw/characters/CH-02-arms-crossed.png`
- **Attach:** REF-01 · Image-4
- **Ratio:** 4:5 · **Background:** Transparent

```text
The hero in the QUARTER-ZIP OUTFIT, arms crossed, body facing the viewer, head turned to look off to the left with a calm, thoughtful half-smile, as in the attached photo. Soft rim light from the left. Waist-up.
Output: 4:5, transparent background.
```

> Check: Keep the smartwatch visible on the crossed arm, like the photo.

### CH-03 · Victory jump

- **Save as:** `assets/raw/characters/CH-03-victory.png`
- **Attach:** REF-01
- **Ratio:** 4:5 · **Background:** Transparent

```text
The hero in the SIGNATURE OUTFIT leaps into the air in a victory pose: one fist punched high, the other arm pumping, a huge open-mouthed laugh with eyes squeezed shut in joy, hoodie sleeves and hair flying, small sparkles around. Full body, mid-air.
Output: 4:5, transparent background.
```

### CH-05 · Hiker on the ridge

- **Save as:** `assets/raw/characters/CH-05-hiker.png`
- **Attach:** REF-01 · Image-3
- **Ratio:** 3:4 · **Background:** Transparent

```text
The hero in the HIKE OUTFIT stands tall on a small rocky outcrop, one foot up on a higher rock, leaning on the trekking pole and gazing toward the right horizon with a wide grin, wind in the hair and in the tied hoodie, as in the attached photo. Full body including the rock.
Output: 3:4, transparent background.
```

### CH-06 · Presenting at ICACSDF (formal)

- **Save as:** `assets/raw/characters/CH-06-formal.png`
- **Attach:** REF-01 · Image-2
- **Ratio:** 3:4 · **Background:** Transparent

```text
The hero in the FORMAL OUTFIT, standing very straight with hands at the sides, proud but a little stiff, a polite closed-mouth smile and one comic bead of nervous sweat at the temple, as in the attached photo. The ID card on the lanyard is blank. Full body.
Output: 3:4, transparent background.
```

> Check: This is composited in front of the wheel, so do not draw the wheel here.

### MUF-02 · Muffins asleep in her bean bag

- **Save as:** `assets/raw/muffins/MUF-02-asleep-beanbag.png`
- **Attach:** REF-02 · Muffins-Image-3
- **Ratio:** 3:2 · **Background:** Transparent

```text
MUFFINS curled up asleep in a round blue-and-black faux-leather bean-bag dog bed, nose tucked against her tail, one long ear draped over the edge, a tiny peaceful smile. Include the whole bed.
Output: 3:2, transparent background.
```

### MUF-03 · Muffins mid-leap

- **Save as:** `assets/raw/muffins/MUF-03-leap.png`
- **Attach:** REF-02
- **Ratio:** 1:1 · **Background:** Transparent

```text
MUFFINS leaping joyfully to the right, all four paws off the ground, long ears and coat streaming behind her, tongue out, eyes squeezed happy, a few speed lines. Full body.
Output: 1:1, transparent background.
```

### BOSS-03 · The Backlog Swarm (QueueCTL)

- **Save as:** `assets/raw/bosses/BOSS-03-backlog-swarm.png`
- **Attach:** Anime Avatar Chaos Collage.png (style reference)
- **Ratio:** 1:1 · **Background:** Transparent

```text
An anime boss monster: hundreds of tiny identical gremlins, each carrying a small sealed parcel, piled on top of each other to form one huge towering monster shape. Two big glaring eyes are made of clustered gremlins. Around the edges some gremlins fall off and two of them fight over the same parcel. Chaotic, dense and funny. Facing left.
Output: 1:1, transparent background.
```

### BG-02 · Kochi skyline layer

- **Save as:** `assets/raw/backgrounds/BG-02-kochi-skyline.png`
- **Attach:** BG-07 (to match the city)
- **Ratio:** 16:9 · **Background:** Transparent sky

```text
A horizontal strip of the Kochi skyline in bright midday light, seen from rooftop level: mid-rise apartment blocks, glass IT-park towers, a few coconut palms, water tanks and antennas on the roofs. The buildings fill only the bottom 55% of the image; everything above the rooftops is transparent.
Output: 16:9, transparent background above the buildings.
```

> Check: It sits in front of the BG-01 sky in the OP, in parallax.

### BG-04 · Server-rack dojo

- **Save as:** `assets/raw/backgrounds/BG-04-server-dojo.png`
- **Attach:** Anime Avatar Chaos Collage.png (style reference)
- **Ratio:** 16:9 · **Background:** Scene

```text
Interior of a training hall: polished wooden floor and sliding paper screens, but the pillars are tall black server racks with blinking green and blue lights. Bundles of cables hang from the ceiling like climbing ropes, a wooden training dummy wears a headset, and a wall rack holds keyboards like practice swords. Warm lantern light mixed with green LED glow. No people.
Output: 16:9.
```

### BG-05 · Storm arena

- **Save as:** `assets/raw/backgrounds/BG-05-storm-arena.png`
- **Attach:** Anime Avatar Chaos Collage.png (style reference)
- **Ratio:** 16:9 · **Background:** Scene

```text
A wide battle arena at dusk in a violent storm: a cracked circular stone platform floating above a sea of clouds, forked lightning, a swirling red-orange and violet sky, broken server parts floating around the platform. The centre of the platform is empty for two fighters.
Output: 16:9.
```

### BG-06a · Journey tile 1: Kottayam hills

- **Save as:** `assets/raw/backgrounds/BG-06a-kottayam.png`
- **Attach:** Debug, Deploy, Adventure, Repeat.png (style reference)
- **Ratio:** 16:9 · **Background:** Scene

```text
Tile 1 of 4 for a side-scrolling scene, flat side view: the rolling green hills of Kottayam, Kerala, just after rain. Rows of rubber trees, a small Kerala house with a sloping red-tiled roof, mist in the valleys, a clean sky. A narrow dirt path runs straight across the whole image from the left edge to the right edge at exactly 80% of the image height. The horizon sits at 45% of the image height. No people.
The left and right edges must be able to join seamlessly with neighbouring tiles: keep the path and the horizon at the same heights on both edges.
Output: 16:9.
```

> Check: Same path height and horizon in all four tiles. Generate b, c and d in the same chat and attach this one.

### BG-06b · Journey tile 2: Amritapuri coast

- **Save as:** `assets/raw/backgrounds/BG-06b-amritapuri.png`
- **Attach:** BG-06a
- **Ratio:** 16:9 · **Background:** Scene

```text
Tile 2 of 4, continuing the attached tile with the same path height (80%), horizon (45%) and lighting: the coast at Amritapuri, Kerala. A thin strip of land between the Arabian Sea on the far side and calm backwaters in front, coconut palms leaning in the breeze, a traditional houseboat drifting on the backwater, a white campus building far in the distance. The path continues edge to edge. No people.
Output: 16:9.
```

### BG-06c · Journey tile 3: Dehradun foothills

- **Save as:** `assets/raw/backgrounds/BG-06c-dehradun.png`
- **Attach:** BG-06b · WHEEL-01 · Image-2
- **Ratio:** 16:9 · **Background:** Scene

```text
Tile 3 of 4, continuing the attached tile with the same path height (80%) and horizon (45%): the foothills of the Himalayas near Dehradun. Layered blue-green ridges, sal forest, cool clear light. On the right half, a landscaped garden terrace with a low stone wall where the giant carved stone wheel from the attached images stands upright, flanked by two small carved statues, as in the photo. The path continues edge to edge in front of it. No people.
Output: 16:9.
```

> Check: The hero in CH-06 will stand on the path in front of the wheel.

### BG-06d · Journey tile 4: Kochi

- **Save as:** `assets/raw/backgrounds/BG-06d-kochi.png`
- **Attach:** BG-06c · BG-07
- **Ratio:** 16:9 · **Background:** Scene

```text
Tile 4 of 4, continuing the attached tile with the same path height (80%) and horizon (45%): arriving in Kochi. Glass IT-park towers, an elevated metro line on pillars, coconut palms, early-evening light starting to warm. The path turns into a pavement and continues to the right edge. No people.
Output: 16:9.
```

### EC-01 · Eyecatch 1: Muffins bursts through

- **Save as:** `assets/raw/eyecatch/EC-01.png`
- **Attach:** REF-01 · REF-02 · MUF-03
- **Ratio:** 16:9 · **Background:** Flat signal yellow

```text
Eyecatch card art: MUFFINS leaps toward the viewer, bursting through a torn sheet of paper, while the hero dives behind her with arms outstretched and a panicked face, trying to catch her. Comic speed lines. Background: one flat signal-yellow colour (#FFD23F). The characters fill the right 60% of the image; keep the left 40% completely empty flat yellow for a logo.
Output: 16:9.
```

### EC-02 · Eyecatch 2: asleep on the keyboard

- **Save as:** `assets/raw/eyecatch/EC-02.png`
- **Attach:** REF-01 · REF-02
- **Ratio:** 16:9 · **Background:** Flat sky blue

```text
Eyecatch card art: MUFFINS asleep, sprawled belly-up across the open laptop keyboard. Beside her, a chibi version of the hero clutches their head with both hands in exaggerated despair, big sweat drops flying. Background: one flat sky-blue colour (#2E9BEB). Characters on the left 60%; the right 40% stays empty flat blue for a logo.
Output: 16:9.
```

### EC-03 · Eyecatch 3: banana chips

- **Save as:** `assets/raw/eyecatch/EC-03.png`
- **Attach:** REF-01 · REF-02
- **Ratio:** 16:9 · **Background:** Flat sunset orange

```text
Eyecatch card art: chibi versions of the hero and MUFFINS sit side by side on a rooftop parapet, sharing a plate of Kerala banana chips. Muffins is sneakily stealing one while the hero looks the other way. Background: one flat warm sunset-orange colour. Characters sit in the lower half, centred; the top half stays empty flat orange for a logo.
Output: 16:9.
```

### GIF-03 · Furious typing (loop)

- **Save as:** `assets/raw/loops/GIF-03-typing.gif`
- **Attach:** REF-01
- **Ratio:** 1:1 · **Background:** Flat magenta

```text
Create a seamless looping GIF: 8 frames at about 150 ms per frame. The hero in the QUARTER-ZIP OUTFIT sits cross-legged with THE LAPTOP on their lap, seen from the front, typing furiously: hands blur into smear frames, intense focused face, glasses glowing white with the screen's reflection, small speed lines around the hands. Only the hands, head bob and glasses glare move.
Flat magenta background. Also give me the frames as separate PNGs in a zip.
Output: 1:1.
```

### GIF-05 · Victory fist pump (loop)

- **Save as:** `assets/raw/loops/GIF-05-fist-pump.gif`
- **Attach:** REF-01 · CH-03
- **Ratio:** 1:1 · **Background:** Flat magenta

```text
Create a seamless looping GIF: 9 frames at about 180 ms per frame. The hero in the SIGNATURE OUTFIT, waist-up, pumps a fist upward twice with a huge grin, sparkles popping on each pump, then eases back to the start pose. Never neutral; always celebrating.
Flat magenta background. Also give me the frames as separate PNGs in a zip.
Output: 1:1.
```

### GIF-06 · Goodbye wave with Muffins (loop)

- **Save as:** `assets/raw/loops/GIF-06-wave.gif`
- **Attach:** BG-07 · REF-01 · REF-02
- **Ratio:** 4:3 · **Background:** BG-07 as the set

```text
Create a seamless looping GIF: 10 frames at about 220 ms per frame. Use the attached BG-07 rooftop as the exact set, cropped to 4:3. The hero in the SIGNATURE OUTFIT stands at right-centre, waving to the viewer with a warm smile. MUFFINS sits at the hero's feet, wagging her plumed tail and tilting her head. Hair and hoodie sleeves stir in the evening breeze.
Camera locked, background identical in every frame. Also give me the frames as separate PNGs in a zip.
Output: 4:3.
```

### GIF-08 · Pet Muffins (loop)

- **Save as:** `assets/raw/loops/GIF-08-pet-muffins.gif`
- **Attach:** Animated Confused Reaction Sequence.gif · REF-02
- **Ratio:** Same as the trial GIF (~9:8) · **Background:** Rock wall, as in the trial GIFs

```text
Create a seamless looping GIF in the same 90s anime style, set and framing as the attached reaction GIF: 9 frames at about 220 ms per frame. MUFFINS in close-up against the same rocky, leafy backdrop. A human hand wearing a red thread bracelet pats her head; she squeezes her eyes shut happily, tongue out, ears bouncing, little heart sparkles popping. Ease into the happiest frame and back, never neutral, forming a seamless loop.
Also give me the frames as separate PNGs in a zip.
Output: same size and ratio as the attached GIF.
```

> Check: It sits in the same TV frame as the reaction GIFs, so the backdrop must match.

### R-03 · Reaction: Laughing

- **Save as:** `assets/raw/reactions/R-03-laughing.gif`
- **Attach:** Animated Confused Reaction Sequence.gif · Anime Rage Escalation Montage (0.5x).gif · REF-01
- **Ratio:** Same as the trial GIFs (~9:8) · **Background:** Rock wall, as in the trial GIFs

```text
Using the attached reaction GIFs as the template for set, framing, outfit, size and timing, create a matching seamless looping GIF of the same subject in 90s anime style: expressive eyes, simplified facial shapes, flat cel-shading, soft colours. 9 frames at about 220 ms per frame. Begin fully stylized, already reacting.

The reaction is uncontrollable laughter: it starts as a snort, escalates to doubled-over laughing with tears flying and the mouth wide open, slight squash and stretch on the body, then softens back to a big grin.

Allow expression-specific facial distortion and playful visual effects. Ease into the peak and back out, then soften slightly back to the starting pose, never neutral, so it loops seamlessly. Keep identity, line-work and framing consistent with the attached GIFs. No photorealism, no text. Also give me the frames as separate PNGs in a zip.
```

> Check: This is your original GIF prompt with the reaction filled in, so it should match R-01 and R-02.

### R-04 · Reaction: Shocked

- **Save as:** `assets/raw/reactions/R-04-shocked.gif`
- **Attach:** Animated Confused Reaction Sequence.gif · Anime Rage Escalation Montage (0.5x).gif · REF-01
- **Ratio:** Same as the trial GIFs (~9:8) · **Background:** Rock wall, as in the trial GIFs

```text
Using the attached reaction GIFs as the template for set, framing, outfit, size and timing, create a matching seamless looping GIF of the same subject in 90s anime style: expressive eyes, simplified facial shapes, flat cel-shading, soft colours. 9 frames at about 220 ms per frame. Begin fully stylized, already reacting.

The reaction is pure shock: the jaw drops comically far, glasses pop off the face for a frame, eyes turn into tiny white dots, hair stands straight up, then recovers partway with a hand on the chest.

Allow expression-specific facial distortion and playful visual effects. Ease into the peak and back out, then soften slightly back to the starting pose, never neutral, so it loops seamlessly. Keep identity, line-work and framing consistent with the attached GIFs. No photorealism, no text. Also give me the frames as separate PNGs in a zip.
```

> Check: This is your original GIF prompt with the reaction filled in, so it should match R-01 and R-02.

### R-05 · Reaction: Starry-eyed

- **Save as:** `assets/raw/reactions/R-05-starryeyed.gif`
- **Attach:** Animated Confused Reaction Sequence.gif · Anime Rage Escalation Montage (0.5x).gif · REF-01
- **Ratio:** Same as the trial GIFs (~9:8) · **Background:** Rock wall, as in the trial GIFs

```text
Using the attached reaction GIFs as the template for set, framing, outfit, size and timing, create a matching seamless looping GIF of the same subject in 90s anime style: expressive eyes, simplified facial shapes, flat cel-shading, soft colours. 9 frames at about 220 ms per frame. Begin fully stylized, already reacting.

The reaction is starry-eyed amazement: the eyes turn into big sparkling stars, hands clasp under the chin, cheeks blush, sparkles and small flowers float up, then settles into a dreamy smile.

Allow expression-specific facial distortion and playful visual effects. Ease into the peak and back out, then soften slightly back to the starting pose, never neutral, so it loops seamlessly. Keep identity, line-work and framing consistent with the attached GIFs. No photorealism, no text. Also give me the frames as separate PNGs in a zip.
```

> Check: This is your original GIF prompt with the reaction filled in, so it should match R-01 and R-02.

### R-06 · Reaction: Sleepy

- **Save as:** `assets/raw/reactions/R-06-sleepy.gif`
- **Attach:** Animated Confused Reaction Sequence.gif · Anime Rage Escalation Montage (0.5x).gif · REF-01
- **Ratio:** Same as the trial GIFs (~9:8) · **Background:** Rock wall, as in the trial GIFs

```text
Using the attached reaction GIFs as the template for set, framing, outfit, size and timing, create a matching seamless looping GIF of the same subject in 90s anime style: expressive eyes, simplified facial shapes, flat cel-shading, soft colours. 9 frames at about 220 ms per frame. Begin fully stylized, already reacting.

The reaction is sleepiness: eyelids droop, a huge yawn, the head nods forward, a sleep bubble grows at the nose, a tiny jolt awake, then the eyelids droop again.

Allow expression-specific facial distortion and playful visual effects. Ease into the peak and back out, then soften slightly back to the starting pose, never neutral, so it loops seamlessly. Keep identity, line-work and framing consistent with the attached GIFs. No photorealism, no text. Also give me the frames as separate PNGs in a zip.
```

> Check: This is your original GIF prompt with the reaction filled in, so it should match R-01 and R-02.

## P2 · Polish and easter eggs (12)

### CH-07 · Monsoon crouch

- **Save as:** `assets/raw/characters/CH-07-monsoon.png`
- **Attach:** REF-01 · Image-5
- **Ratio:** 4:5 · **Background:** Transparent

```text
The hero in the MONSOON OUTFIT crouching on one knee, forearm resting on the knee, smiling warmly at the viewer, a wireless earbud in one ear, the striped scarf hanging down, as in the attached photo. Full body.
Output: 4:5, transparent background.
```

### CH-08 · Deadpan "OK" face (one-click gag)

- **Save as:** `assets/raw/characters/CH-08-deadpan.png`
- **Attach:** REF-01
- **Ratio:** 4:5 · **Background:** Transparent

```text
A deliberately ultra-simplified, low-detail drawing of the hero in the SIGNATURE OUTFIT for a comedy beat: blank dot eyes behind the glasses, a tiny flat line for a mouth, completely unimpressed. One hand is lazily extended with a single finger, as if it has just tapped a button without looking. Much simpler line-work than the normal style, almost a doodle, while the hair, glasses and outfit stay recognisable. Waist-up.
Output: 4:5, transparent background.
```

> Check: The contrast with the detailed art is the joke.

### DRONE-01 · The drone

- **Save as:** `assets/raw/props/DRONE-01.png`
- **Attach:** REF-01 (props row)
- **Ratio:** 1:1 · **Background:** Transparent

```text
THE DRONE on its own, hovering in a three-quarter view: four propellers shown as soft motion-blur discs, the tiny camera gimbal tilted toward the viewer, a small status light glowing. Cute and slightly heroic, like a little companion.
Output: 1:1, transparent background.
```

### GIF-07 · Muffins trot cycle

- **Save as:** `assets/raw/loops/GIF-07-muffins-trot.gif`
- **Attach:** REF-02
- **Ratio:** 1:1 · **Background:** Flat magenta

```text
Create a seamless 8-frame trot-cycle GIF at about 100 ms per frame. MUFFINS in strict side profile facing right, trotting in place: she does not move across the frame. Ears, coat and plumed tail bounce with each step, tongue out, happy eyes. Paws stay on one shared baseline; identical scale and position in every frame.
Flat magenta background. Also give me the frames as separate PNGs in a zip.
Output: 1:1.
```

### MINI-01 · The Failover Kraken (CNPG HA Lab)

- **Save as:** `assets/raw/bosses/MINI-01.png`
- **Attach:** Anime Avatar Chaos Collage.png (style reference) · BOSS-01 (to match the boss family)
- **Ratio:** 1:1 · **Background:** Transparent

```text
A small, cute-menacing anime monster for a bestiary, in the same family as the attached boss but chibi-sized and less threatening: a smug little kraken whose tentacles each hug a glowing cyan database cylinder; one cylinder is slipping out of its grip and falling. Facing left, full body, a slightly dazed look as if about to be defeated in one hit.
Output: 1:1, transparent background.
```

### MINI-02 · The Distance Wyrm (VergeCDN)

- **Save as:** `assets/raw/bosses/MINI-02.png`
- **Attach:** Anime Avatar Chaos Collage.png (style reference) · BOSS-01 (to match the boss family)
- **Ratio:** 1:1 · **Background:** Transparent

```text
A small, cute-menacing anime monster for a bestiary, in the same family as the attached boss but chibi-sized and less threatening: a long, thin, sleepy serpent-dragon whose body is a tangle of network cables stretched across a small globe, yawning slowly. Facing left, full body, a slightly dazed look as if about to be defeated in one hit.
Output: 1:1, transparent background.
```

### MINI-03 · The SQL Gremlin (DataClerk)

- **Save as:** `assets/raw/bosses/MINI-03.png`
- **Attach:** Anime Avatar Chaos Collage.png (style reference) · BOSS-01 (to match the boss family)
- **Ratio:** 1:1 · **Background:** Transparent

```text
A small, cute-menacing anime monster for a bestiary, in the same family as the attached boss but chibi-sized and less threatening: a small mischievous gremlin juggling crumpled blank paper scraps and a magnifying glass, looking confused and pleased with itself. Facing left, full body, a slightly dazed look as if about to be defeated in one hit.
Output: 1:1, transparent background.
```

### MINI-04 · The Folder Maze (Xplore)

- **Save as:** `assets/raw/bosses/MINI-04.png`
- **Attach:** Anime Avatar Chaos Collage.png (style reference) · BOSS-01 (to match the boss family)
- **Ratio:** 1:1 · **Background:** Transparent

```text
A small, cute-menacing anime monster for a bestiary, in the same family as the attached boss but chibi-sized and less threatening: a living labyrinth creature built from stacked manila folders and filing drawers, with curious eyes peeking out of half-open drawers. Facing left, full body, a slightly dazed look as if about to be defeated in one hit.
Output: 1:1, transparent background.
```

### PH-01 · Polaroid: Drone shot

- **Save as:** `assets/raw/photos/PH-01.png`
- **Attach:** one of your favourite DJI Neo 2 aerial photos
- **Ratio:** 4:5 · **Background:** Scene

```text
Create a trending anime art style image from the uploaded subject. Use confident line-work with slight variation and minimal cel shading using flat shadow shapes. Use bright, saturated colors and clean graphic lighting. The style is defined by exaggerated, cartoonish character proportions featuring highly expressive, simplistic facial features that allow for immense emotional range, with highly varied stretched anatomy. Transform the environment into a slightly warped space with playful perspective distortion and simplified objects. Composition and tone should be energetic, lively, and comedic in a fully stylized, non-realistic world.

Keep the composition of the attached photo. No text, logos or brand marks anywhere.

Output aspect ratio: 4:5. Use this output ratio instead of any conflicting aspect ratio or framing instruction above.
```

> Check: This is your original image prompt with a no-text rule and a 4:5 ratio added.

### PH-02 · Polaroid: Hilltop

- **Save as:** `assets/raw/photos/PH-02.png`
- **Attach:** Image-3 (or another hike photo)
- **Ratio:** 4:5 · **Background:** Scene

```text
Create a trending anime art style image from the uploaded subject. Use confident line-work with slight variation and minimal cel shading using flat shadow shapes. Use bright, saturated colors and clean graphic lighting. The style is defined by exaggerated, cartoonish character proportions featuring highly expressive, simplistic facial features that allow for immense emotional range, with highly varied stretched anatomy. Transform the environment into a slightly warped space with playful perspective distortion and simplified objects. Composition and tone should be energetic, lively, and comedic in a fully stylized, non-realistic world.

Keep the composition of the attached photo. No text, logos or brand marks anywhere.

Output aspect ratio: 4:5. Use this output ratio instead of any conflicting aspect ratio or framing instruction above.
```

> Check: This is your original image prompt with a no-text rule and a 4:5 ratio added.

### PH-03 · Polaroid: Travel

- **Save as:** `assets/raw/photos/PH-03.png`
- **Attach:** a favourite travel photo
- **Ratio:** 4:5 · **Background:** Scene

```text
Create a trending anime art style image from the uploaded subject. Use confident line-work with slight variation and minimal cel shading using flat shadow shapes. Use bright, saturated colors and clean graphic lighting. The style is defined by exaggerated, cartoonish character proportions featuring highly expressive, simplistic facial features that allow for immense emotional range, with highly varied stretched anatomy. Transform the environment into a slightly warped space with playful perspective distortion and simplified objects. Composition and tone should be energetic, lively, and comedic in a fully stylized, non-realistic world.

Keep the composition of the attached photo. No text, logos or brand marks anywhere.

Output aspect ratio: 4:5. Use this output ratio instead of any conflicting aspect ratio or framing instruction above.
```

> Check: This is your original image prompt with a no-text rule and a 4:5 ratio added.

### PH-04 · Polaroid: Muffins in the car

- **Save as:** `assets/raw/photos/PH-04.png`
- **Attach:** Muffins-Image-4 or Muffins-Image-5
- **Ratio:** 4:5 · **Background:** Scene

```text
Create a trending anime art style image from the uploaded subject. Use confident line-work with slight variation and minimal cel shading using flat shadow shapes. Use bright, saturated colors and clean graphic lighting. The style is defined by exaggerated, cartoonish character proportions featuring highly expressive, simplistic facial features that allow for immense emotional range, with highly varied stretched anatomy. Transform the environment into a slightly warped space with playful perspective distortion and simplified objects. Composition and tone should be energetic, lively, and comedic in a fully stylized, non-realistic world.

Keep the composition of the attached photo. No text, logos or brand marks anywhere.

Output aspect ratio: 4:5. Use this output ratio instead of any conflicting aspect ratio or framing instruction above.
```

> Check: This is your original image prompt with a no-text rule and a 4:5 ratio added.

## P3 · Training arc extras (optional, 3)

The site already works without these. When they land in `assets/raw/`, the Training arc picks them up automatically: GIF-09 replaces CH-04 in the Breathing Forms dojo, GIF-10 plays on every strike, and BG-04b fades in as the arc reaches sunrise.

### GIF-09 · Breathing stance (loop)

- **Save as:** `assets/raw/loops/GIF-09-breathing-stance.gif`
- **Attach:** REF-01 · CH-04
- **Ratio:** 3:4 · **Background:** Flat magenta

```text
Create a seamless looping GIF: 8 frames at about 160 ms per frame. The hero in the SIGNATURE OUTFIT, full body, in a low, wide ready stance like the attached CH-04, but holding a plain wooden practice sword (a smooth bokken, no guard, no markings) in both hands, angled low across the body. Eyes closed, completely focused. A slow, deep breath: the chest rises and falls once per loop and a thin wisp of white breath drifts from the mouth. Hair and the tied hoodie sleeves stir slightly. Feet stay planted on the same baseline in every frame; same scale and position throughout.
Flat magenta background. Also give me the frames as separate PNGs in a zip.
Output: 3:4.
```

> Check: Keep the framing identical to CH-04 (feet at the bottom edge, the whole figure inside the canvas). Do not draw water, fire or other effects; the site draws those.

### GIF-10 · The strike (one-shot)

- **Save as:** `assets/raw/loops/GIF-10-strike.gif`
- **Attach:** GIF-09 frame 1 (PNG from the zip) · REF-01
- **Ratio:** 3:4 · **Background:** Flat magenta

```text
Create an animated GIF that plays once and does not loop: 8 frames at about 70 ms per frame. Start from the attached frame exactly: same hero, same practice sword, same framing. The hero's eyes snap open and they lunge forward with one fast, sweeping horizontal strike from low left to high right, with a bold anime motion smear behind the sword on frames 3 to 5. End on a held follow-through pose: sword extended high, weight on the front foot, a calm, confident half-smile. Feet stay on the same baseline.
Flat magenta background. Also give me the 8 frames as separate PNGs in a zip.
Output: 3:4.
```

> Check: No effects other than the motion smear; the site adds the elemental brush stroke on top.

### BG-04b · Dojo at sunrise

- **Save as:** `assets/raw/backgrounds/BG-04b-dojo-dawn.png`
- **Attach:** BG-04
- **Ratio:** 16:9 · **Background:** Scene

```text
The attached server-rack dojo at sunrise, with the same camera, composition and every object in the same place. Warm golden light pours through the paper screens in long shafts, dust motes float in the beams, the floor glows amber, and the green server LEDs are softer against the daylight. Hopeful, calm, end-of-training mood. No people.
Output: 16:9.
```

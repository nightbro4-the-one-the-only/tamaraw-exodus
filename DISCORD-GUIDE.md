# Discord Integration Guide
## Playing Tamaraw Exodus from a Discord Channel

This guide sets up a Discord server where players submit moves and the author (GM) resolves them — the living heartbeat of the roleplay.

---

## 1. Why Discord?

The website is the **canon** — the Story, the Lore, the Roleplay briefing. But the website can't hold accounts or comments by itself. Discord is where the **living game** happens:

- Players post moves in a channel
- The GM resolves them from the GM's Desk
- The Chronicle updates in both Discord and the website

It's the same cause-and-reaction loop — just with a chat window instead of a form.

---

## 2. Server Setup

### Create the Server

Create a Discord server called **Tamaraw Exodus** (or whatever you prefer). Then set up these channels:

### Channel Structure

```
📋 RULES & LORE
├── #welcome          — server rules, how to play, link to the website
├── #lore             — reference material, world state, era briefings
└── #chronicle        — GM posts resolved events here (newest first)

🎮 PLAY
├── #submit-a-move    — players post their moves here
├── #character-sheet  — players post their character declarations
└── #ooc              — out-of-character chat, questions, discussion

📢 WORLD UPDATES
├── #world-state      — GM posts era/day updates and pending consequences
└── #announcements    — new chapters, rule changes, site updates
```

### Channel Permissions

| Channel | @everyone | @Player | @GM |
|---------|-----------|---------|-----|
| `#welcome` | Read only | Read only | Read + Write |
| `#lore` | Read only | Read only | Read + Write |
| `#chronicle` | Read only | Read only | Read + Write |
| `#submit-a-move` | **No access** | **Read + Write** | Read + Write |
| `#character-sheet` | **No access** | **Read + Write** | Read + Write |
| `#ooc` | **No access** | **Read + Write** | Read + Write |
| `#world-state` | Read only | Read only | Read + Write |
| `#announcements` | Read only | Read only | Read + Write |

### Create Roles

| Role | Color | Purpose |
|------|-------|---------|
| **GM** | Gold | You — the author, the clock |
| **Player** | Teal | Anyone with an approved character |
| **Observer** | Gray | Read-only, hasn't played yet |

---

## 3. How to Submit a Move

### Step 1: Declare Your Character

Before playing, post in `#character-sheet` using this template:

```
CHARACTER DECLARATION
─────────────────────
Name: [character name]
Era: [which era you're entering]
Scale: [person / crew / nation]
Location: [where you start]
Background: [2-3 sentences about who they are]
Goal: [what they want — this drives their moves]
```

**Example:**
```
CHARACTER DECLARATION
─────────────────────
Name: Captain Reyes
Era: The Exodus
Scale: crew
Location: the Tamaraw, Manila port
Background: A former coast guard officer who lost her family in the 
last war. She now commands a salvaged patrol boat in the forming 
evacuation fleet. Quiet, pragmatic, haunted.
Goal: Get her crew through the Gate alive — no matter the cost.
```

The GM reviews and approves the character. Once approved, you get the **@Player** role and can post in `#submit-a-move`.

### Step 2: Write Your Move

Post in `#submit-a-move` using this format:

```
MOVE
─────────────────────
Player: [your Discord name]
Character: [character name]
Era: [current era]
Scale: [person / crew / nation]
Location: [where your character is right now]

THE MOVE
─────────────────────
[Write your action in your own words. What does your character 
do? Where? What do they hope to achieve? Be specific — the GM 
judges the reaction based on what you wrote.]

─────────────────────
```

**Example:**
```
MOVE
─────────────────────
Player: @captainreyes
Character: Captain Reyes
Era: The Exodus
Scale: crew
Location: the Tamaraw, Manila port

THE MOVE
─────────────────────
I take the militia ship out past the breakwater and hail the gate. 
I want to see what the flare was, and I'm not waiting for permission. 
I bring three crew and enough ammunition for a skirmish. If something 
comes through, I'm the first thing it sees.

─────────────────────
```

### Step 3: The GM Resolves It

The GM takes your move to the **GM's Desk** on the website:
1. Pastes the move into the desk
2. Sets the world state (era, day, pending consequences)
3. Gets an AI-drafted consequence (or writes one by hand)
4. Edits the draft to match the four rules:
   - **Nothing lands on the same day** — your action starts something, but the result arrives on its own day
   - **Consequences arrive late** — news, effects, reactions all have delays
   - **The world warns first** — you see what's coming before it hits
   - **Every scale, one world** — your crew's actions ripple through the same clock as everyone else
5. Approves it into the Ledger with a due day
6. When the day comes, resolves it into the Chronicle

### Step 4: See the Result

The GM posts the resolved consequence in `#chronicle`:

```
CHRONICLE — Day 231
─────────────────────
Captain Reyes took her militia ship past the breakwater and hailed 
the gate. The flare was not a signal — it was a wound. The gate's 
surface rippled like water struck by a stone, and for eleven seconds 
the air tasted of ozone.

Her radios picked up nothing but static. But the crew felt it: a 
pressure behind the eyes, a hum in the teeth. Something on the 
other side had noticed them.

The gate's glow dimmed. The flare did not repeat.

DUE: The gate responds in 3 days. Reyes' crew reports symptoms 
to the medical wing in 6 hours. The other captains hear the 
story by tomorrow.
```

And on the website, the same entry appears in the Roleplay page's Chronicle section (if you've copied it there from the GM's Desk).

---

## 4. The Four Rules (Quick Reference for Players)

When writing your move, keep these in mind:

| Rule | What it means for you |
|------|----------------------|
| **Nothing lands the same day** | Your action *starts* something. The result comes later. Don't expect instant resolution. |
| **Consequences arrive late** | If you attack someone, the fight happens — but the retaliation, the political fallout, the news reaching other nations — those all come on different days. |
| **The world warns first** | You'll always see a warning before something bad lands. "If unbroken, the city falls in four days." Use that time. |
| **Every scale, one world** | A person's action and a nation's action share the same clock. Your small choice might ripple into something massive. |

---

## 5. Example Move Formats by Scale

### One Person
```
MOVE
─────────────────────
Player: @jazzy
Character: Jazzy
Era: The Three Years
Scale: person
Location: the Tamaraw bridge

THE MOVE
─────────────────────
I seal the directive in my desk and refuse to look at it. I know 
what it says — abandon the settlers if the ship is at risk. But 
I'm not reading it again. I go to the engine room and help Carl 
install the last of the port stabilizers. If the ship is going to 
survive, it won't be because I followed orders. It'll be because 
I made sure every bolt held.
```

### A Crew
```
MOVE
─────────────────────
Player: @reyes
Character: Captain Reyes
Era: The Exodus
Scale: crew
Location: the patrol boat, Manila harbor

THE MOVE
─────────────────────
I send two scouts ashore to trade ammunition for medical supplies 
with the last of the harbor vendors. I tell them to be back before 
sundown. If they're not, I'm not going after them — the ship 
comes first.
```

### A Nation
```
MOVE
─────────────────────
Player: @nation
Character: The Philippine Remnant Government
Era: The Three Years
Scale: nation
Location: Manila, emergency government building

THE MOVE
─────────────────────
We allocate the last of our fuel reserves to the evacuation fleet. 
Nothing left for generators, for transport, for the military. We 
are betting everything on the ships getting through. If the gate 
closes, we die here. If it stays open, we might live.
```

---

## 6. Posting the Chronicle to the Website

The GM's Desk on the website has a **Copy Chronicle** button. Use it:

1. Resolve a move on the GM's Desk
2. Click **Copy Chronicle**
3. Paste into `#chronicle` on Discord
4. The same entry also appears on the Roleplay page's Chronicle section (read from browser storage)

This keeps both Discord and the website in sync. Players who only visit the website see the same world state as players on Discord.

---

## 7. Pending Consequences Tracker

The GM tracks pending consequences in two places:

**On the GM's Desk (website):** The Ledger shows all approved consequences with due days. When a day comes, resolve it.

**On Discord `#world-state`:** Post a summary so players can see what's coming:

```
WORLD STATE — Day 231
─────────────────────
Era: The Exodus
Day: Year 1 of 3 · Day 231 · 865 days remain

PENDING:
• The gate flare — response expected in 3 days
• Reyes' crew symptoms — medical report in 6 hours  
• The other captains hear the story — by tomorrow
• The barges are full — overcrowding crisis in 2 days
```

---

## 8. Tips for the GM

- **Batch moves.** Don't resolve one at a time. Collect 3-5 moves, then process them together — consequences from one move often affect the next.
- **Use the AI draft, but always edit.** The AI writes the first draft; you make it canon. The four rules are your editorial checklist.
- **Post the Chronicle regularly.** Players lose interest if they never see results. Even a short "nothing happened yet, but X is coming" post keeps the world alive.
- **Let players see the clock.** The website's countdown timer and the Discord world-state posts remind everyone that the world is moving whether they act or not.
- **Encourage interaction.** If two players' moves conflict, let the consequences collide. The world doesn't resolve in isolation.

---

## 9. Quick Start Checklist

- [ ] Create the Discord server
- [ ] Set up channels and permissions
- [ ] Create roles (GM, Player, Observer)
- [ ] Post the rules in `#welcome`
- [ ] Link to the website (Story, Lore, Roleplay pages)
- [ ] Post era briefings in `#lore`
- [ ] Open `#submit-a-move` for character declarations
- [ ] Approve the first character
- [ ] Process the first move on the GM's Desk
- [ ] Post the first Chronicle entry
- [ ] Watch the world begin to move

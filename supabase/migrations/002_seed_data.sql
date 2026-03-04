-- ============================================================
-- Kindroots — Seed Data
-- ============================================================

-- ============================================================
-- WONDER WEEKS LEAPS
-- ============================================================
insert into wonder_weeks_leaps (leap_number, name, age_weeks_start, age_weeks_end, stormy_description, sunny_description, new_skills) values
(1, 'The World of Changing Sensations', 5, 6,
  'Your baby may suddenly seem more fussy, cry more, and want to be held constantly. This is completely normal.',
  'After this leap, your baby becomes more alert and responsive to their surroundings.',
  ARRAY['Follows moving objects with eyes', 'Responds to sounds more clearly', 'More alert periods']),
(2, 'The World of Patterns', 8, 9,
  'Expect increased crying, clinginess, and trouble sleeping. The stormy period lasts about a week.',
  'Baby can now recognise simple patterns and may show you their first real smile.',
  ARRAY['First real social smile', 'Recognises faces', 'Studies hands and fingers']),
(3, 'The World of Smooth Transitions', 12, 12,
  'Baby may cry more, want feeding constantly, and resist being put down.',
  'Baby discovers the world is made of smooth, flowing transitions rather than static images.',
  ARRAY['Follows moving objects smoothly', 'Tracks movement with head', 'Bats at objects']),
(4, 'The World of Events', 19, 19,
  'This is often one of the most intense leaps. Baby may be inconsolable and sleep very badly.',
  'A huge cognitive leap — baby understands that events happen in sequences.',
  ARRAY['Understands cause and effect', 'Reaches for objects deliberately', 'Babbles with intent']),
(5, 'The World of Relationships', 26, 26,
  'Baby realises that people and objects can be near or far. Separation anxiety begins.',
  'Baby grasps the concept of distance and relationships between things.',
  ARRAY['Understands near and far', 'Explores spatial relationships', 'First stranger anxiety']),
(6, 'The World of Categories', 37, 37,
  'Baby wants to categorise everything. May become very clingy and difficult.',
  'Baby can group things into categories — a huge intellectual achievement.',
  ARRAY['Groups objects by type', 'Understands "mine"', 'Points to things they want']),
(7, 'The World of Sequences', 46, 46,
  'Stormy period with increased fussiness and clinginess.',
  'Baby understands that tasks have multiple steps done in sequence.',
  ARRAY['Follows multi-step sequences', 'Imitates household tasks', 'First words appear']),
(8, 'The World of Programs', 55, 55,
  'This leap can be particularly intense. Toddler may be extremely difficult.',
  'Baby understands that programs can be adapted to circumstances.',
  ARRAY['Adapts plans to situations', 'More independent play', 'Complex imitation']),
(9, 'The World of Principles', 64, 64,
  'Toddler may become very demanding and emotionally intense.',
  'Toddler begins to understand principles — rules that apply in all situations.',
  ARRAY['Understands social rules', 'Shows empathy', 'More complex language']),
(10, 'The World of Systems', 75, 75,
  'Final major leap — toddler may be at their most challenging.',
  'Toddler now perceives the world as a system of systems. A whole new world opens up.',
  ARRAY['Understands systems and how they work', 'Complex social play', 'Sense of self emerges']);

-- ============================================================
-- MILESTONE DEFINITIONS
-- ============================================================
insert into milestone_definitions (stage, age_weeks_min, age_weeks_max, category, title, description, sort_order) values
-- Newborn (0-4 weeks)
('newborn', 0, 4, 'motor', 'Lifts head briefly during tummy time', 'Can lift head momentarily when placed on tummy', 10),
('newborn', 0, 4, 'social', 'Responds to your voice', 'Stills or turns toward familiar voices', 20),
('newborn', 0, 4, 'social', 'Makes eye contact', 'Holds eye contact briefly during feeding or cuddles', 30),
('newborn', 0, 4, 'language', 'First cries as communication', 'Uses different cries for hunger, discomfort, and tiredness', 40),
-- 1-2 months
('newborn', 4, 8, 'social', 'First real smile', 'A genuine social smile in response to your face or voice', 50),
('newborn', 4, 8, 'motor', 'Holds head steady briefly', 'Can hold head up for a few seconds when supported', 60),
('newborn', 4, 8, 'cognitive', 'Follows moving objects', 'Tracks a slow-moving object with eyes', 70),
-- 2-3 months
('infant', 8, 12, 'language', 'Cooing sounds', 'Makes happy vowel sounds like "oooh" and "ahhh"', 80),
('infant', 8, 12, 'motor', 'Tummy time for 5 minutes', 'Tolerates and lifts head during tummy time', 90),
('infant', 8, 12, 'social', 'Laughs out loud', 'First genuine laugh — one of the best moments!', 100),
-- 3-4 months
('infant', 12, 16, 'motor', 'Rolls from tummy to back', 'First roll!', 110),
('infant', 12, 16, 'motor', 'Reaches for objects', 'Deliberately reaches out to grab toys', 120),
('infant', 12, 16, 'cognitive', 'Recognises familiar faces', 'Shows clear recognition and excitement for caregivers', 130),
-- 4-6 months
('infant', 16, 26, 'motor', 'Sits with support', 'Can sit upright when supported by hands or pillow', 140),
('infant', 16, 26, 'feeding', 'Shows interest in food', 'Watches you eat with fascination, reaching for your food', 150),
('infant', 16, 26, 'motor', 'Rolls both ways', 'Rolls from back to tummy and tummy to back', 160),
-- 6-9 months
('infant', 26, 40, 'motor', 'Sits unsupported', 'Can sit independently without toppling', 170),
('infant', 26, 40, 'feeding', 'First solid foods', 'Starts weaning — purees, mashes, or baby-led weaning', 180),
('infant', 26, 40, 'language', 'Babbles consonants', 'Says "ba ba ba", "da da da", "ma ma ma"', 190),
('infant', 26, 40, 'motor', 'Starts to crawl', 'Any form of forward movement counts!', 200),
-- 9-12 months
('infant', 40, 52, 'motor', 'Pulls to standing', 'Uses furniture to pull themselves upright', 210),
('infant', 40, 52, 'language', 'First word', 'A clear, consistent word with meaning (not just babble)', 220),
('infant', 40, 52, 'cognitive', 'Waves bye-bye', 'Copies the gesture on cue', 230),
('infant', 40, 52, 'motor', 'Cruises along furniture', 'Walks sideways holding onto furniture', 240),
-- 12-18 months (toddler)
('toddler', 52, 78, 'motor', 'First steps', 'Takes first independent steps!', 250),
('toddler', 52, 78, 'language', '5-10 words in vocabulary', 'Uses words meaningfully and consistently', 260),
('toddler', 52, 78, 'feeding', 'Uses a spoon', 'Attempts self-feeding with a spoon', 270),
('toddler', 52, 78, 'social', 'Points to show you things', 'Points to share interest, not just to request', 280),
-- 18-24 months
('toddler', 78, 104, 'language', '2-word combinations', 'Combines words: "more milk", "daddy go"', 290),
('toddler', 78, 104, 'cognitive', 'Pretend play', 'Plays pretend — feeding a doll, talking on a toy phone', 300),
('toddler', 78, 104, 'motor', 'Runs confidently', 'Runs without falling most of the time', 310),
-- 24-36 months
('toddler', 104, 156, 'language', '50+ word vocabulary', 'Vocabulary explosion — learning new words daily', 320),
('toddler', 104, 156, 'language', 'Short sentences', 'Uses 3-4 word sentences to communicate', 330),
('toddler', 104, 156, 'cognitive', 'Sorts by colour and shape', 'Can sort objects by colour and basic shapes', 340),
('toddler', 104, 156, 'social', 'Plays with other children', 'Moves from parallel to interactive play', 350);

-- ============================================================
-- LIBRARY ARTICLES (Sample)
-- ============================================================
insert into library_articles (stage, age_weeks_min, age_weeks_max, framework_tags, category, title, summary, read_time_minutes, is_premium, sort_order) values
('newborn', 0, 4, ARRAY['harvey-karp'], 'sleep', 'The 5 S''s: Your Secret Weapon for the Fourth Trimester',
  'Harvey Karp''s five calming techniques work because they recreate the sensations of the womb your newborn is missing.', 4, false, 10),
('newborn', 0, 8, ARRAY['wonder-weeks'], 'development', 'Understanding Wonder Week 5: The World of Changing Sensations',
  'Your baby''s first mental leap happens around 5 weeks. Here''s what to expect and how to help.', 3, false, 20),
('newborn', 4, 12, ARRAY['gina-ford'], 'sleep', 'Getting Started with a Newborn Routine',
  'Gina Ford''s approach to establishing predictability from the early weeks.', 5, true, 30),
('infant', 8, 26, ARRAY['brain-rules'], 'development', 'Serve and Return: The Interaction That Builds Baby''s Brain',
  'Every time you respond to your baby''s coos and babbles, you''re literally building neural pathways.', 4, false, 40),
('infant', 16, 26, ARRAY['baby-whisperer'], 'feeding', 'Starting Solids: The EASY Way',
  'Tracy Hogg''s EASY routine adapts beautifully to the weaning stage. Here''s how.', 5, true, 50),
('infant', 26, 52, ARRAY['gentle-sleep'], 'sleep', 'Why Your Baby Still Wakes at Night (And Why That''s OK)',
  'Sarah Ockwell-Smith explains the biological reality of infant sleep — and gentle ways forward.', 6, false, 60),
('toddler', 52, 104, ARRAY['no-drama'], 'behaviour', 'Connect Before You Correct: Handling Toddler Tantrums',
  'Dan Siegel''s approach to toddler meltdowns: why connection comes before correction, every time.', 5, false, 70),
('toddler', 78, 156, ARRAY['whole-brain'], 'development', 'Name It to Tame It: Helping Your Toddler With Big Emotions',
  'The research-backed technique for helping toddlers understand and manage their feelings.', 4, false, 80);

-- SJEKK KVA SPELARE SOM HAR SVART
SELECT 
  COUNT(*) as total_responses,
  COUNT(CASE WHEN no_preference THEN 1 END) as no_preference_count
FROM responses;

-- SJÅ ALLE SVAR MED NAMN
SELECT 
  p.first_name || ' ' || COALESCE(p.last_name, '') as voter,
  COALESCE(p1.first_name || ' ' || COALESCE(p1.last_name, ''), '-') as choice_1,
  COALESCE(p2.first_name || ' ' || COALESCE(p2.last_name, ''), '-') as choice_2,
  COALESCE(p3.first_name || ' ' || COALESCE(p3.last_name, ''), '-') as choice_3,
  CASE WHEN r.no_preference THEN 'Ja' ELSE 'Nei' END as veit_ikkje,
  r.submitted_at::date as dato
FROM responses r
JOIN players p ON r.player_id = p.id
LEFT JOIN players p1 ON r.choice_1 = p1.id
LEFT JOIN players p2 ON r.choice_2 = p2.id
LEFT JOIN players p3 ON r.choice_3 = p3.id
ORDER BY r.submitted_at DESC;

-- POPULARITETSANALYSE - Kven blir valt mest?
SELECT 
  p.first_name || ' ' || COALESCE(p.last_name, '') as player_name,
  COUNT(*) as times_chosen,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM responses WHERE NOT no_preference), 1) as percentage
FROM players p
WHERE p.id IN (
  SELECT choice_1 FROM responses WHERE choice_1 IS NOT NULL
  UNION ALL
  SELECT choice_2 FROM responses WHERE choice_2 IS NOT NULL
  UNION ALL
  SELECT choice_3 FROM responses WHERE choice_3 IS NOT NULL
)
GROUP BY p.id, p.first_name, p.last_name
ORDER BY times_chosen DESC;

-- KVA SPELARE HAR IKKJE SVART ENNO?
SELECT 
  first_name || ' ' || COALESCE(last_name, '') as player_name,
  phone_number
FROM players p
WHERE NOT EXISTS (
  SELECT 1 FROM responses r WHERE r.player_id = p.id
)
ORDER BY first_name;

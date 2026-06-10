-- ============================================================
--  MindBridge - Seed de Usuarios de Prueba
--  Contraseña para TODOS los usuarios: MindBridge2025!
--  (hashes generados con bcryptjs, rounds=10)
--
--  Distribución (20 usuarios totales):
--    1  COORDINATOR
--    5  THERAPIST   --> TherapistProfile
--   14  PATIENT     --> PatientProfile
-- ============================================================

BEGIN;

-- ─────────────────────────────────────────────
--  1. USUARIOS
-- ─────────────────────────────────────────────

INSERT INTO "User" (id, username, email, password, role, "isActive", "createdAt", "updatedAt")
VALUES

-- ── COORDINADOR (1) ───────────────────────────
(
  'a0000001-0000-0000-0000-000000000001',
  'coord_sofia',
  'sofia.coordinator@mindbridge.com',
  '$2b$10$Gwa5sniOLGGQ/cgB.V5cnOCuXTVKRs08QM4hHO2vlm6Uhi2vEXJ1S',
  'COORDINATOR',
  true,
  NOW(), NOW()
),

-- ── TERAPEUTAS (5) ────────────────────────────
(
  'a0000002-0000-0000-0000-000000000002',
  'terapeuta_lucia',
  'lucia.ramirez@mindbridge.com',
  '$2b$10$6MRyuF0OVB4syCw4aVzH7.gEEEkxiq0rGvdf2xfoCC3mHgLoiuCdS',
  'THERAPIST',
  true,
  NOW(), NOW()
),
(
  'a0000003-0000-0000-0000-000000000003',
  'terapeuta_carlos',
  'carlos.mendez@mindbridge.com',
  '$2b$10$QYFlCD99R0.v8UUGEkyqXeRpEFkRn0t8CucLdUTfg6LkImc/6h8TO',
  'THERAPIST',
  true,
  NOW(), NOW()
),
(
  'a0000004-0000-0000-0000-000000000004',
  'terapeuta_ana',
  'ana.delgado@mindbridge.com',
  '$2b$10$rXMXVXhx0Yxvpsfz2ojFguYT.QqEOf/O1gOUsCMfppYIfpGyLgqVe',
  'THERAPIST',
  true,
  NOW(), NOW()
),
(
  'a0000005-0000-0000-0000-000000000005',
  'terapeuta_jorge',
  'jorge.perez@mindbridge.com',
  '$2b$10$nf6EeRfqSBLbnPrOFMzbVOMpLWNwHoAZF/Otyw1RuXxxC7.99UH5u',
  'THERAPIST',
  true,
  NOW(), NOW()
),
(
  'a0000006-0000-0000-0000-000000000006',
  'terapeuta_valeria',
  'valeria.torres@mindbridge.com',
  '$2b$10$ibtrswT1txaKtY53i6WuYOWSY4v6DF2l1LRO81QXc7hWYKsaxUKFq',
  'THERAPIST',
  true,
  NOW(), NOW()
),

-- ── PACIENTES (14) ────────────────────────────
(
  'a0000007-0000-0000-0000-000000000007',
  'paciente_pedro',
  'pedro.garcia@mail.com',
  '$2b$10$ueF5hOpNRcb4h2/FkrhJluqF8JMYMHG8GrUObgfCnBz52ivTKY/j6',
  'PATIENT',
  true,
  NOW(), NOW()
),
(
  'a0000008-0000-0000-0000-000000000008',
  'paciente_maria',
  'maria.lopez@mail.com',
  '$2b$10$5orZ4blnaG9.r4uYZSXptuPslLsHCak2yZa3k04ghgk6uZv5ku06m',
  'PATIENT',
  true,
  NOW(), NOW()
),
(
  'a0000009-0000-0000-0000-000000000009',
  'paciente_juan',
  'juan.hernandez@mail.com',
  '$2b$10$smQQCXB39xNwbsfN6O0o.epKXz0X4AreLuXhXF6FHx8EEa79tPEkC',
  'PATIENT',
  true,
  NOW(), NOW()
),
(
  'a0000010-0000-0000-0000-000000000010',
  'paciente_laura',
  'laura.sanchez@mail.com',
  '$2b$10$o/H8ReNm0.2jdx5adw/0N.5Q.gPx8VRw0j2zRO6xJPPWBDb8zeXIu',
  'PATIENT',
  true,
  NOW(), NOW()
),
(
  'a0000011-0000-0000-0000-000000000011',
  'paciente_diego',
  'diego.rodriguez@mail.com',
  '$2b$10$vpUut77KHWOGeMHxbDYHXOWNk871EwVMeCuAlEeydgNcYtLpmEtge',
  'PATIENT',
  true,
  NOW(), NOW()
),
(
  'a0000012-0000-0000-0000-000000000012',
  'paciente_camila',
  'camila.morales@mail.com',
  '$2b$10$NghqDvYVDU7ylM2pUi5t5eKo2cXftA1UjKlPlD3vspIGBwt52OunG',
  'PATIENT',
  true,
  NOW(), NOW()
),
(
  'a0000013-0000-0000-0000-000000000013',
  'paciente_andres',
  'andres.gutierrez@mail.com',
  '$2b$10$ZQrLZ9NQFM2yTjIGA21J.uvaZoiCV4pd6kTw1QgmUzzVcazl1Iagu',
  'PATIENT',
  true,
  NOW(), NOW()
),
(
  'a0000014-0000-0000-0000-000000000014',
  'paciente_isabella',
  'isabella.vargas@mail.com',
  '$2b$10$kiC0N64yPTU5KNLEp4.DOup7yVbvTMPztCXnmkL98.9bCRSLeoUwS',
  'PATIENT',
  true,
  NOW(), NOW()
),
(
  'a0000015-0000-0000-0000-000000000015',
  'paciente_marcos',
  'marcos.flores@mail.com',
  '$2b$10$p4QKlOykWAuXHBID16LJe.9TM.o5iveLvB285mMgRQ3bwHUrggxIi',
  'PATIENT',
  true,
  NOW(), NOW()
),
(
  'a0000016-0000-0000-0000-000000000016',
  'paciente_valentina',
  'valentina.jimenez@mail.com',
  '$2b$10$TIKvSdFPZtCq9rKZg9tIkOS9mn0HR2GZJSnb8giaDHujy27sOBnoy',
  'PATIENT',
  true,
  NOW(), NOW()
),
(
  'a0000017-0000-0000-0000-000000000017',
  'paciente_gabriel',
  'gabriel.reyes@mail.com',
  '$2b$10$emtbXja/l8.b45/a3QdqXOZEgRGz/1/qt7R3dU.rFQ9hAmsoxe086',
  'PATIENT',
  true,
  NOW(), NOW()
),
(
  'a0000018-0000-0000-0000-000000000018',
  'paciente_daniela',
  'daniela.ortiz@mail.com',
  '$2b$10$RshXqwcvlbvkGWGnRQ6X5OitxaqJYYNYsjzRsdCorDkQ2bS47ipL6',
  'PATIENT',
  true,
  NOW(), NOW()
),
(
  'a0000019-0000-0000-0000-000000000019',
  'paciente_sebastian',
  'sebastian.castillo@mail.com',
  '$2b$10$z0XCZtzs2fc9Fp3HySqjHulDZM0EaXlX/r6G9K4.pfrU46oxtkGVe',
  'PATIENT',
  true,
  NOW(), NOW()
),
(
  'a0000020-0000-0000-0000-000000000020',
  'paciente_paula',
  'paula.medina@mail.com',
  '$2b$10$kqDUo1ytG1QC7l2JjsaQquP0KSeuYOpZhsQKwxpFbSJ78rl9FmW4K',
  'PATIENT',
  true,
  NOW(), NOW()
);

-- ─────────────────────────────────────────────
--  2. PERFILES DE TERAPEUTAS
-- ─────────────────────────────────────────────

INSERT INTO "TherapistProfile" (id, "userId", specialization, "createdAt")
VALUES
(
  'b0000002-0000-0000-0000-000000000002',
  'a0000002-0000-0000-0000-000000000002',
  'Psicología Cognitivo-Conductual',
  NOW()
),
(
  'b0000003-0000-0000-0000-000000000003',
  'a0000003-0000-0000-0000-000000000003',
  'Terapia de Pareja y Familia',
  NOW()
),
(
  'b0000004-0000-0000-0000-000000000004',
  'a0000004-0000-0000-0000-000000000004',
  'Psicología Infantil y Adolescente',
  NOW()
),
(
  'b0000005-0000-0000-0000-000000000005',
  'a0000005-0000-0000-0000-000000000005',
  'Ansiedad y Manejo del Estrés',
  NOW()
),
(
  'b0000006-0000-0000-0000-000000000006',
  'a0000006-0000-0000-0000-000000000006',
  'Trauma y Duelo',
  NOW()
);

-- ─────────────────────────────────────────────
--  3. PERFILES DE PACIENTES
-- ─────────────────────────────────────────────

INSERT INTO "PatientProfile" (id, "userId", "dateOfBirth", phone, "createdAt")
VALUES
(
  'c0000007-0000-0000-0000-000000000007',
  'a0000007-0000-0000-0000-000000000007',
  '1990-03-15',
  '+51 999 111 001',
  NOW()
),
(
  'c0000008-0000-0000-0000-000000000008',
  'a0000008-0000-0000-0000-000000000008',
  '1992-07-22',
  '+51 999 111 002',
  NOW()
),
(
  'c0000009-0000-0000-0000-000000000009',
  'a0000009-0000-0000-0000-000000000009',
  '1988-11-05',
  '+51 999 111 003',
  NOW()
),
(
  'c0000010-0000-0000-0000-000000000010',
  'a0000010-0000-0000-0000-000000000010',
  '1995-01-30',
  '+51 999 111 004',
  NOW()
),
(
  'c0000011-0000-0000-0000-000000000011',
  'a0000011-0000-0000-0000-000000000011',
  '1993-09-12',
  '+51 999 111 005',
  NOW()
),
(
  'c0000012-0000-0000-0000-000000000012',
  'a0000012-0000-0000-0000-000000000012',
  '1997-04-18',
  '+51 999 111 006',
  NOW()
),
(
  'c0000013-0000-0000-0000-000000000013',
  'a0000013-0000-0000-0000-000000000013',
  '1985-12-28',
  '+51 999 111 007',
  NOW()
),
(
  'c0000014-0000-0000-0000-000000000014',
  'a0000014-0000-0000-0000-000000000014',
  '1999-06-03',
  '+51 999 111 008',
  NOW()
),
(
  'c0000015-0000-0000-0000-000000000015',
  'a0000015-0000-0000-0000-000000000015',
  '1991-08-25',
  '+51 999 111 009',
  NOW()
),
(
  'c0000016-0000-0000-0000-000000000016',
  'a0000016-0000-0000-0000-000000000016',
  '2000-02-14',
  '+51 999 111 010',
  NOW()
),
(
  'c0000017-0000-0000-0000-000000000017',
  'a0000017-0000-0000-0000-000000000017',
  '1987-10-09',
  '+51 999 111 011',
  NOW()
),
(
  'c0000018-0000-0000-0000-000000000018',
  'a0000018-0000-0000-0000-000000000018',
  '1994-05-20',
  '+51 999 111 012',
  NOW()
),
(
  'c0000019-0000-0000-0000-000000000019',
  'a0000019-0000-0000-0000-000000000019',
  '1996-03-07',
  '+51 999 111 013',
  NOW()
),
(
  'c0000020-0000-0000-0000-000000000020',
  'a0000020-0000-0000-0000-000000000020',
  '2001-11-19',
  '+51 999 111 014',
  NOW()
);

-- ─────────────────────────────────────────────
--  4. RELACIONES PACIENTE-TERAPEUTA
--     (Cada terapeuta tiene ~3 pacientes asignados)
-- ─────────────────────────────────────────────

INSERT INTO "PatientTherapist" (id, "therapistId", "patientId", "createdAt")
VALUES
-- Lucía (b2): Pedro, María, Juan
('d0000001-0000-0000-0000-000000000001', 'b0000002-0000-0000-0000-000000000002', 'c0000007-0000-0000-0000-000000000007', NOW()),
('d0000002-0000-0000-0000-000000000002', 'b0000002-0000-0000-0000-000000000002', 'c0000008-0000-0000-0000-000000000008', NOW()),
('d0000003-0000-0000-0000-000000000003', 'b0000002-0000-0000-0000-000000000002', 'c0000009-0000-0000-0000-000000000009', NOW()),

-- Carlos (b3): Laura, Diego, Camila
('d0000004-0000-0000-0000-000000000004', 'b0000003-0000-0000-0000-000000000003', 'c0000010-0000-0000-0000-000000000010', NOW()),
('d0000005-0000-0000-0000-000000000005', 'b0000003-0000-0000-0000-000000000003', 'c0000011-0000-0000-0000-000000000011', NOW()),
('d0000006-0000-0000-0000-000000000006', 'b0000003-0000-0000-0000-000000000003', 'c0000012-0000-0000-0000-000000000012', NOW()),

-- Ana (b4): Andrés, Isabella, Marcos
('d0000007-0000-0000-0000-000000000007', 'b0000004-0000-0000-0000-000000000004', 'c0000013-0000-0000-0000-000000000013', NOW()),
('d0000008-0000-0000-0000-000000000008', 'b0000004-0000-0000-0000-000000000004', 'c0000014-0000-0000-0000-000000000014', NOW()),
('d0000009-0000-0000-0000-000000000009', 'b0000004-0000-0000-0000-000000000004', 'c0000015-0000-0000-0000-000000000015', NOW()),

-- Jorge (b5): Valentina, Gabriel
('d0000010-0000-0000-0000-000000000010', 'b0000005-0000-0000-0000-000000000005', 'c0000016-0000-0000-0000-000000000016', NOW()),
('d0000011-0000-0000-0000-000000000011', 'b0000005-0000-0000-0000-000000000005', 'c0000017-0000-0000-0000-000000000017', NOW()),

-- Valeria (b6): Daniela, Sebastián, Paula
('d0000012-0000-0000-0000-000000000012', 'b0000006-0000-0000-0000-000000000006', 'c0000018-0000-0000-0000-000000000018', NOW()),
('d0000013-0000-0000-0000-000000000013', 'b0000006-0000-0000-0000-000000000006', 'c0000019-0000-0000-0000-000000000019', NOW()),
('d0000014-0000-0000-0000-000000000014', 'b0000006-0000-0000-0000-000000000006', 'c0000020-0000-0000-0000-000000000020', NOW());

COMMIT;

-- ============================================================
--  RESUMEN DE CREDENCIALES DE ACCESO
-- ============================================================
--
--  COORDINADOR
--  ┌─────────────────────────────────────────────────────┐
--  │ sofia.coordinator@mindbridge.com  │ MindBridge2025! │
--  └─────────────────────────────────────────────────────┘
--
--  TERAPEUTAS
--  ┌────────────────────────────────────┬─────────────────┐
--  │ lucia.ramirez@mindbridge.com       │ MindBridge2025! │
--  │ carlos.mendez@mindbridge.com       │ MindBridge2025! │
--  │ ana.delgado@mindbridge.com         │ MindBridge2025! │
--  │ jorge.perez@mindbridge.com         │ MindBridge2025! │
--  │ valeria.torres@mindbridge.com      │ MindBridge2025! │
--  └────────────────────────────────────┴─────────────────┘
--
--  PACIENTES (todos con contraseña: MindBridge2025!)
--  pedro.garcia@mail.com       maria.lopez@mail.com
--  juan.hernandez@mail.com     laura.sanchez@mail.com
--  diego.rodriguez@mail.com    camila.morales@mail.com
--  andres.gutierrez@mail.com   isabella.vargas@mail.com
--  marcos.flores@mail.com      valentina.jimenez@mail.com
--  gabriel.reyes@mail.com      daniela.ortiz@mail.com
--  sebastian.castillo@mail.com paula.medina@mail.com
-- ============================================================

-- Tabela simulando o SIGA (já existente)
CREATE TABLE IF NOT EXISTS alunos_siga (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    matricula TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL
);

-- Tabela do sistema (cadastro complementar)
CREATE TABLE IF NOT EXISTS alunos_cadastro (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    matricula TEXT UNIQUE NOT NULL,
    nome TEXT,
    email TEXT,
    foto TEXT,
    FOREIGN KEY (matricula) REFERENCES alunos_siga (matricula)
);


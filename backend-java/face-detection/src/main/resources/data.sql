-- Populando a tabela alunos_siga (simulando dados do SIGA)
INSERT INTO alunos_siga (matricula, senha) VALUES ('2025001', 'senha123');
INSERT INTO alunos_siga (matricula, senha) VALUES ('2025002', 'abc456');
INSERT INTO alunos_siga (matricula, senha) VALUES ('2025003', 'teste789');

-- Populando a tabela alunos_cadastro (dados complementares do seu sistema)
INSERT INTO alunos_cadastro (matricula, nome, email, foto) 
VALUES ('2025001', 'Thalita Alves', 'thalita@email.com', 'foto1.jpg');

INSERT INTO alunos_cadastro (matricula, nome, email, foto) 
VALUES ('2025002', 'João Silva', 'joao@email.com', 'foto2.jpg');

INSERT INTO alunos_cadastro (matricula, nome, email, foto) 
VALUES ('2025003', 'Maria Souza', 'maria@email.com', 'foto3.jpg');


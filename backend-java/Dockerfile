# Imagem base com o JDK para compilar o projeto
FROM eclipse-temurin:17-jdk AS build

WORKDIR /app

# Copia o pom.xml para resolver as dependências
COPY face-detection/pom.xml .

# Instala o Maven antes de tentar rodar o comando mvn
RUN apt-get update && apt-get install -y maven

# Roda o mvn para baixar as dependências offline
RUN mvn dependency:go-offline

# Copia o código-fonte do projeto
COPY face-detection/src ./src

# Compila o projeto e cria o .jar, sem rodar os testes
RUN mvn -q -DskipTests clean package

# Imagem base com o JRE para rodar o projeto (não precisa de Maven)
FROM eclipse-temurin:17-jre

# Instala dependências necessárias para rodar o aplicativo
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copia o .jar do estágio anterior para o container
COPY --from=build /app/target/*.jar app.jar

# Exponha a porta onde o serviço estará rodando
EXPOSE 8080

# Define o comando para rodar o jar
ENTRYPOINT ["java", "-jar", "app.jar"]

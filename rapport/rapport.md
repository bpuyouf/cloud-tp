# Rapport - TP Cloud - Automatisation du Déploiement

## Introduction

Ce rapport documente la résolution des différentes étapes de l'exercice

## 1 - Mise en place du projet

### 1. Configuration du Projet
- Création de la structure de dossiers
- Initialisation du projet Node.js avec package.json
- Configuration des dépendances (Express, pg, dotenv)

### 2. Développement de l'API
- Implémentation du serveur Express de base
- Configuration de la connexion PostgreSQL
- Endpoint `/health` pour vérifier la connectivité base de données

### 3. Schéma de Base de Données
- Création des tables `users` et `products`
- Script d'initialisation avec données d'exemple

### 4. Conteneurisation
- Dockerfile pour le service API
- Utilisation de l'image officielle PostgreSQL
- Configuration Docker Compose pour lancer l'API et la DB localement

### 5. Gestion des Variables d'Environnement
- Fichier `.env` pour la configuration locale
- Variables pour la connexion base de données et port API

### 6. Tests Locaux
- Construction et lancement avec Docker Compose
- Vérification du endpoint `/health`
- Validation de la communication inter-services

### Résultats

> docker-compose up
![alt text](image1-1.png)

> curl localhost:3000/health
![alt text](image1-2.png)

## 2 - Préparation de la VM Azure

### 1 - Initialisation
- mise à jour de la VM (sudo apt update, puis upgrade)
- installation de node via nvm (npmp + node version manager)

### 2 - Installation de Docker et Docker Compose
- suivit de la doc officielle

### 3 - Installation de Kubernetes
- utilisation de Minikube
- suivit de la doc officielle :
  - installation de kubectl
  - utilisation de vm-driver=docker (possibiltié d'utiliser driver=none mais c'est une fonctionnalité avancé avec des risques, et je ne me sent pas en mesure de bien l'utiliser)
  
### Résultat

> installation de nvm (exemple avec màj d'NVM après avoir installé la mauvaise version)
![alt text](image2-11.png)
![alt text](image2-12.png)

> installation de node 25.9.0
![alt text](image2-13.png)

> suivit de la documentation officielle pour l'installation de docker et docker compose (https://docs.docker.com/engine/install/ubuntu/)
> résultats :
![alt text](image2-21.png)
![alt text](image2-22.png)
![alt text](image2-23.png)
> ajout de l'user au groupe docker pour permettre l'execution de commandes docker sans utiliser sudo (c'est necessaire pour kubernetes, pour pouvoir utiliser minikube avec vm-driver=docker)
> sudo usermod -aG docker $USER

> installation de kubectl (doc officielle : https://kubernetes.io/fr/docs/tasks/tools/install-kubectl/#install-kubectl-on-linux)
![alt text](image2-31.png)
![alt text](image2-32.png)

> installation de Minikube
![alt text](image2-33.png)

# Cloud TP - Projet de Déploiement Automatisé

Ce projet démontre la conteneurisation et le déploiement automatisé d'une application web en utilisant Docker, Docker Compose, et prépare le déploiement CI/CD et Kubernetes.

Pour accéder au rapport détaillé du projet, consultez [ce fichier](./rapport/rapport.md).

---

## Description du projet

Ce projet est une application web simple développée avec Node.js. Elle est conteneurisée à l'aide de Docker et peut être déployée soit via Docker Compose en local, soit via Kubernetes sur un serveur distant.

J'ai fait le choix d'un backend APIsé avec Express et d'une base de donnée PostgreSQL

L'objectif principal est de mettre en place un pipeline CI/CD complet qui automatise :
- L'installation des dépendances
- L'exécution des tests
- La construction de l'image Docker
- Le pushes de l'image vers un registre de conteneurs (GitHub Container Registry)
- Le déploiement sur une machine virtuelle Azure via SSH
- La mise à jour du déploiement Kubernetes

### Composants du projet

| Fichier/Dossier | Description |
|-----------------|-------------|
| `Dockerfile` | Définition de l'image Docker de l'application |
| `docker-compose.yml` | Configuration pour le déploiement local |
| `src/app.js` | Code source de l'application Node.js |
| `k8s/` | Manifestes Kubernetes pour le déploiement |
| `.github/workflows/deploy.yml` | Pipeline CI/CD GitHub Actions |
| `rapport` | Ensemble des images du rapport et rapport du projet |

---

## Explication du pipeline CI/CD

Le pipeline CI/CD est implémenté avec GitHub Actions et s'exécute automatiquement à chaque modification du code (à chaque push).

### Flux du pipeline

```
git push → GitHub Actions → Installation → Tests → Build Docker → Push Image → Déploiement VM → Mise à jour Kubernetes
```

### Déclencheurs automatiques

- **Push sur la branche main/master** : Exécution complète du pipeline CI/CD
- **Pull Request** : Vérifications CI (dépendances, tests, build) sans déploiement

### Étapes du pipeline

1. **Installation des dépendances** : `npm ci` pour une installation propre
2. **Exécution des tests** : `npm test` (placeholder pour le moment)
3. **Construction Docker** : Création de l'image pour l'API
4. **Push de l'image** : Envoi vers GitHub Container Registry (ghcr.io)
5. **Déploiement sur VM** : Connexion SSH à la machine virtuelle Azure
6. **Mise à jour Kubernetes** : Application du nouveau déploiement

### Structure du workflow

```yaml
jobs:
  test-and-build:
    - Checkout du code
    - Setup Node.js
    - Installation des dépendances
    - Exécution des tests
    - Build de l'image Docker
    - Login au registre
    - Push de l'image
  
  deploy:
    - Dépend de test-and-build
    - Déclenchement sur main/master uniquement
    - Connexion SSH et déploiement
```

---

## Étapes de déploiement

### Prérequis

1. **Machine virtuelle Azure** avec SSH accessible
2. **Compte GitHub** avec accès au registre de conteneurs
3. **Clé SSH** pour la connexion à la VM

### Configuration des secrets GitHub

Ajouter ces secrets dans **Settings → Secrets and variables → Actions** (/!\ secrets du repository !) :

| Secret | Description | Exemple |
|--------|-------------|---------|
| `AZURE_VM_HOST` | IP publique de la VM Azure | `108.143.184.247` |
| `AZURE_VM_USER` | Nom d'utilisateur SSH | `azureuser` |
| `AZURE_VM_SSH_KEY` | Clé SSH privée | `-----BEGIN OPENSSH PRIVATE KEY-----...` |

### Génération de la clé SSH

1. **Générer la clé** (sur votre machine locale) :
   ```bash
   ssh-keygen -t rsa -b 4096 -C "github-actions@cloud-tp"
   ```

2. **Ajouter la clé publique sur la VM** :
   ```bash
   ssh-copy-id azureuser@108.143.184.247
   ```
   (si cela ne marche pas, modifier manuellement le fichier ~/.ssh/authorized_keys sur la VM Azure en ajoutant une copie de la clée publique généré)

3. **Ajouter la clé privée dans les secrets GitHub** :
   - Copierentire la clé privée (incluant les balises `-----BEGIN OPENSSH PRIVATE KEY-----`)
   - Coller dans le secret `AZURE_VM_SSH_KEY`

### Déploiement manuel

Pour tester localement :

```bash
# Construire l'image Docker
docker build -t cloud-tp:latest .

# Lancer avec Docker Compose
docker-compose up -d

# Accéder à l'application
curl http://localhost:3000
```

### Déploiement Kubernetes

Sur la VM Azure, après connexion SSH :

```bash
cd /home/azureuser/cloud-tp
kubectl apply -f k8s/
kubectl rollout status deployment/api-deployment
kubectl get pods
kubectl get svc
```

### Test
Le site devrait normalement êter disponible sur l'url :
> http://108.143.184.247:3000

Pour tester, on peut appeler l'endpoint de test :
```bash
curl http://108.143.184.247:3000/health
> StatusCode        : 200
> StatusDescription : OK
> Content           : {"status":"ok","database":"connected"}
> RawContent        : HTTP/1.1 200 OK
>                   Connection: keep-alive
>                   Keep-Alive: timeout=5
>                   Content-Length: 38
>                   Content-Type: application/json; charset=utf-8
>                   Date: Fri, 24 Apr 2026 10:19:39 GMT
>                   ETag: W/"26-G5LxOYyjFUYa+WPP6EvZ...
> Forms             : {}
> Headers           : {[Connection, keep-alive], [Keep-Alive, timeout=5], > [Content-Length, 38], [Content-Type,
                    application/json; charset=utf-8]...}
> Images            : {}
> InputFields       : {}
> Links             : {}
> ParsedHtml        : mshtml.HTMLDocumentClass
> RawContentLength  : 38
```

---

## Difficultés rencontrées

### 1. Configuration des secrets GitHub

**Problème** : Les secrets n'étaient pas reconnus par le workflow. Le débogage montrait `null` pour toutes les variables d'environnement.

**Solution** : Vérifier que les secrets sont bien créés au niveau du dépôt (repository secrets) et non au niveau de l'organisation.

### 2. Utilisation de la clé publique au lieu de la clé privée

**Problème** : Tentative de connexion SSH avec le fichier `.pub` (clé publique) au lieu de la clé privée.

**Solution** : Utiliser le fichier de clé privée (`github_action`) pour la connexion SSH, jamais le fichier `.pub`.

### 3. Clé SSH avec passphrase

**Problème** : La clé SSH était protégée par une passphrase, ce qui causait un blocage lors de la connexion SSH automatique dans le pipeline.

**Solution** :
- Créer une nouvelle clée pour la connection, sans passphrase : `ssh-keygen -p -m PEM -f ~/.ssh/github_action`

### 5. Vérification de la clé d'hôte SSH

**Problème** : Erreur `Host key verification failed` lors de la première connexion.

**Solution** : Ajouter l'option `-o StrictHostKeyChecking=no` à la commande SSH pour accepter automatiquement la clé d'hôte du serveur distant.

---

## Résumé

Ce projet illustre les défis pratiques de la mise en place d'un pipeline CI/CD complet :
- Configuration sécurisée des secrets
- Gestion des clés SSH
- Déploiement automatisé sur infrastructure cloud
- Intégration avec Kubernetes

Le pipeline fonctionne maintenant de manière autonome et se déclenche à chaque push sur la branche principale.
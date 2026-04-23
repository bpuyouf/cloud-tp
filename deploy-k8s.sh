#!/bin/bash

# Deploy to Kubernetes
# Assumes you have a Kubernetes cluster running (e.g., minikube, AKS, etc.)

echo "Deploying to Kubernetes..."

# Apply configurations in order
kubectl apply -f k8s/config.yaml
kubectl apply -f k8s/pvc.yaml
kubectl apply -f k8s/init-db-configmap.yaml
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/postgres-service.yaml
kubectl apply -f k8s/api-deployment.yaml
kubectl apply -f k8s/api-service.yaml

echo "Deployment complete!"
echo "Check status with: kubectl get pods,svc"
echo "Get API service URL with: kubectl get svc api-service"
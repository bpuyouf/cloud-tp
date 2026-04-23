# Project Guide

## Purpose
This document defines the organization and structure for the cloud computing assignment.
It is a reference for what each major file and folder should contain, what the architecture is, and how to keep the work organized across the different steps.

## Project Architecture
The project is built around a simple cloud + container workflow.

1. Local code repository
   - Application source files
   - Docker configuration
   - GitHub Actions workflow for build/test/deploy
2. Docker containerization
   - `Dockerfile` defines how to package the application
   - `docker-compose.yml` (optional) defines local multi-service setup
3. Azure VM deployment
   - A Linux VM running Docker
   - The container is deployed to the VM
   - Scripts or commands should automate deployment as much as possible
4. CI/CD workflow
   - GitHub Actions runs on repository changes
   - It builds the Docker image and can push to a registry
   - It may also optionally SSH into the VM to deploy or trigger a deployment script

## Key Files and Their Roles

- `README.md`
  - High-level project summary
  - Setup instructions
  - How to run the app locally
  - How to deploy to Azure VM or run GitHub Actions

- `rapport.md`
  - Assignment report and lab deliverable
  - Step-by-step progress for each assignment task
  - Observations, results, and conclusions
  - Should be updated after each step is completed

- `PROJECT_GUIDE.md`
  - This file
  - Defines the conventions and organization for the project
  - Helps keep the work consistent across steps

- `Dockerfile`
  - Builds the application container image
  - Should be written for the exact app stack used in the assignment

- `docker-compose.yml` (optional)
  - Useful if the app requires multiple services (example: app + database)
  - Not required for a single-container assignment unless the architecture needs it

- `.github/workflows/` or `azure-pipelines.yml`
  - CI/CD workflow definitions
  - For GitHub Actions, use a workflow file under `.github/workflows/`
  - For Azure DevOps, use `azure-pipelines.yml`

- `scripts/` (optional)
  - Utility scripts for deployment, VM setup, or environment initialization
  - Example: `scripts/deploy.sh`, `scripts/setup-vm.sh`

## Recommended Project Structure

- `README.md`
- `rapport.md`
- `rapport images/` 
- `PROJECT_GUIDE.md`
- `Dockerfile`
- `docker-compose.yml` (if needed)
- `.github/workflows/` (if using GitHub Actions)
- `scripts/` (optional helper scripts)
- `src/` API application code
- `tests/` if the assignment includes testing

## Organization and Process

- Keep the report updated after each assignment step
- Use the README for usage and setup instructions
- Use the guide to check architecture and file roles
- Store all application code in `src/` or a clearly named folder
- Keep infrastructure and deployment config together but separate from source code
- Prefer meaningful names for files and scripts

## Work Progress Tracking

When working through assignment steps, follow this pattern:

1. Add a section to `rapport.md` for the current step
2. Update or add files needed for the step
3. Test locally first with Docker
4. Validate deployment to Azure VM if required
5. Summarize results and any issues in `rapport.md`

## Notes on Azure VM + Docker Action

- The Azure VM is the target runtime environment
- The Docker container is the packaged application
- GitHub Actions can automate building and publishing the container
- If the VM is managed manually, include explicit commands or scripts for deployment

## Keeping It Organized

- Use this guide as the single source of truth for project structure
- Reference the architecture section before adding new files
- Keep `README.md` and `rapport.md` updated and aligned with actual work
- Keep changes small and incremental per assignment step

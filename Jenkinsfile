pipeline {
    agent any

    environment {
        DOCKER = "C:\\Users\\ASUS\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe"
        KUBECTL = "C:\\ProgramData\\chocolatey\\bin\\kubectl.exe"

        BACKEND_IMAGE = "manasvi080205/smart-pg-backend:latest"
        FRONTEND_IMAGE = "manasvi080205/smart-pg-frontend:latest"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    credentialsId: 'github-creds',
                    url: 'https://github.com/manasvitiwari-08/Smart-PG-Hostel-Management-System.git'
            }
        }

        stage('Check Tools') {
            steps {
                bat '''
                git --version
                "%DOCKER%" version
                "%KUBECTL%" version --client
                '''
            }
        }

        stage('Build Backend Image') {
            steps {
                dir('server') {
                    bat '''
                    "%DOCKER%" build -t %BACKEND_IMAGE% .
                    '''
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                dir('client') {
                    bat '''
                    "%DOCKER%" build -t %FRONTEND_IMAGE% .
                    '''
                }
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {

                    bat '''
                    @echo off
                    echo Logging into Docker Hub...
                    echo %DOCKER_PASS% | "%DOCKER%" login -u %DOCKER_USER% --password-stdin
                    '''
                }
            }
        }

        stage('Push Backend Image') {
            steps {
                bat '''
                "%DOCKER%" push %BACKEND_IMAGE%
                '''
            }
        }

        stage('Push Frontend Image') {
            steps {
                bat '''
                "%DOCKER%" push %FRONTEND_IMAGE%
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                bat '''
                "%KUBECTL%" apply -f k8s\\configmap.yaml
                "%KUBECTL%" apply -f k8s\\secret.yaml
                "%KUBECTL%" apply -f k8s\\backend-deployment.yaml
                "%KUBECTL%" apply -f k8s\\backend-service.yaml
                "%KUBECTL%" apply -f k8s\\frontend-deployment.yaml
                "%KUBECTL%" apply -f k8s\\frontend-service.yaml
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                bat '''
                "%KUBECTL%" rollout status deployment/backend
                "%KUBECTL%" rollout status deployment/frontend
                "%KUBECTL%" get pods
                "%KUBECTL%" get svc
                '''
            }
        }
    }

    post {

        success {
            echo 'Deployment Successful'
            bat '"%DOCKER%" logout'
        }

        failure {
            echo 'Pipeline Failed'

            bat '''
            "%KUBECTL%" rollout undo deployment/backend || exit /b 0
            "%KUBECTL%" rollout undo deployment/frontend || exit /b 0
            '''

            bat '"%DOCKER%" logout'
        }

        always {
            cleanWs()
        }
    }
} 
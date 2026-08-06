pipeline {
    agent any

    environment {
        FRONTEND_IMAGE = "manasvi080205/smart-pg-frontend:latest"
        BACKEND_IMAGE  = "manasvi080205/smart-pg-backend:latest"
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
                docker version
                kubectl version --client
                '''
            }
        }

        stage('Build Backend Image') {
            steps {
                dir('server') {
                    bat '''
                    docker build -t %BACKEND_IMAGE% .
                    '''
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                dir('client') {
                    bat '''
                    docker build -t %FRONTEND_IMAGE% .
                    '''
                }
            }
        }

        stage('Docker Login Only') {
    steps {
        withCredentials([usernamePassword(
            credentialsId: 'dockerhub-creds',
            usernameVariable: 'DOCKER_USER',
            passwordVariable: 'DOCKER_PASS'
        )]) {
            bat '''
            @echo off
            docker logout
            echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
            '''
        }
    }
} 

        stage('Push Backend Image') {
            steps {
                bat '''
                docker push %BACKEND_IMAGE%
                '''
            }
        }

        stage('Push Frontend Image') {
            steps {
                bat '''
                docker push %FRONTEND_IMAGE%
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                bat '''
                kubectl apply -f k8s\\configmap.yaml
                kubectl apply -f k8s\\secret.yaml
                kubectl apply -f k8s\\backend-deployment.yaml
                kubectl apply -f k8s\\backend-service.yaml
                kubectl apply -f k8s\\frontend-deployment.yaml
                kubectl apply -f k8s\\frontend-service.yaml
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                bat '''
                kubectl rollout status deployment/backend
                kubectl rollout status deployment/frontend
                kubectl get pods
                kubectl get svc
                '''
            }
        }
    }

    post {

        success {
            echo 'Deployment Successful'
            bat 'docker logout'
        }

        failure {
            echo 'Pipeline Failed'

            bat '''
            kubectl rollout undo deployment/backend
            kubectl rollout undo deployment/frontend
            '''

            bat 'docker logout'
        }

        always {
            cleanWs()
        }
    }
} 
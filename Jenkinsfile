pipeline {
    agent any
    environment {
        dir_app = '/app/deploy/'
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm // this will get the code from the repository that triggered the build
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build') {
            steps {
                sh 'node --check server.js' //check syntax of server.js
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deployment stage will be configured for AWS EC2.'
                sh '''
               sudo mkdir -p ${dir_app}
               sudo chown -R jenkins:jenkins ${dir_app}
               rsync -av --delete --exclude='node_modules' --exclude='.git' ./ ${dir_app}/
                
                cd ${dir_app}   
                sudo npm ci          
                sudo npm run build
                sudo fuser -k 3000/tcp || true
                sudo npm run start

                '''
            }
        }
    }

    post {
        success {
            echo 'CI pipeline completed successfully.'
        }
        failure {
            echo 'CI pipeline failed.'
        }
    }
}

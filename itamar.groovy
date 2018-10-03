pipeline {
    agent none
    stages {
        stage ('unit-testing') {
            agent {
                label 'reanalyzer-backend'
            }        
            steps {
                sh 'sudo apt-get install build-essential -y'
                sh 'sudo service mongod start'
                sh 'npm install'
                sh 'npm run test:coverage'
            }
        }        
    }
}

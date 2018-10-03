pipeline {
    agent none
    stages {
        stage ('unit-testing') {
            agent {
                label 'reanalyzer-backend'
            }        
            steps {
                sh 'sudo service mongod start'
                sh 'sudo npm install'
                sh 'npm run test:coverage'
            }
        }        
    }
}

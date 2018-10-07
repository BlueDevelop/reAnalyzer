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
                sh 'sudo npm install -g node-gyp node-pre-gyp'
                sh 'npm install'
                sh 'npm run test:coverage'
            }
        }        
    }
}

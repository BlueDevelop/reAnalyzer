pipeline {
    agent none
    stages {
        agent {
            label 'default'
        }
        steps {
            sh 'npm run test:coverage'
        }
    }
}
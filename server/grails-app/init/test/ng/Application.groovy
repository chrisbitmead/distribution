package test.ng

import grails.boot.GrailsApp
import grails.boot.config.GrailsAutoConfiguration
import org.grails.config.NavigableMapPropertySource
import org.grails.config.yaml.YamlPropertySourceLoader
import org.springframework.core.env.Environment
import org.springframework.context.EnvironmentAware
import org.springframework.core.env.MapPropertySource
import org.springframework.core.env.PropertySource
import org.springframework.core.io.FileSystemResource
import org.springframework.core.io.Resource

class Application extends GrailsAutoConfiguration implements EnvironmentAware {
    static void main(String[] args) {
        GrailsApp.run(Application, args)
    }

    @Override
    void setEnvironment(Environment environment) {
        def configFiles = ['groovy', 'yml', 'properties'].collect { "${System.getProperty('user.home')}/conf/fap-config.".concat(it) }
        String env = System.getenv('fap_config')
        if (env) {
            configFiles.add(env)
        }
        System.out.println("Looking for external config in ${configFiles} for environments: ${environment.getActiveProfiles()}")
        configFiles.each { configFileName ->
            Resource resource = new FileSystemResource(configFileName)
            if (resource.exists()) {
                try {
                    PropertySource propertySource
                    if (configFileName.endsWith('.groovy')) {
                        File configBase = new File(configFileName)
                        boolean ex = configBase.exists()
                        Map config = new ConfigSlurper().parse(configBase.toURI().toURL())
                        propertySource = new MapPropertySource(resource.filename, config)
                    } else if (configFileName.endsWith('.yml')) {
                        List<PropertySource<?>> sources = new YamlPropertySourceLoader().load(resource.filename, resource)
                        if (sources.size() > 0) {
                            propertySource = sources.first() as NavigableMapPropertySource
                        }
                    } else if (configFileName.endsWith('.properties')) {
                        def props = new Properties()
                        properties.load(resource.inputStream)
                        propertySource = new MapPropertySource(resource.filename, properties as Map)
                    }
                    if (propertySource?.getSource() && !propertySource.getSource().isEmpty()) {
                        println "Loading external configuration: ${configFileName}"
                        environment.propertySources.addFirst(propertySource)
                    } else {
                        println "Unknown external configuration type: ${configFileName}"
                    }
                } catch (Throwable x) {
                    println "Error loading ${configFileName}: $x.localizedMessage"
                    x.printStackTrace()
                }
            }
        }
    }
}

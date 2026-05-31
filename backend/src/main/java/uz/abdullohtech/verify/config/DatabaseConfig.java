package uz.abdullohtech.verify.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import java.net.URI;
import java.net.URISyntaxException;

@Configuration
public class DatabaseConfig {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseConfig.class);

    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource")
    public DataSourceProperties dataSourceProperties() {
        DataSourceProperties properties = new DataSourceProperties();
        String databaseUrl = System.getenv("DATABASE_URL");
        
        if (databaseUrl != null && !databaseUrl.trim().isEmpty() && databaseUrl.startsWith("postgres")) {
            logger.info("DATABASE_URL environment variable detected. Parsing connection details...");
            try {
                // Parse standard DATABASE_URL: postgresql://username:password@host:port/database
                URI dbUri = new URI(databaseUrl);
                String userInfo = dbUri.getUserInfo();
                
                if (userInfo != null && userInfo.contains(":")) {
                    String username = userInfo.split(":")[0];
                    String password = userInfo.split(":")[1];
                    String dbUrl = "jdbc:postgresql://" + dbUri.getHost() + ":" + dbUri.getPort() + dbUri.getPath();
                    
                    properties.setUrl(dbUrl);
                    properties.setUsername(username);
                    properties.setPassword(password);
                    properties.setDriverClassName("org.postgresql.Driver");
                    logger.info("Database connection configured successfully from DATABASE_URL. Host: {}, Database: {}", dbUri.getHost(), dbUri.getPath());
                    return properties;
                } else {
                    logger.warn("DATABASE_URL userInfo is missing or invalid.");
                }
            } catch (URISyntaxException | NullPointerException e) {
                logger.error("Failed to parse DATABASE_URL: {}", e.getMessage());
            }
        } else {
            logger.info("DATABASE_URL not found or invalid. Falling back to application.yml configuration.");
        }
        
        return properties;
    }
}

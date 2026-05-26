package uz.abdullohtech.verify.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import uz.abdullohtech.verify.exception.RateLimitExceededException;

import java.util.concurrent.TimeUnit;

@Component
public class RateLimitingInterceptor implements HandlerInterceptor {

    private final StringRedisTemplate redisTemplate;

    @Value("${app.rate-limit.max-requests:10}")
    private int maxRequests;

    @Value("${app.rate-limit.window-seconds:60}")
    private int windowSeconds;

    public RateLimitingInterceptor(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String ipAddress = request.getRemoteAddr();
        String uri = request.getRequestURI();
        
        // We only rate limit the verification endpoint
        if (!uri.startsWith("/api/v1/verify")) {
            return true;
        }

        // Bypass health check ping from rate limiting
        if (uri.endsWith("/health-ping")) {
            return true;
        }

        String redisKey = "rate:limit:" + ipAddress + ":" + uri;

        Long count = redisTemplate.opsForValue().increment(redisKey);

        if (count != null && count == 1) {
            redisTemplate.expire(redisKey, windowSeconds, TimeUnit.SECONDS);
        }

        if (count != null && count > maxRequests) {
            throw new RateLimitExceededException("So'rovlar soni me'yordan oshib ketdi. Iltimos, " + windowSeconds + " soniyadan keyin qayta urinib ko'ring.");
        }

        return true;
    }
}

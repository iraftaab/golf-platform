package com.golf;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
//@ComponentScan(basePackages = "com.golf")
public class GolfPlatformApplication {

    public static void main(String[] args) {
        SpringApplication.run(GolfPlatformApplication.class, args);
    }

}
package com.taskmanager.dto.request;

import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
public class ProjectRequest {

    @Schema(
            example = "Portfolio Backend",
            description = "Nombre del proyecto")
    private String name;

    @Schema(
            example = "Proyecto para demostrar habilidades Spring Boot")
    private String description;
}

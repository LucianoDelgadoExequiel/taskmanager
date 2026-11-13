package com.taskmanager.dto.request;

import com.taskmanager.entity.Priority;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TaskRequest {

    @Schema(example = "Implementar JWT")
    private String title;

    @Schema(example = "Agregar autenticación con Spring Security")
    private String description;

    @Schema(example = "HIGH")
    private Priority priority;

    @Schema(example = "2026-12-31")
    private LocalDate dueDate;

    @Schema(example = "1")
    private Long projectId;

}

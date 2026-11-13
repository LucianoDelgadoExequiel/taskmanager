package com.taskmanager.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProjectResponse {

    private Long id;

    private String name;

    private String description;

    private String ownerUsername;
}

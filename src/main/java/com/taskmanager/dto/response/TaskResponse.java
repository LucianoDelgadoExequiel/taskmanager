package com.taskmanager.dto.response;

import com.taskmanager.entity.Priority;
import com.taskmanager.entity.TaskStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class TaskResponse {

    private Long id;

    private String title;

    private String description;

    private TaskStatus status;

    private Priority priority;

    private LocalDate dueDate;

    private String projectName;

    private String assignedUsername;
}

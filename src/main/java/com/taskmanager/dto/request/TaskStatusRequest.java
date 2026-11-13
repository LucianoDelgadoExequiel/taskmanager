package com.taskmanager.dto.request;

import com.taskmanager.entity.TaskStatus;
import lombok.Data;

@Data
public class TaskStatusRequest {

    private TaskStatus status;
}

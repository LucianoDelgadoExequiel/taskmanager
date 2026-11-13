package com.taskmanager.service.impl;

import com.taskmanager.dto.request.TaskRequest;
import com.taskmanager.dto.response.TaskResponse;
import com.taskmanager.entity.Project;
import com.taskmanager.entity.Task;
import com.taskmanager.entity.TaskStatus;
import com.taskmanager.entity.User;
import com.taskmanager.repository.ProjectRepository;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import com.taskmanager.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Override
    public TaskResponse createTask(TaskRequest request) {

        Project project =
                projectRepository.findById(
                                request.getProjectId())
                        .orElseThrow();

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow();

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority())
                .status(TaskStatus.TODO)
                .dueDate(request.getDueDate())
                .project(project)
                .assignedTo(user)
                .build();

        return mapToResponse(
                taskRepository.save(task));
    }

    @Override
    public List<TaskResponse> getAllTasks() {

        return taskRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public TaskResponse getTaskById(Long id) {

        return mapToResponse(
                taskRepository.findById(id)
                        .orElseThrow());
    }

    @Override
    public TaskResponse updateTask(Long id,
                                   TaskRequest request) {

        Task task =
                taskRepository.findById(id)
                        .orElseThrow();

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());

        return mapToResponse(
                taskRepository.save(task));
    }

    @Override
    public TaskResponse updateStatus(Long id,
                                     TaskStatus status) {

        Task task =
                taskRepository.findById(id)
                        .orElseThrow();

        task.setStatus(status);

        return mapToResponse(
                taskRepository.save(task));
    }

    @Override
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    private TaskResponse mapToResponse(Task task) {

        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .projectName(task.getProject().getName())
                .assignedUsername(
                        task.getAssignedTo().getUsername())
                .build();
    }
}

package com.taskmanager.service.impl;

import com.taskmanager.dto.request.ProjectRequest;
import com.taskmanager.dto.response.ProjectResponse;
import com.taskmanager.entity.Project;
import com.taskmanager.repository.ProjectRepository;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    @Override
    public ProjectResponse createProject(
            ProjectRequest request) {

        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();

        project = projectRepository.save(project);

        return mapToResponse(project);
    }

    @Override
    public List<ProjectResponse> getAllProjects() {

        return projectRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ProjectResponse getProjectById(Long id) {

        Project project =
                projectRepository.findById(id)
                        .orElseThrow();

        return mapToResponse(project);
    }

    @Override
    public ProjectResponse updateProject(
            Long id,
            ProjectRequest request) {

        Project project =
                projectRepository.findById(id)
                        .orElseThrow();

        project.setName(request.getName());
        project.setDescription(request.getDescription());

        return mapToResponse(
                projectRepository.save(project)
        );
    }

    @Override
    public void deleteProject(Long id) {
        if (taskRepository.existsByProject_Id(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT);
        }
        projectRepository.deleteById(id);
    }

    private ProjectResponse mapToResponse(
            Project project) {

        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .ownerUsername(
                        project.getOwner() != null
                                ? project.getOwner().getUsername()
                                : null)
                .build();
    }
}

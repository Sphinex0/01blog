package api.backend.model.report;

public record ReviewRequest(
        Report.Status decision
) {}

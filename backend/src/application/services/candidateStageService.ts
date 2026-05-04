import { PrismaClient } from '@prisma/client';
import { Application } from '../../domain/models/Application';

const prisma = new PrismaClient();

export const updateCandidateStage = async (candidateId: number, newStageId: number): Promise<Application> => {
    // 1. Validate Candidate Exists
    const candidate = await prisma.candidate.findUnique({
        where: { id: candidateId },
    });
    if (!candidate) {
        throw new Error('Candidate not found');
    }

    // 2. Find Candidate's Active Application (most recent)
    const application = await prisma.application.findFirst({
        where: { candidateId },
        orderBy: { applicationDate: 'desc' },
        include: {
            position: {
                include: {
                    interviewFlow: true,
                },
            },
        },
    });
    if (!application) {
        throw new Error('No application found for this candidate');
    }

    // 3. Validate New Stage Exists
    const newStage = await prisma.interviewStep.findUnique({
        where: { id: newStageId },
    });
    if (!newStage) {
        throw new Error('Interview stage not found');
    }

    // 4. Validate InterviewFlow Consistency (CRITICAL)
    const positionInterviewFlowId = application.position.interviewFlowId;
    if (newStage.interviewFlowId !== positionInterviewFlowId) {
        throw new Error('Invalid stage for this position');
    }

    // 5. Update the Application's Stage using domain model
    const applicationModel = new Application({
        id: application.id,
        positionId: application.positionId,
        candidateId: application.candidateId,
        applicationDate: application.applicationDate,
        currentInterviewStep: newStageId,
        notes: application.notes,
    });

    // 6. Return Updated Application with related data
    const updatedApplication = await applicationModel.save();

    // Fetch the complete application with relations
    const completeApplication = await prisma.application.findUnique({
        where: { id: updatedApplication.id },
        include: {
            position: {
                select: {
                    id: true,
                    title: true,
                    interviewFlowId: true,
                },
            },
            interviewStep: {
                select: {
                    id: true,
                    name: true,
                    interviewFlowId: true,
                },
            },
        },
    });

    if (!completeApplication) {
        throw new Error('Error retrieving updated application');
    }

    return new Application(completeApplication);
};

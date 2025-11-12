import type { User, Report } from '../types';
import { Role, ReportStatus } from '../types';

export const ROLES: Role[] = [Role.Staff, Role.ZonalCoordinator, Role.DirectorGeneral, Role.Admin];

const sampleSignatureSvg = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgNjAiIHdpZHRoPSIyMDAiIGhlaWdodD0iNjAiPjxwYXRoIGQ9Ik0xMCw0MCBDMzAsMjAgNzAsMjAgOTAsNDAgQzExMCw2MCAxMzAsNjAgMTUwLDQwIEMxNzAsMjAgMTkwLDIwIDE5MCw0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+`;

export let MOCK_USERS: User[] = [
    { id: 'user-1', name: 'Adebayo Akinwunmi', email: 'staff@nimasa.gov', role: Role.Staff, avatarUrl: 'https://i.pravatar.cc/150?u=staff@nimasa.gov', eSignatureUrl: sampleSignatureSvg },
    { id: 'user-2', name: 'Chidinma Okoro', email: 'coordinator@nimasa.gov', role: Role.ZonalCoordinator, avatarUrl: 'https://i.pravatar.cc/150?u=coordinator@nimasa.gov' },
    { id: 'user-3', name: 'Dr. Bashir Jamoh', email: 'dg@nimasa.gov', role: Role.DirectorGeneral, avatarUrl: 'https://i.pravatar.cc/150?u=dg@nimasa.gov' },
    { id: 'user-4', name: 'Tunde Fowler', email: 'admin@nimasa.gov', role: Role.Admin, avatarUrl: 'https://i.pravatar.cc/150?u=admin@nimasa.gov' },
    { id: 'user-5', name: 'Ngozi Okonjo', email: 'staff2@nimasa.gov', role: Role.Staff, avatarUrl: 'https://i.pravatar.cc/150?u=staff2@nimasa.gov' },
];

export let MOCK_REPORTS: Report[] = [
    {
        id: 'report-1',
        title: 'Q3 Zonal Operations Summary',
        recipients: ['dg@nimasa.gov'],
        eventStartDate: '2023-07-01',
        eventEndDate: '2023-09-30',
        location: 'Lagos Zonal Office',
        content: 'This report summarizes the operational activities of the Lagos Zonal Office for the third quarter of 2023. Key achievements include...',
        executiveSummary: 'Q3 saw a 15% increase in operational efficiency and successful completion of two major projects. Key metrics are positive across the board.',
        attachments: [],
        authorId: 'user-1',
        collaboratorIds: ['user-5'],
        status: ReportStatus.Approved,
        signatures: [
            { userId: 'user-1', userName: 'Adebayo Akinwunmi', role: Role.Staff, signedAt: '2023-10-02T10:00:00Z' },
            { userId: 'user-2', userName: 'Chidinma Okoro', role: Role.ZonalCoordinator, signedAt: '2023-10-03T14:00:00Z' },
            { userId: 'user-3', userName: 'Dr. Bashir Jamoh', role: Role.DirectorGeneral, signedAt: '2023-10-05T09:00:00Z' }
        ],
        createdAt: '2023-10-01T09:00:00Z',
        updatedAt: '2023-10-05T09:00:00Z'
    },
    {
        id: 'report-2',
        title: 'Incident Report - MV Starlight',
        recipients: ['coordinator@nimasa.gov'],
        eventStartDate: '2023-10-15',
        eventEndDate: '2023-10-15',
        location: 'Port Harcourt Anchorage',
        content: 'At approximately 14:30 local time, a minor collision was reported involving MV Starlight. This draft outlines the initial findings...',
        attachments: [],
        authorId: 'user-5',
        collaboratorIds: ['user-1'],
        status: ReportStatus.Submitted,
        signatures: [
             { userId: 'user-5', userName: 'Ngozi Okonjo', role: Role.Staff, signedAt: '2023-10-16T11:00:00Z' }
        ],
        createdAt: '2023-10-16T09:00:00Z',
        updatedAt: '2023-10-16T11:00:00Z'
    },
    {
        id: 'report-3',
        title: 'Weekly Patrol Report - Oct 9-15',
        recipients: ['coordinator@nimasa.gov'],
        eventStartDate: '2023-10-09',
        eventEndDate: '2023-10-15',
        location: 'Warri Escravos Channel',
        content: '',
        attachments: [],
        authorId: 'user-1',
        collaboratorIds: [],
        status: ReportStatus.Draft,
        signatures: [],
        createdAt: '2023-10-16T12:00:00Z',
        updatedAt: '2023-10-16T12:00:00Z'
    }
];

// Mock API functions
export const getReportsForUser = async (user: User): Promise<Report[]> => {
    await new Promise(res => setTimeout(res, 500)); // Simulate network delay
    switch(user.role) {
        case Role.DirectorGeneral:
            return MOCK_REPORTS.filter(r => r.status === ReportStatus.Reviewed || r.status === ReportStatus.Approved);
        case Role.ZonalCoordinator:
            return MOCK_REPORTS.filter(r => r.status === ReportStatus.Submitted || r.status === ReportStatus.Reviewed || r.status === ReportStatus.Approved);
        case Role.Staff:
            return MOCK_REPORTS.filter(r => r.authorId === user.id || r.collaboratorIds.includes(user.id));
        case Role.Admin:
            return MOCK_REPORTS;
        default:
            return [];
    }
};

export const updateReport = async (report: Report): Promise<Report> => {
    await new Promise(res => setTimeout(res, 300));
    const index = MOCK_REPORTS.findIndex(r => r.id === report.id);
    if (index !== -1) {
        MOCK_REPORTS[index] = { ...report, updatedAt: new Date().toISOString() };
        return MOCK_REPORTS[index];
    }
    throw new Error('Report not found');
};

export const createReport = async (author: User): Promise<Report> => {
    await new Promise(res => setTimeout(res, 300));
    const newReport: Report = {
        id: `report-${Date.now()}`,
        title: `New Report - ${new Date().toLocaleString()}`,
        recipients: [],
        eventStartDate: new Date().toISOString().split('T')[0],
        eventEndDate: new Date().toISOString().split('T')[0],
        location: '',
        content: '',
        attachments: [],
        authorId: author.id,
        collaboratorIds: [],
        status: ReportStatus.Draft,
        signatures: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    MOCK_REPORTS.unshift(newReport);
    return newReport;
};

export const updateUser = async (userToUpdate: User): Promise<User> => {
    await new Promise(res => setTimeout(res, 300));
    const index = MOCK_USERS.findIndex(u => u.id === userToUpdate.id);
    if (index !== -1) {
        MOCK_USERS[index] = { ...MOCK_USERS[index], ...userToUpdate };
        return MOCK_USERS[index];
    }
    throw new Error('User not found');
};

export const deleteUser = async (userId: string): Promise<{ success: boolean }> => {
    await new Promise(res => setTimeout(res, 300));
    const index = MOCK_USERS.findIndex(u => u.id === userId);
    if (index !== -1) {
        MOCK_USERS.splice(index, 1);
        return { success: true };
    }
    throw new Error('User not found');
};

export const changePassword = async (userId: string, currentPass: string, newPass: string): Promise<{ success: boolean; message?: string }> => {
    await new Promise(res => setTimeout(res, 500));
    const user = MOCK_USERS.find(u => u.id === userId);
    if (!user) {
        return { success: false, message: 'User not found' };
    }
    // In a real app, you would verify the current password here. This is just a mock.
    console.log(`Password change requested for user ${userId}. New password: ${newPass}`);
    return { success: true };
};
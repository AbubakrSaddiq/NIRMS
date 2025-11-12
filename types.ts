export enum Role {
  Staff = 'Staff',
  ZonalCoordinator = 'Zonal Coordinator',
  DirectorGeneral = 'Director General',
  Admin = 'Admin'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl: string;
  eSignatureUrl?: string;
}

export enum ReportStatus {
    Draft = 'Draft',
    Submitted = 'Submitted to Zonal Coordinator',
    Reviewed = 'Reviewed by Zonal Coordinator',
    Approved = 'Approved by Director General',
    Rejected = 'Rejected'
}

export interface Signature {
    userId: string;
    userName: string;
    role: Role;
    signedAt: string;
}

export interface Report {
    id: string;
    title: string;
    recipients: string[];
    eventStartDate: string;
    eventEndDate: string;
    location: string;
    content: string;
    executiveSummary?: string;
    attachments: File[];
    authorId: string;
    collaboratorIds: string[];
    status: ReportStatus;
    signatures: Signature[];
    createdAt: string;
    updatedAt: string;
}
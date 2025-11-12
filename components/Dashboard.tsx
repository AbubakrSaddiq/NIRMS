import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { User, Report, Signature } from '../types';
import { Role, ReportStatus } from '../types';
import { useAuth } from '../App';
import { MOCK_USERS, ROLES, getReportsForUser, updateReport, createReport, updateUser, deleteUser, changePassword } from '../services/mockApi';
import { generateDraftAssistant, generateExecutiveSummary, provideWritingFeedback } from '../services/geminiService';
import {
    Logo, DashboardIcon, ReportIcon, ArchiveIcon, UsersIcon, LogoutIcon, EditIcon, SignatureIcon, AiSparklesIcon,
    Spinner, CheckCircleIcon, ClockIcon, SendIcon, PaperclipIcon, TrashIcon, BoldIcon, ItalicIcon, ListIcon,
    UserCircleIcon, KeyIcon, UploadCloudIcon
} from './Icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';


// -- LAYOUT COMPONENTS -- //

const Sidebar: React.FC<{ onNavigate: (view: string) => void; activeView: string }> = ({ onNavigate, activeView }) => {
    const { user, logout } = useAuth();

    const navItems = useMemo(() => {
        const baseItems = [
            { name: 'Dashboard', icon: DashboardIcon, view: 'dashboard' },
            { name: 'Reports', icon: ReportIcon, view: 'reports' },
        ];
        if (user?.role === Role.Admin) {
            baseItems.push({ name: 'User Management', icon: UsersIcon, view: 'users' });
        }
        return baseItems;
    }, [user?.role]);

    const NavLink: React.FC<{ item: any }> = ({ item }) => (
        <button
            onClick={() => onNavigate(item.view)}
            className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${activeView === item.view ? 'bg-nimasa-green/20 text-white' : 'text-gray-300 hover:bg-nimasa-dark hover:text-white'}`}
        >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.name}</span>
        </button>
    );

    return (
        <div className="w-64 bg-nimasa-blue flex flex-col h-screen fixed">
            <div className="flex items-center justify-center h-20 border-b border-nimasa-green/20">
                <Logo />
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map(item => <NavLink key={item.name} item={item} />)}
            </nav>
            <div className="p-4 border-t border-nimasa-green/20">
                <p className="px-4 py-2 text-xs text-gray-400 uppercase">Account</p>
                 <button
                    onClick={() => onNavigate('profile')}
                    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${activeView === 'profile' ? 'bg-nimasa-green/20 text-white' : 'text-gray-300 hover:bg-nimasa-dark hover:text-white'}`}
                >
                    <UserCircleIcon className="w-5 h-5 mr-3" />
                    <span>Profile Settings</span>
                </button>
                <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-nimasa-dark hover:text-white transition-colors duration-200"
                >
                    <LogoutIcon className="w-5 h-5 mr-3" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

const Header: React.FC<{ title: string; onNavigate: (view: string) => void }> = ({ title, onNavigate }) => {
    const { user, logout } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileMenuRef = React.useRef<HTMLDivElement>(null);

     useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="bg-nimasa-lightBlue/80 backdrop-blur-sm sticky top-0 z-10">
            <div className="h-20 flex items-center justify-between px-8">
                <h1 className="text-2xl font-bold text-nimasa-dark">{title}</h1>
                <div className="flex items-center space-x-4">
                    <div className="text-right">
                        <p className="font-semibold text-nimasa-dark">{user?.name}</p>
                        <p className="text-sm text-gray-600">{user?.role}</p>
                    </div>
                    <div className="relative" ref={profileMenuRef}>
                        <button onClick={() => setIsProfileOpen(prev => !prev)} className="focus:outline-none">
                            <img src={user?.avatarUrl} alt="User avatar" className="w-12 h-12 rounded-full border-2 border-nimasa-green hover:ring-2 hover:ring-nimasa-green/50 transition-all" />
                        </button>
                         {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 animate-fade-in-up origin-top-right ring-1 ring-black ring-opacity-5">
                                <div className="px-4 py-3 border-b">
                                    <p className="font-semibold text-nimasa-dark truncate text-sm">{user?.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                </div>
                                <button
                                    onClick={() => { onNavigate('profile'); setIsProfileOpen(false); }}
                                    className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <UserCircleIcon className="w-5 h-5 mr-3 text-gray-500"/>
                                    Profile Settings
                                </button>
                                <button
                                    onClick={logout}
                                    className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <LogoutIcon className="w-5 h-5 mr-3 text-gray-500"/>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};


// -- DASHBOARD COMPONENTS -- //

const StatusBadge: React.FC<{ status: ReportStatus }> = ({ status }) => {
    const colors = {
        [ReportStatus.Draft]: 'bg-gray-200 text-gray-800',
        [ReportStatus.Submitted]: 'bg-blue-200 text-blue-800',
        [ReportStatus.Reviewed]: 'bg-yellow-200 text-yellow-800',
        [ReportStatus.Approved]: 'bg-green-200 text-green-800',
        [ReportStatus.Rejected]: 'bg-red-200 text-red-800',
    };
    return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${colors[status]}`}>{status}</span>;
};


const ReportList: React.FC<{ reports: Report[], onSelectReport: (report: Report) => void, onNewReport: () => void, showNewReportButton: boolean }> = ({ reports, onSelectReport, onNewReport, showNewReportButton }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-nimasa-dark">Recent Reports</h2>
            {showNewReportButton && (
                <button onClick={onNewReport} className="bg-nimasa-green text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-600 transition-colors flex items-center">
                    <EditIcon className="w-4 h-4 mr-2" /> New Report
                </button>
            )}
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b">
                        <th className="p-3 text-sm font-semibold text-gray-600">Title</th>
                        <th className="p-3 text-sm font-semibold text-gray-600">Status</th>
                        <th className="p-3 text-sm font-semibold text-gray-600">Last Updated</th>
                        <th className="p-3 text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map(report => (
                        <tr key={report.id} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-medium text-nimasa-dark">{report.title}</td>
                            <td className="p-3"><StatusBadge status={report.status} /></td>
                            <td className="p-3 text-gray-600">{new Date(report.updatedAt).toLocaleDateString()}</td>
                            <td className="p-3">
                                <button onClick={() => onSelectReport(report)} className="text-nimasa-green font-semibold hover:underline">View</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

// Rich Text Editor
const RichTextEditor: React.FC<{ value: string; onChange: (value: string) => void; disabled: boolean; }> = ({ value, onChange, disabled }) => {
    const editorRef = React.useRef<HTMLDivElement>(null);
    
    React.useLayoutEffect(() => {
        if (editorRef.current && value !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = value;
        }
    }, [value]);

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        const newValue = e.currentTarget.innerHTML;
        if (value !== newValue) {
            onChange(newValue);
        }
    };

    const handleFormat = (command: string) => {
        if (disabled) return;
        document.execCommand(command, false);
        if (editorRef.current) {
             onChange(editorRef.current.innerHTML);
        }
    };
    
    const FormatButton = ({ command, children }: { command: string, children: React.ReactNode }) => (
        <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); handleFormat(command); }}
            disabled={disabled}
            className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
        >
            {children}
        </button>
    );

    return (
        <div className="border border-gray-300 rounded-md focus-within:ring-1 focus-within:ring-nimasa-green focus-within:border-nimasa-green">
            <div className={`flex items-center p-2 border-b bg-gray-50 rounded-t-md space-x-1 ${disabled ? 'cursor-not-allowed' : ''}`}>
                <FormatButton command="bold"><BoldIcon className="w-4 h-4" /></FormatButton>
                <FormatButton command="italic"><ItalicIcon className="w-4 h-4" /></FormatButton>
                <FormatButton command="insertUnorderedList"><ListIcon className="w-4 h-4" /></FormatButton>
            </div>
            <div
                ref={editorRef}
                onInput={handleInput}
                contentEditable={!disabled}
                className={`w-full p-4 min-h-[400px] prose max-w-none focus:outline-none ${disabled ? 'bg-gray-100' : ''}`}
                suppressContentEditableWarning={true}
            />
        </div>
    );
};

const markdownToHtml = (text: string): string => {
    const lines = text.trim().split(/\r?\n/);
    let html = '';
    let inUl = false;
    let inOl = false;

    const closeLists = () => {
        if (inUl) { html += '</ul>\n'; inUl = false; }
        if (inOl) { html += '</ol>\n'; inOl = false; }
    };

    lines.forEach(line => {
        line = line.trim();
        if (!line) return;
        if (line.startsWith('### ')) {
            closeLists();
            html += `<h3>${line.substring(4)}</h3>\n`;
        } else if (line.startsWith('* ')) {
            if (inOl) closeLists();
            if (!inUl) { html += '<ul>\n'; inUl = true; }
            html += `<li>${line.substring(2)}</li>\n`;
        } else if (line.match(/^\d+\. /)) {
            if (inUl) closeLists();
            if (!inOl) { html += '<ol>\n'; inOl = true; }
            html += `<li>${line.replace(/^\d+\. /, '')}</li>\n`;
        } else {
            closeLists();
            html += `<p>${line}</p>\n`;
        }
    });

    closeLists();
    return html;
};

const ReportEditor: React.FC<{ report: Report, onBack: () => void, onReportUpdate: (updatedReport: Report) => void }> = ({ report, onBack, onReportUpdate }) => {
    const { user } = useAuth();
    const [currentReport, setCurrentReport] = useState(report);
    const [isSaving, setIsSaving] = useState(false);
    const [aiLoading, setAiLoading] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const attachmentInputRef = React.useRef<HTMLInputElement>(null);

    const canEdit = user?.role === Role.Staff && (currentReport.authorId === user.id || currentReport.collaboratorIds.includes(user.id)) && currentReport.status === ReportStatus.Draft;
    const canSign = (
        (user?.role === Role.Staff && currentReport.status === ReportStatus.Draft && !currentReport.signatures.some(s => s.userId === user.id)) ||
        (user?.role === Role.ZonalCoordinator && currentReport.status === ReportStatus.Submitted && !currentReport.signatures.some(s => s.userId === user.id)) ||
        (user?.role === Role.DirectorGeneral && currentReport.status === ReportStatus.Reviewed && !currentReport.signatures.some(s => s.userId === user.id))
    );
    
    const canSubmit = user?.role === Role.Staff && currentReport.status === ReportStatus.Draft && currentReport.signatures.some(s => s.userId === user.id);
    const canForward = user?.role === Role.ZonalCoordinator && currentReport.status === ReportStatus.Submitted && currentReport.signatures.some(s => s.userId === user.id);
    const canApprove = user?.role === Role.DirectorGeneral && currentReport.status === ReportStatus.Reviewed && currentReport.signatures.some(s => s.userId === user.id);


    const handleSave = useCallback(async () => {
        setIsSaving(true);
        const updated = await updateReport(currentReport);
        onReportUpdate(updated);
        setIsSaving(false);
    }, [currentReport, onReportUpdate]);

    const handleFieldChange = (field: keyof Report, value: any) => {
        setCurrentReport(prev => ({ ...prev, [field]: value }));
    };
    
    const handleSign = async () => {
        if (!user) return;
        const newSignature: Signature = { userId: user.id, userName: user.name, role: user.role, signedAt: new Date().toISOString() };
        const updatedReport = { ...currentReport, signatures: [...currentReport.signatures, newSignature] };
        setCurrentReport(updatedReport);
        await updateReport(updatedReport);
        onReportUpdate(updatedReport);
    };
    
    const handleWorkflowAction = async () => {
        let newStatus = currentReport.status;
        if(canSubmit) newStatus = ReportStatus.Submitted;
        if(canForward) newStatus = ReportStatus.Reviewed;
        if(canApprove) newStatus = ReportStatus.Approved;
        
        const updatedReport = {...currentReport, status: newStatus};
        setCurrentReport(updatedReport);
        await updateReport(updatedReport);
        onReportUpdate(updatedReport);
    };

    const handleAiAction = async (action: 'draft' | 'summary' | 'feedback') => {
        setAiLoading(action);
        try {
            if (action === 'draft') {
                const draftMd = await generateDraftAssistant(currentReport.title);
                handleFieldChange('content', markdownToHtml(draftMd));
            } else if (action === 'summary') {
                const summary = await generateExecutiveSummary(currentReport.content);
                handleFieldChange('executiveSummary', summary);
            } else if (action === 'feedback') {
                const feedback = await provideWritingFeedback(currentReport.content);
                alert(`AI Feedback:\n\n${feedback}`);
            }
        } catch (error) { console.error("AI action failed:", error); alert("Failed to get AI assistance."); } finally { setAiLoading(null); }
    };
    
    const handleAddRecipient = (user: User) => {
        if (!currentReport.recipients.includes(user.email)) {
            handleFieldChange('recipients', [...currentReport.recipients, user.email]);
        }
        setSearchTerm('');
    };

    const handleRemoveRecipient = (email: string) => { handleFieldChange('recipients', currentReport.recipients.filter(r => r !== email)); };
    
    const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            handleFieldChange('attachments', [...(currentReport.attachments || []), ...newFiles]);
        }
    };
    
    const handleRemoveAttachment = (fileName: string) => { handleFieldChange('attachments', currentReport.attachments.filter(f => f.name !== fileName)); };
    
    const filteredUsers = useMemo(() => {
        if (!searchTerm) return [];
        return MOCK_USERS.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) && !currentReport.recipients.includes(u.email));
    }, [searchTerm, currentReport.recipients]);

    const collaborators = MOCK_USERS.filter(u => currentReport.collaboratorIds.includes(u.id) || u.id === currentReport.authorId);
    
    return (
        <div className="animate-fade-in-up">
            <button onClick={onBack} className="mb-4 text-nimasa-green font-semibold hover:underline">{'<'} Back to Reports</button>
            <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <input type="text" value={currentReport.title} onChange={(e) => handleFieldChange('title', e.target.value)} disabled={!canEdit} className="text-3xl font-bold text-nimasa-dark w-full border-none focus:ring-0 p-0 m-0 disabled:bg-transparent" />
                        <div className="mt-2 flex items-center space-x-4">
                            <StatusBadge status={currentReport.status} />
                            <div className="flex -space-x-2">{collaborators.map(c => <img key={c.id} src={c.avatarUrl} title={c.name} className="w-8 h-8 rounded-full border-2 border-white"/>)}</div>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        {isSaving && <div className="flex items-center text-gray-500"><Spinner className="w-4 h-4 mr-2"/> Saving...</div>}
                        {canEdit && <button onClick={handleSave} className="px-4 py-2 bg-gray-200 rounded-lg font-medium hover:bg-gray-300">Save Draft</button>}
                         { canSign && <button onClick={handleSign} className="px-4 py-2 bg-nimasa-blue text-white rounded-lg font-medium hover:bg-nimasa-dark transition-colors flex items-center"><SignatureIcon className="w-4 h-4 mr-2"/> Append Signature</button> }
                        { (canSubmit || canForward || canApprove) && <button onClick={handleWorkflowAction} className="px-4 py-2 bg-nimasa-green text-white rounded-lg font-medium hover:bg-teal-600 transition-colors flex items-center"><SendIcon className="w-4 h-4 mr-2" />{ canSubmit && 'Submit' }{ canForward && 'Forward' }{ canApprove && 'Approve' }</button> }
                    </div>
                </div>

                { canEdit && <div className="bg-nimasa-lightBlue p-3 rounded-lg mb-6 flex items-center space-x-2 border border-nimasa-green/20"><AiSparklesIcon className="w-6 h-6 text-nimasa-green"/><span className="font-semibold text-nimasa-dark">AI Assistant:</span><button onClick={() => handleAiAction('draft')} disabled={!!aiLoading} className="text-sm px-3 py-1 bg-white rounded-md shadow-sm hover:bg-gray-100 disabled:opacity-50 flex items-center">{aiLoading === 'draft' ? <Spinner className="w-4 h-4"/> : 'Generate Draft'}</button><button onClick={() => handleAiAction('summary')} disabled={!!aiLoading} className="text-sm px-3 py-1 bg-white rounded-md shadow-sm hover:bg-gray-100 disabled:opacity-50 flex items-center">{aiLoading === 'summary' ? <Spinner className="w-4 h-4"/> : 'Create Summary'}</button><button onClick={() => handleAiAction('feedback')} disabled={!!aiLoading} className="text-sm px-3 py-1 bg-white rounded-md shadow-sm hover:bg-gray-100 disabled:opacity-50 flex items-center">{aiLoading === 'feedback' ? <Spinner className="w-4 h-4"/> : 'Get Feedback'}</button></div> }
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {currentReport.executiveSummary && (<div><h3 className="text-lg font-semibold text-nimasa-dark mb-2">Executive Summary</h3><div className="prose p-4 bg-gray-100 rounded-md max-w-none" dangerouslySetInnerHTML={{ __html: currentReport.executiveSummary }} /></div>)}
                        <div><h3 className="text-lg font-semibold text-nimasa-dark mb-2">Report Content</h3><RichTextEditor value={currentReport.content} onChange={(v) => handleFieldChange('content', v)} disabled={!canEdit} /></div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-gray-50 p-4 rounded-lg border space-y-4"><h3 className="text-lg font-semibold text-nimasa-dark mb-2">Details</h3><div><label className="block text-sm font-medium text-gray-700">Recipients</label><div className="flex flex-wrap gap-2 my-2">{currentReport.recipients.map(email => <span key={email} className="bg-nimasa-green/20 text-nimasa-dark text-xs font-medium px-2 py-1 rounded-full flex items-center">{MOCK_USERS.find(u=>u.email===email)?.name || email}{canEdit && <button onClick={() => handleRemoveRecipient(email)} className="ml-2 text-nimasa-dark hover:text-red-500">×</button>}</span>)}</div><div className="relative">{canEdit && <><input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Add recipients..." className="mt-1 block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-nimasa-green focus:border-nimasa-green" />{filteredUsers.length > 0 && <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto mt-1">{filteredUsers.map(u => <li key={u.id} onClick={() => handleAddRecipient(u)} className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm">{u.name}</li>)}</ul>}</>}</div></div><div><label className="block text-sm font-medium text-gray-700">Event Dates</label><div className="flex items-center space-x-2 mt-1"><input type="date" value={currentReport.eventStartDate} onChange={e => handleFieldChange('eventStartDate', e.target.value)} disabled={!canEdit} className="w-full text-sm border-gray-300 rounded-md shadow-sm disabled:bg-gray-100"/><span className="text-gray-500">-</span><input type="date" value={currentReport.eventEndDate} onChange={e => handleFieldChange('eventEndDate', e.target.value)} disabled={!canEdit} className="w-full text-sm border-gray-300 rounded-md shadow-sm disabled:bg-gray-100"/></div></div><div><label className="block text-sm font-medium text-gray-700">Location</label><input type="text" value={currentReport.location} onChange={e => handleFieldChange('location', e.target.value)} disabled={!canEdit} className="mt-1 block w-full text-sm border-gray-300 rounded-md shadow-sm disabled:bg-gray-100" /></div><div><label className="block text-sm font-medium text-gray-700">Attachments</label><ul className="mt-1 space-y-1">{currentReport.attachments.map((file, i) => <li key={i} className="text-sm flex items-center justify-between bg-white p-1.5 rounded border"><span className="truncate">{file.name}</span>{canEdit && <button onClick={() => handleRemoveAttachment(file.name)}><TrashIcon className="w-4 h-4 text-red-500 hover:text-red-700"/></button>}</li>)}</ul>{canEdit && <><input type="file" multiple ref={attachmentInputRef} onChange={handleAttachmentChange} className="hidden" /><button onClick={() => attachmentInputRef.current?.click()} className="mt-2 w-full text-sm flex items-center justify-center px-3 py-2 border border-dashed border-gray-400 rounded-md text-gray-600 hover:bg-gray-100"><PaperclipIcon className="w-4 h-4 mr-2"/>Add Files</button></>}</div></div>
                        <div className="bg-gray-50 p-4 rounded-lg border"><h3 className="text-lg font-semibold text-nimasa-dark mb-2">Signatures</h3><ul className="space-y-3">{currentReport.signatures.map(sig => (<li key={sig.userId} className="flex items-center"><CheckCircleIcon className="w-5 h-5 text-green-500 mr-2"/><div><p className="font-semibold text-sm">{sig.userName}</p><p className="text-xs text-gray-500">{sig.role} - {new Date(sig.signedAt).toLocaleString()}</p></div></li>))}{currentReport.signatures.length === 0 && <p className="text-sm text-gray-500">No signatures yet.</p>}</ul></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DGAnalyticsDashboard: React.FC = () => {
    const data = [
      { name: 'Q1', submitted: 40, approved: 24 }, { name: 'Q2', submitted: 30, approved: 13 },
      { name: 'Q3', submitted: 20, approved: 18 }, { name: 'Q4', submitted: 27, approved: 19 },
    ];
    const pieData = [ { name: 'Operations', value: 400 }, { name: 'Incidents', value: 150 }, { name: 'Logistics', value: 300 }, { name: 'Patrol', value: 200 }, ];
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-md flex items-center"><ReportIcon className="w-10 h-10 text-nimasa-green mr-4"/><div><p className="text-gray-500">Total Reports (YTD)</p><p className="text-3xl font-bold text-nimasa-dark">117</p></div></div>
                 <div className="bg-white p-4 rounded-lg shadow-md flex items-center"><CheckCircleIcon className="w-10 h-10 text-green-500 mr-4"/><div><p className="text-gray-500">Pending Approval</p><p className="text-3xl font-bold text-nimasa-dark">3</p></div></div>
                 <div className="bg-white p-4 rounded-lg shadow-md flex items-center"><ClockIcon className="w-10 h-10 text-yellow-500 mr-4"/><div><p className="text-gray-500">Avg. Turnaround</p><p className="text-3xl font-bold text-nimasa-dark">3.2 Days</p></div></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md"><h3 className="text-lg font-semibold text-nimasa-dark mb-4">Quarterly Report Volume</h3><ResponsiveContainer width="100%" height={300}><BarChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Bar dataKey="submitted" fill="#8884d8" /><Bar dataKey="approved" fill="#82ca9d" /></BarChart></ResponsiveContainer></div>
                <div className="bg-white p-6 rounded-lg shadow-md"><h3 className="text-lg font-semibold text-nimasa-dark mb-4">Reports by Category</h3><ResponsiveContainer width="100%" height={300}><PieChart><Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
            </div>
        </div>
    );
};

const UserManagement: React.FC<{
    users: User[];
    onUpdateUser: (user: User) => void;
    onDeleteUser: (userId: string) => void;
}> = ({ users, onUpdateUser, onDeleteUser }) => {
    const { user: currentUser } = useAuth();

    const handleRoleChange = (userToUpdate: User, newRole: Role) => {
        onUpdateUser({ ...userToUpdate, role: newRole });
    };

    const handleDelete = (userId: string) => {
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            onDeleteUser(userId);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in-up">
            <h2 className="text-xl font-semibold text-nimasa-dark mb-4">User Management</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="p-3 text-sm font-semibold text-gray-600">User</th>
                            <th className="p-3 text-sm font-semibold text-gray-600">Role</th>
                            <th className="p-3 text-sm font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">
                                    <div className="flex items-center">
                                        <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full mr-3" />
                                        <div>
                                            <p className="font-medium text-nimasa-dark">{user.name}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-3 align-middle">
                                    {user.id === currentUser?.id ? (
                                        <span className="text-gray-600">{user.role}</span>
                                    ) : (
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user, e.target.value as Role)}
                                            className="block w-full max-w-xs px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-nimasa-green focus:border-nimasa-green sm:text-sm"
                                        >
                                            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    )}
                                </td>
                                <td className="p-3 align-middle">
                                    {user.id !== currentUser?.id ? (
                                        <button 
                                            onClick={() => handleDelete(user.id)}
                                            className="text-red-600 hover:text-red-800 flex items-center text-sm font-medium"
                                        >
                                            <TrashIcon className="w-4 h-4 mr-1" />
                                            Delete
                                        </button>
                                    ) : (
                                       <span className="text-sm text-gray-400 italic">Cannot edit self</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const UserProfile: React.FC<{ user: User; onProfileUpdate: (updatedUserData: Partial<User>) => Promise<void> }> = ({ user, onProfileUpdate }) => {
    const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
    const [isSavingSignature, setIsSavingSignature] = useState(false);
    const [signatureMessage, setSignatureMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const signatureInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSignaturePreview(reader.result as string);
                setSignatureMessage(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveSignature = async () => {
        if (!signaturePreview) return;
        setIsSavingSignature(true);
        setSignatureMessage(null);
        try {
            await onProfileUpdate({ eSignatureUrl: signaturePreview });
            setSignatureMessage({ type: 'success', text: 'Signature updated successfully!' });
            setSignaturePreview(null);
        } catch (error) {
            setSignatureMessage({ type: 'error', text: 'Failed to update signature.' });
        } finally {
            setIsSavingSignature(false);
        }
    };
    
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMessage(null);

        if (newPassword !== confirmPassword) {
            return setPasswordMessage({ type: 'error', text: "New passwords do not match." });
        }
        if (newPassword.length < 8) {
            return setPasswordMessage({ type: 'error', text: "Password must be at least 8 characters." });
        }

        setIsChangingPassword(true);
        try {
            const result = await changePassword(user.id, currentPassword, newPassword);
            if (result.success) {
                setPasswordMessage({ type: 'success', text: "Password changed successfully!" });
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setPasswordMessage({ type: 'error', text: result.message || "An error occurred." });
            }
        } catch (error) {
             setPasswordMessage({ type: 'error', text: "Failed to change password." });
        } finally {
             setIsChangingPassword(false);
        }
    };


    const Message: React.FC<{ message: { type: 'success' | 'error', text: string } | null }> = ({ message }) => {
        if (!message) return null;
        const baseClasses = 'text-sm p-2 rounded-md mt-2';
        const typeClasses = message.type === 'success'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800';
        return <div className={`${baseClasses} ${typeClasses}`}>{message.text}</div>;
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto animate-fade-in-up">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-nimasa-dark mb-1 flex items-center"><SignatureIcon className="w-5 h-5 mr-2 text-nimasa-green"/> E-Signature</h3>
                <p className="text-sm text-gray-500 mb-4">Upload an image of your signature. This will be used when you append your signature to reports. A transparent PNG is recommended.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Current Signature</p>
                        <div className="border rounded-lg p-4 bg-gray-50 h-32 flex items-center justify-center">
                            {user.eSignatureUrl ? <img src={user.eSignatureUrl} alt="E-Signature" className="max-h-full max-w-full" /> : <p className="text-gray-400">No signature uploaded.</p>}
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">New Signature Preview</p>
                        <div className="border rounded-lg p-4 bg-gray-50 h-32 flex items-center justify-center">
                           {signaturePreview ? <img src={signaturePreview} alt="Signature Preview" className="max-h-full max-w-full" /> : <p className="text-gray-400">Upload an image to see a preview.</p>}
                        </div>
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                     <div>
                        <input type="file" accept="image/*" ref={signatureInputRef} onChange={handleFileChange} className="hidden" />
                        <button onClick={() => signatureInputRef.current?.click()} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center text-sm">
                            <UploadCloudIcon className="w-4 h-4 mr-2" /> Choose Image
                        </button>
                    </div>
                    <button onClick={handleSaveSignature} disabled={!signaturePreview || isSavingSignature} className="bg-nimasa-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-nimasa-dark transition-colors flex items-center text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                        {isSavingSignature ? <Spinner className="w-5 h-5 mr-2"/> : <CheckCircleIcon className="w-5 h-5 mr-2" />}
                        Save Signature
                    </button>
                </div>
                 <Message message={signatureMessage} />
            </div>

             <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-nimasa-dark mb-4 flex items-center"><KeyIcon className="w-5 h-5 mr-2 text-nimasa-green"/>Change Password</h3>
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Current Password</label>
                        <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className="mt-1 block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-nimasa-green focus:border-nimasa-green" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="mt-1 block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-nimasa-green focus:border-nimasa-green" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="mt-1 block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-nimasa-green focus:border-nimasa-green" />
                    </div>
                    <div className="text-right">
                         <button type="submit" disabled={isChangingPassword} className="bg-nimasa-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-nimasa-dark transition-colors flex items-center text-sm disabled:opacity-50 disabled:cursor-not-allowed ml-auto">
                            {isChangingPassword ? <Spinner className="w-5 h-5 mr-2"/> : <KeyIcon className="w-5 h-5 mr-2" />}
                            Update Password
                        </button>
                    </div>
                </form>
                <Message message={passwordMessage} />
            </div>
        </div>
    );
};


// -- MAIN DASHBOARD CONTAINER -- //

const Dashboard: React.FC = () => {
    const { user, updateAuthUser } = useAuth();
    const [view, setView] = useState('dashboard'); // dashboard, reports, users, profile
    const [reports, setReports] = useState<Report[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>(MOCK_USERS);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchReports = useCallback(async () => {
        if (user) {
            setLoading(true);
            const userReports = await getReportsForUser(user);
            setReports(userReports);
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const handleReportUpdate = (updatedReport: Report) => {
        setReports(prev => prev.map(r => r.id === updatedReport.id ? updatedReport : r));
        setSelectedReport(updatedReport);
    };

    const handleNewReport = async () => {
        if(!user) return;
        const newReport = await createReport(user);
        setReports(prev => [newReport, ...prev]);
        setSelectedReport(newReport);
        setView('reports');
    };
    
    const handleSelectReport = (report: Report) => {
        setSelectedReport(report);
        setView('reports');
    }
    
    const handleNavigate = (newView: string) => {
        if(newView !== 'reports') {
            setSelectedReport(null);
        }
        setView(newView);
    };

    const handleUserUpdate = async (userToUpdate: User) => {
        try {
            const updatedUser = await updateUser(userToUpdate);
            setAllUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
        } catch (error) {
            console.error("Failed to update user:", error);
            // In a real app, show a toast notification
        }
    };
    
    const handleUserDelete = async (userId: string) => {
        try {
            await deleteUser(userId);
            setAllUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
        } catch (error) {
            console.error("Failed to delete user:", error);
        }
    };

     const handleProfileUpdate = async (updatedUserData: Partial<User>) => {
        if (!user) return;
        const userToUpdate = { ...user, ...updatedUserData };
        try {
            const updatedUserFromApi = await updateUser(userToUpdate);
            updateAuthUser(updatedUserFromApi); // Update context
            setAllUsers(prev => prev.map(u => u.id === updatedUserFromApi.id ? updatedUserFromApi : u));
        } catch (error) {
            console.error("Failed to update profile:", error);
            throw error; // Re-throw for the component to handle UI
        }
    };

    const renderContent = () => {
        if (loading) return <div className="flex justify-center items-center h-64"><Spinner className="w-12 h-12 text-nimasa-green" /></div>;

        const canCreateReport = user?.role === Role.Staff;

        if (view === 'reports' && selectedReport) {
            return <ReportEditor report={selectedReport} onBack={() => setSelectedReport(null)} onReportUpdate={handleReportUpdate} />;
        }
        
        if (view === 'reports' || (user?.role === Role.Staff && view === 'dashboard')) {
             return <ReportList reports={reports} onSelectReport={handleSelectReport} onNewReport={handleNewReport} showNewReportButton={canCreateReport} />;
        }
        
        if (user?.role === Role.DirectorGeneral && view === 'dashboard') {
            return <DGAnalyticsDashboard />;
        }
        
        if (view === 'users' && user?.role === Role.Admin) {
            return <UserManagement users={allUsers} onUpdateUser={handleUserUpdate} onDeleteUser={handleUserDelete} />
        }
        
        if(view === 'profile' && user) {
            return <UserProfile user={user} onProfileUpdate={handleProfileUpdate} />
        }
        
        // Default dashboards for other roles
        if (view === 'dashboard') {
            return <ReportList reports={reports.slice(0, 5)} onSelectReport={handleSelectReport} onNewReport={handleNewReport} showNewReportButton={canCreateReport} />;
        }

        return <p>Welcome to your dashboard.</p>;
    };

    const getHeaderTitle = () => {
        if (view === 'reports' && selectedReport) return "Report Editor";
        if (view === 'reports') return "All Reports";
        if (view === 'users') return "User Management";
        if (view === 'profile') return "Profile Settings";
        return "Dashboard Overview";
    };

    return (
        <div className="bg-nimasa-lightBlue min-h-screen">
            <Sidebar onNavigate={handleNavigate} activeView={view} />
            <div className="ml-64">
                <Header title={getHeaderTitle()} onNavigate={handleNavigate} />
                <main className="p-8">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
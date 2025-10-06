import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Loader2, PlusCircle } from 'lucide-react';
import LogForm from '../components/custom/LogForm';
import { useState } from 'react';
import { format } from 'date-fns';

const fetchLogs = async () => {
  const { data } = await api.get('/logs');
  return data;
};

export default function LogsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { data: logs, isLoading, isError } = useQuery({
    queryKey: ['studyLogs'],
    queryFn: fetchLogs,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-100">Study Logs</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-300 text-slate-950 font-semibold rounded-lg hover:bg-blue-200 transition-colors"
        >
          <PlusCircle size={20} />
          <span>New Log</span>
        </button>
      </div>

      <LogForm isOpen={isFormOpen} setIsOpen={setIsFormOpen} />

      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
        {isLoading && <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin text-blue-300" /></div>}
        {isError && <div>Error loading logs.</div>}
        {logs && logs.length > 0 ? (
          <ul className="space-y-4">
            {logs.map(log => (
              <li key={log.id} className="p-4 bg-slate-800/50 rounded-lg flex justify-between items-center">
                <div>
                  <span className="font-semibold text-blue-300">{log.skill}</span>
                  <p className="text-slate-400">{log.note || 'No note'}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{log.durationMin} minutes</p>
                  <p className="text-sm text-slate-500">{format(new Date(log.logDate), 'MMM d, yyyy')}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-400 text-center py-8">No logs yet. Add your first study session!</p>
        )}
      </div>
    </div>
  );
}
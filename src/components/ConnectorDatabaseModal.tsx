import React, { useState } from 'react';
import {
  Database, X, CheckCircle2, AlertCircle, Wifi, WifiOff, RefreshCw, Plus, Trash2, Eye, EyeOff, Zap, Server, Cloud, Globe
} from 'lucide-react';

interface ConnectorDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type DBType = 'postgresql' | 'mongodb' | 'firebase' | 'rest_api';
type ConnStatus = 'idle' | 'testing' | 'connected' | 'error';

interface Connection {
  id: string;
  name: string;
  type: DBType;
  status: ConnStatus;
  host?: string;
  port?: string;
  dbName?: string;
  username?: string;
  password?: string;
  connectionString?: string;
  apiUrl?: string;
  apiToken?: string;
  lastConnected?: string;
}

const DB_ICONS: Record<DBType, React.ReactNode> = {
  postgresql: <Server className="w-4 h-4" />,
  mongodb: <Database className="w-4 h-4" />,
  firebase: <Cloud className="w-4 h-4" />,
  rest_api: <Globe className="w-4 h-4" />,
};

const DB_COLORS: Record<DBType, string> = {
  postgresql: 'bg-blue-100 text-blue-800 border-blue-200',
  mongodb: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  firebase: 'bg-amber-100 text-amber-800 border-amber-200',
  rest_api: 'bg-violet-100 text-violet-800 border-violet-200',
};

const SAMPLE_CONNECTIONS: Connection[] = [
  { id: '1', name: 'Apex Core Banking DB', type: 'postgresql', status: 'connected', host: 'db.apexbank.internal', port: '5432', dbName: 'aml_transactions', username: 'aml_reader', password: '••••••••', lastConnected: '2 min ago' },
  { id: '2', name: 'Transaction Graph Store', type: 'mongodb', status: 'idle', connectionString: 'mongodb+srv://cluster.apexbank.net/graphdb', lastConnected: '1 hour ago' },
  { id: '3', name: 'Real-time Alerts API', type: 'rest_api', status: 'idle', apiUrl: 'https://api.apexbank.com/v2/aml', apiToken: '••••••••••••••••' },
];

export const ConnectorDatabaseModal: React.FC<ConnectorDatabaseModalProps> = ({ isOpen, onClose }) => {
  const [connections, setConnections] = useState<Connection[]>(SAMPLE_CONNECTIONS);
  const [activeConn, setActiveConn] = useState<Connection | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [newType, setNewType] = useState<DBType>('postgresql');
  const [showPassword, setShowPassword] = useState(false);
  const [newConn, setNewConn] = useState<Partial<Connection>>({ name: '', host: '', port: '5432', dbName: '', username: '', password: '', connectionString: '', apiUrl: '', apiToken: '' });

  if (!isOpen) return null;

  const testConnection = (id: string) => {
    setConnections(prev => prev.map(c => c.id === id ? { ...c, status: 'testing' } : c));
    setTimeout(() => {
      setConnections(prev => prev.map(c => c.id === id ? { ...c, status: Math.random() > 0.2 ? 'connected' : 'error', lastConnected: 'just now' } : c));
    }, 2000);
  };

  const deleteConnection = (id: string) => {
    setConnections(prev => prev.filter(c => c.id !== id));
    if (activeConn?.id === id) setActiveConn(null);
  };

  const addConnection = () => {
    const conn: Connection = {
      id: Date.now().toString(),
      name: newConn.name || 'New Connection',
      type: newType,
      status: 'idle',
      ...newConn,
    };
    setConnections(prev => [...prev, conn]);
    setAddingNew(false);
    setNewConn({ name: '', host: '', port: '5432', dbName: '', username: '', password: '' });
  };

  const statusConfig = {
    idle: { icon: <WifiOff className="w-3.5 h-3.5" />, label: 'Idle', cls: 'text-slate-500 bg-slate-100' },
    testing: { icon: <RefreshCw className="w-3.5 h-3.5 animate-spin" />, label: 'Testing…', cls: 'text-amber-700 bg-amber-100' },
    connected: { icon: <Wifi className="w-3.5 h-3.5" />, label: 'Connected', cls: 'text-emerald-700 bg-emerald-100' },
    error: { icon: <AlertCircle className="w-3.5 h-3.5" />, label: 'Error', cls: 'text-red-700 bg-red-100' },
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center">
            <Database className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 font-mono">Connector Database</h2>
            <p className="text-xs text-slate-500">PostgreSQL · MongoDB · Firebase · REST API</p>
          </div>
          <button onClick={onClose} className="ml-auto p-1.5 rounded-lg hover:bg-slate-200 text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left: Connection List */}
          <div className="w-64 border-r border-slate-100 flex flex-col">
            <div className="p-3 border-b border-slate-100">
              <button
                onClick={() => setAddingNew(true)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Connection
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {connections.map(conn => {
                const st = statusConfig[conn.status];
                return (
                  <div
                    key={conn.id}
                    onClick={() => { setActiveConn(conn); setAddingNew(false); }}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all border ${
                      activeConn?.id === conn.id ? 'border-emerald-300 bg-emerald-50' : 'border-transparent hover:bg-slate-50'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg border text-xs ${DB_COLORS[conn.type]}`}>{DB_ICONS[conn.type]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate font-mono">{conn.name}</p>
                      <p className="text-[10px] text-slate-400 uppercase mt-0.5">{conn.type.replace('_', ' ')}</p>
                      <div className={`inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${st.cls}`}>
                        {st.icon} {st.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Detail Panel */}
          <div className="flex-1 overflow-y-auto p-5">
            {addingNew ? (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 font-mono">New Database Connection</h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 font-mono mb-1.5">Connection Name</label>
                  <input value={newConn.name} onChange={e => setNewConn(p => ({ ...p, name: e.target.value }))} placeholder="My Database" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-200 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 font-mono mb-1.5">Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['postgresql', 'mongodb', 'firebase', 'rest_api'] as DBType[]).map(t => (
                      <button key={t} onClick={() => setNewType(t)} className={`flex items-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold font-mono transition-all ${newType === t ? DB_COLORS[t] : 'border-slate-200 text-slate-600'}`}>
                        {DB_ICONS[t]} {t.replace('_', ' ').toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                {(newType === 'postgresql') && (
                  <>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2"><label className="block text-[10px] font-semibold text-slate-600 font-mono mb-1">Host</label><input value={newConn.host} onChange={e => setNewConn(p => ({ ...p, host: e.target.value }))} placeholder="localhost" className="w-full px-2.5 py-2 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-200 outline-none" /></div>
                      <div><label className="block text-[10px] font-semibold text-slate-600 font-mono mb-1">Port</label><input value={newConn.port} onChange={e => setNewConn(p => ({ ...p, port: e.target.value }))} placeholder="5432" className="w-full px-2.5 py-2 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-200 outline-none" /></div>
                    </div>
                    <div><label className="block text-[10px] font-semibold text-slate-600 font-mono mb-1">Database Name</label><input value={newConn.dbName} onChange={e => setNewConn(p => ({ ...p, dbName: e.target.value }))} placeholder="aml_db" className="w-full px-2.5 py-2 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-200 outline-none" /></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div><label className="block text-[10px] font-semibold text-slate-600 font-mono mb-1">Username</label><input value={newConn.username} onChange={e => setNewConn(p => ({ ...p, username: e.target.value }))} className="w-full px-2.5 py-2 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-200 outline-none" /></div>
                      <div><label className="block text-[10px] font-semibold text-slate-600 font-mono mb-1">Password</label><input type="password" value={newConn.password} onChange={e => setNewConn(p => ({ ...p, password: e.target.value }))} className="w-full px-2.5 py-2 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-200 outline-none" /></div>
                    </div>
                  </>
                )}
                {newType === 'mongodb' && (
                  <div><label className="block text-xs font-semibold text-slate-700 font-mono mb-1.5">Connection String</label><input value={newConn.connectionString} onChange={e => setNewConn(p => ({ ...p, connectionString: e.target.value }))} placeholder="mongodb+srv://..." className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-200 outline-none" /></div>
                )}
                {newType === 'rest_api' && (
                  <>
                    <div><label className="block text-xs font-semibold text-slate-700 font-mono mb-1.5">API Endpoint URL</label><input value={newConn.apiUrl} onChange={e => setNewConn(p => ({ ...p, apiUrl: e.target.value }))} placeholder="https://api.example.com/v1" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-200 outline-none" /></div>
                    <div><label className="block text-xs font-semibold text-slate-700 font-mono mb-1.5">Auth Token</label><input type="password" value={newConn.apiToken} onChange={e => setNewConn(p => ({ ...p, apiToken: e.target.value }))} placeholder="Bearer token..." className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-200 outline-none" /></div>
                  </>
                )}
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setAddingNew(false)} className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
                  <button onClick={addConnection} className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold">Save Connection</button>
                </div>
              </div>
            ) : activeConn ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl border text-sm ${DB_COLORS[activeConn.type]}`}>{DB_ICONS[activeConn.type]}</div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 font-mono">{activeConn.name}</h3>
                    <p className="text-xs text-slate-500 uppercase font-mono">{activeConn.type.replace('_', ' ')}</p>
                  </div>
                  <div className={`ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${statusConfig[activeConn.status].cls}`}>
                    {statusConfig[activeConn.status].icon}
                    {statusConfig[activeConn.status].label}
                  </div>
                </div>
                {activeConn.lastConnected && (
                  <p className="text-[11px] text-slate-400 font-mono">Last connected: {activeConn.lastConnected}</p>
                )}
                <div className="grid grid-cols-2 gap-3">
                  {activeConn.host && <div className="p-3 rounded-xl bg-slate-50 border border-slate-100"><p className="text-[10px] text-slate-400 font-mono">HOST</p><p className="text-xs font-semibold font-mono text-slate-800 mt-0.5">{activeConn.host}:{activeConn.port}</p></div>}
                  {activeConn.dbName && <div className="p-3 rounded-xl bg-slate-50 border border-slate-100"><p className="text-[10px] text-slate-400 font-mono">DATABASE</p><p className="text-xs font-semibold font-mono text-slate-800 mt-0.5">{activeConn.dbName}</p></div>}
                  {activeConn.username && <div className="p-3 rounded-xl bg-slate-50 border border-slate-100"><p className="text-[10px] text-slate-400 font-mono">USERNAME</p><p className="text-xs font-semibold font-mono text-slate-800 mt-0.5">{activeConn.username}</p></div>}
                  {activeConn.connectionString && <div className="col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-100"><p className="text-[10px] text-slate-400 font-mono">CONNECTION STRING</p><p className="text-xs font-semibold font-mono text-slate-800 mt-0.5 truncate">{activeConn.connectionString}</p></div>}
                  {activeConn.apiUrl && <div className="col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-100"><p className="text-[10px] text-slate-400 font-mono">API ENDPOINT</p><p className="text-xs font-semibold font-mono text-slate-800 mt-0.5 break-all">{activeConn.apiUrl}</p></div>}
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => testConnection(activeConn.id)} disabled={activeConn.status === 'testing'} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold disabled:opacity-60 transition-colors">
                    <Zap className="w-3.5 h-3.5" /> Test Connection
                  </button>
                  <button onClick={() => deleteConnection(activeConn.id)} className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <Database className="w-12 h-12 text-slate-200 mb-3" />
                <p className="text-sm font-semibold text-slate-400 font-mono">Select a connection or add new</p>
                <p className="text-xs text-slate-300 mt-1">PostgreSQL, MongoDB, Firebase, REST API</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

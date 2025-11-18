import React, { useState, useEffect } from 'react';

// --- VERSÃO DEMONSTRAÇÃO (OFFLINE) ---
// Como o ambiente de preview não tem Firebase instalado,
// simulamos o banco de dados para você testar a interface.

// --- Ícones ---
const BookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.496 0c-.04.031-.079.062-.118.094m12.734 0a48.108 48.108 0 01-3.478-.397m-12.496 0c.04.031.079.062.118.094m-9.38 0l-0.087.065C2.012 5.86 1.5 6.67 1.5 7.5v1.5c0 .83.512 1.64.974 2.11l.087.065M1.889 7.661c.28.103.567.19.86.265m18.5 0c.293-.075.58-.162.86-.265m0 0l-0.087-.065C21.988 5.86 22.5 6.67 22.5 7.5v1.5c0 .83-.512 1.64-.974 2.11l-.087-.065M21.111 7.661c-.28-.103-.567-.19-.86-.265" /></svg>;
const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>;

const getTaskBadgeColor = (tipo) => {
  if (tipo === 'Diagnóstico') return 'bg-blue-100 text-blue-800 border-blue-200';
  if (tipo === 'Embasamento') return 'bg-purple-100 text-purple-800 border-purple-200';
  if (tipo === 'Fixação') return 'bg-green-100 text-green-800 border-green-200';
  return 'bg-gray-100 text-gray-800 border-gray-200';
};

// --- Componentes ---

// 1. Biblioteca
function ProjectLibrary({ projetos, onSelectProject, onCreateProject }) {
  const handleDownload = (projeto) => {
    const data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projeto, null, 2));
    const a = document.createElement('a');
    a.href = data;
    a.download = `${projeto.nome || 'projeto'}.json`;
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Meus Planos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projetos?.length > 0 ? projetos.map(p => (
          <div key={p.id} onClick={() => onSelectProject(p)} className="bg-white rounded-xl shadow hover:shadow-md border cursor-pointer overflow-hidden group relative transition-all">
            <div className="h-24 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
              <BookIcon />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900 truncate">{p.nome}</h3>
              <p className="text-xs text-gray-500">{p.estrutura?.length || 0} Semanas</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); handleDownload(p); }} className="absolute top-2 right-2 p-1.5 bg-white/20 rounded-full text-white hover:bg-white/40">
              <DownloadIcon />
            </button>
          </div>
        )) : (
          <div className="col-span-full text-center py-8 text-gray-400">
            Nenhum plano encontrado. Crie o primeiro!
          </div>
        )}
        <div onClick={onCreateProject} className="h-40 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-white transition-all text-gray-400 hover:text-blue-500">
          <PlusIcon /><span className="mt-2 font-medium">Novo Plano</span>
        </div>
      </div>
    </div>
  );
}

// 2. Criador (Wizard)
function ProjectCreator({ onBack, onSave }) {
  const [nome, setNome] = useState("");
  const [estrutura, setEstrutura] = useState([{ semana: 1, nome: "Rota 01", macroAssuntos: [] }]);
  const [open, setOpen] = useState({});

  const toggle = (id) => setOpen(p => ({ ...p, [id]: !p[id] }));

  // Helpers CRUD
  const addSem = () => setEstrutura(p => [...p, { semana: p.length + 1, nome: `Rota ${p.length + 1}`, macroAssuntos: [] }]);
  const delSem = (idx) => setEstrutura(p => p.filter((_, i) => i !== idx).map((s, i) => ({ ...s, semana: i + 1, nome: s.nome.startsWith("Rota") ? `Rota ${i + 1}` : s.nome })));
  const upSem = (idx, v) => setEstrutura(p => p.map((s, i) => i === idx ? { ...s, nome: v } : s));

  const addMac = (sIdx) => setEstrutura(p => p.map((s, i) => i === sIdx ? { ...s, macroAssuntos: [...(s.macroAssuntos||[]), { nome: "", assuntos: [] }] } : s));
  const delMac = (sIdx, mIdx) => setEstrutura(p => p.map((s, i) => i === sIdx ? { ...s, macroAssuntos: s.macroAssuntos.filter((_, j) => j !== mIdx) } : s));
  const upMac = (sIdx, mIdx, v) => setEstrutura(p => p.map((s, i) => i === sIdx ? { ...s, macroAssuntos: s.macroAssuntos.map((m, j) => j === mIdx ? { ...m, nome: v } : m) } : s));

  const addAss = (sIdx, mIdx) => setEstrutura(p => p.map((s, i) => i === sIdx ? { ...s, macroAssuntos: s.macroAssuntos.map((m, j) => j === mIdx ? { ...m, assuntos: [...(m.assuntos||[]), { nome: "", tarefas: [] }] } : m) } : s));
  const delAss = (sIdx, mIdx, aIdx) => setEstrutura(p => p.map((s, i) => i === sIdx ? { ...s, macroAssuntos: s.macroAssuntos.map((m, j) => j === mIdx ? { ...m, assuntos: m.assuntos.filter((_, k) => k !== aIdx) } : m) } : s));
  const upAss = (sIdx, mIdx, aIdx, v) => setEstrutura(p => p.map((s, i) => i === sIdx ? { ...s, macroAssuntos: s.macroAssuntos.map((m, j) => j === mIdx ? { ...m, assuntos: m.assuntos.map((a, k) => k === aIdx ? { ...a, nome: v } : a) } : m) } : s));

  const addTar = (sIdx, mIdx, aIdx) => setEstrutura(p => p.map((s, i) => i === sIdx ? { ...s, macroAssuntos: s.macroAssuntos.map((m, j) => j === mIdx ? { ...m, assuntos: m.assuntos.map((a, k) => k === aIdx ? { ...a, tarefas: [...(a.tarefas||[]), { descricao: "", tipo: "Diagnóstico", concluido: false }] } : a) } : m) } : s));
  const delTar = (sIdx, mIdx, aIdx, tIdx) => setEstrutura(p => p.map((s, i) => i === sIdx ? { ...s, macroAssuntos: s.macroAssuntos.map((m, j) => j === mIdx ? { ...m, assuntos: m.assuntos.map((a, k) => k === aIdx ? { ...a, tarefas: a.tarefas.filter((_, l) => l !== tIdx) } : a) } : m) } : s));
  const upTar = (sIdx, mIdx, aIdx, tIdx, f, v) => setEstrutura(p => p.map((s, i) => i === sIdx ? { ...s, macroAssuntos: s.macroAssuntos.map((m, j) => j === mIdx ? { ...m, assuntos: m.assuntos.map((a, k) => k === aIdx ? { ...a, tarefas: a.tarefas.map((t, l) => l === tIdx ? { ...t, [f]: v } : t) } : a) } : m) } : s));

  const handleSave = () => {
    if (!nome.trim()) return alert("Digite um nome para o plano.");
    onSave({
      id: Date.now().toString(),
      nome,
      estrutura,
      createdAt: new Date().toISOString()
    });
    onBack();
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 pb-24">
      <div className="flex justify-between mb-6"><button onClick={onBack} className="text-gray-500 hover:underline">← Voltar</button><h1 className="font-bold text-xl">Novo Plano</h1></div>
      <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">
        <label className="block text-sm font-bold mb-1 text-gray-700">Nome do Projeto</label>
        <input value={nome} onChange={e=>setNome(e.target.value)} className="w-full p-2 border rounded outline-none focus:border-blue-500" placeholder="Ex: Concurso 2025" />
      </div>

      <div className="space-y-3">
        {estrutura.map((sem, sIdx) => (
          <div key={sIdx} className="bg-white rounded border overflow-hidden shadow-sm">
            <div onClick={()=>toggle(`s-${sIdx}`)} className="flex items-center p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
              <span className="font-bold text-gray-400 w-8">{sem.semana}.</span>
              <input value={sem.nome} onClick={e=>e.stopPropagation()} onChange={e=>upSem(sIdx, e.target.value)} className="flex-1 bg-transparent outline-none font-semibold text-gray-800" />
              <button onClick={e=>{e.stopPropagation(); delSem(sIdx)}} className="p-2 text-gray-300 hover:text-red-500"><TrashIcon /></button>
              <div className={`ml-2 transform transition ${open[`s-${sIdx}`]?'rotate-180':''}`}><ChevronDownIcon /></div>
            </div>
            {open[`s-${sIdx}`] && (
              <div className="p-4 border-t bg-white">
                <div className="pl-2 border-l-2 border-blue-100 space-y-4">
                  {sem.macroAssuntos?.map((mac, mIdx) => (
                    <div key={mIdx}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-1 rounded">MACRO</span>
                        <input value={mac.nome} onChange={e=>upMac(sIdx, mIdx, e.target.value)} className="flex-1 p-1 border-b border-dashed border-gray-300 hover:border-blue-400 outline-none text-sm" placeholder="Nome do Macro" />
                        <button onClick={()=>delMac(sIdx, mIdx)} className="text-gray-300 hover:text-red-500"><TrashIcon /></button>
                        <button onClick={()=>toggle(`m-${sIdx}-${mIdx}`)} className="text-xs text-blue-500 hover:underline font-medium">{open[`m-${sIdx}-${mIdx}`] ? 'Recolher' : 'Detalhes'}</button>
                      </div>
                      {open[`m-${sIdx}-${mIdx}`] && (
                        <div className="pl-4 space-y-3 mt-2 mb-4">
                          {mac.assuntos?.map((ass, aIdx) => (
                            <div key={aIdx} className="bg-gray-50 p-3 rounded border border-gray-100">
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs font-bold text-purple-600">Assunto:</span>
                                <input value={ass.nome} onChange={e=>upAss(sIdx, mIdx, aIdx, e.target.value)} className="flex-1 bg-transparent border-b border-gray-300 outline-none text-sm font-medium" placeholder="Nome do Assunto" />
                                <button onClick={()=>delAss(sIdx, mIdx, aIdx)} className="text-gray-300 hover:text-red-500"><TrashIcon /></button>
                              </div>
                              <div className="space-y-2 pl-2">
                                {ass.tarefas?.map((tar, tIdx) => (
                                  <div key={tIdx} className="flex items-center gap-2 bg-white p-2 rounded border shadow-sm">
                                    <select value={tar.tipo} onChange={e=>upTar(sIdx, mIdx, aIdx, tIdx, 'tipo', e.target.value)} className="text-[10px] bg-gray-100 rounded p-1 outline-none border-r border-gray-200 cursor-pointer"><option>Diagnóstico</option><option>Embasamento</option><option>Fixação</option></select>
                                    <input value={tar.descricao} onChange={e=>upTar(sIdx, mIdx, aIdx, tIdx, 'descricao', e.target.value)} className="flex-1 text-xs outline-none" placeholder="Descrição..." />
                                    <button onClick={()=>delTar(sIdx, mIdx, aIdx, tIdx)} className="text-gray-300 hover:text-red-500"><TrashIcon /></button>
                                  </div>
                                ))}
                                <button onClick={()=>addTar(sIdx, mIdx, aIdx)} className="text-xs text-green-600 font-bold hover:underline py-1">+ Nova Tarefa</button>
                              </div>
                            </div>
                          ))}
                          <button onClick={()=>addAss(sIdx, mIdx)} className="text-xs text-purple-600 font-bold hover:underline">+ Novo Assunto</button>
                        </div>
                      )}
                    </div>
                  ))}
                  <button onClick={()=>addMac(sIdx)} className="text-sm text-blue-600 font-medium hover:bg-blue-50 px-3 py-1 rounded transition border border-blue-100">+ Adicionar Macro Assunto</button>
                </div>
              </div>
            )}
          </div>
        ))}
        <button onClick={addSem} className="w-full py-3 border-2 border-dashed rounded-xl text-gray-500 hover:border-blue-500 hover:text-blue-500 font-medium transition-colors">+ Adicionar Semana</button>
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t flex justify-center z-10 shadow-lg">
        <button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow hover:shadow-xl transform transition active:scale-95">Salvar Plano (Demo)</button>
      </div>
    </div>
  );
}

// 3. Dashboard
function StudyDashboard({ initialData, onBack, onUpdate }) {
  const [proj, setProj] = useState(initialData);

  // Atualiza quando o initialData muda
  useEffect(() => { setProj(initialData); }, [initialData]);

  const toggleCheck = (sIdx, mIdx, aIdx, tIdx, val) => {
    if (!proj) return;
    const nova = JSON.parse(JSON.stringify(proj.estrutura));
    if (nova[sIdx]?.macroAssuntos?.[mIdx]?.assuntos?.[aIdx]?.tarefas?.[tIdx]) {
      nova[sIdx].macroAssuntos[mIdx].assuntos[aIdx].tarefas[tIdx].concluido = !val;
      const updatedProj = { ...proj, estrutura: nova };
      setProj(updatedProj);
      onUpdate(updatedProj); // Salva no estado principal
    }
  };

  if (!proj) return <div className="p-10 text-center text-red-500">Erro ao carregar.</div>;

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 pb-20 font-sans">
      <div className="flex justify-between items-center mb-8">
        <button onClick={onBack} className="text-gray-500 hover:text-black flex items-center gap-1">← Voltar</button>
        <div className="text-right">
          <h1 className="text-2xl font-bold text-gray-900">{proj.nome}</h1>
          <span className="text-xs text-gray-400">Modo Demonstração</span>
        </div>
      </div>
      <div className="space-y-8">
        {proj.estrutura?.map((sem, sIdx) => (
          <div key={sIdx}>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
              <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded">{sem.semana}</span>
              {sem.nome}
            </h2>
            <div className="grid gap-6">
              {sem.macroAssuntos?.length > 0 ? sem.macroAssuntos.map((mac, mIdx) => (
                <div key={mIdx} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b font-bold text-gray-700 flex justify-between">
                    {mac.nome}
                    <span className="text-xs font-normal text-gray-500 bg-white border px-2 rounded flex items-center">{mac.assuntos?.length || 0} Assuntos</span>
                  </div>
                  <div className="p-5 space-y-6">
                    {mac.assuntos?.map((ass, aIdx) => (
                      <div key={aIdx} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500"></div>{ass.nome}</h4>
                        <div className="pl-4 space-y-2">
                          {ass.tarefas?.map((tar, tIdx) => (
                            <label key={tIdx} className={`flex items-start gap-3 p-2 rounded-lg transition-all cursor-pointer border ${tar.concluido ? 'bg-green-50 border-green-100' : 'bg-white border-transparent hover:bg-gray-50'}`}>
                              <div className="relative flex items-center mt-0.5">
                                <input type="checkbox" checked={tar.concluido} onChange={()=>toggleCheck(sIdx, mIdx, aIdx, tIdx, tar.concluido)} className="peer w-5 h-5 rounded border-gray-300 checked:bg-green-500 checked:border-green-500 transition-all appearance-none border cursor-pointer" />
                                <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 pointer-events-none"><CheckIcon /></div>
                              </div>
                              <div className="flex-1">
                                <span className={`text-sm ${tar.concluido ? 'text-gray-500 line-through' : 'text-gray-700'}`}>{tar.descricao}</span>
                              </div>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wide ${getTaskBadgeColor(tar.tipo)}`}>{tar.tipo}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )) : <p className="text-gray-400 italic">Sem conteúdo.</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- APP PRINCIPAL ---
export default function App() {
  const [view, setView] = useState('library');
  const [selectedProject, setSelectedProject] = useState(null);
  // Estado "Mock" (Banco de Dados Local)
  const [projs, setProjs] = useState([]);

  const handleUpdateProject = (updatedProj) => {
    setProjs(prev => prev.map(p => p.id === updatedProj.id ? updatedProj : p));
    setSelectedProject(updatedProj);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
      <header className="bg-white border-b sticky top-0 z-20 px-4 py-3 flex justify-between items-center shadow-sm">
        <div className="font-bold text-lg flex items-center gap-2 text-indigo-600"><BookIcon /> StudyManager Pro</div>
        <div className="text-xs font-medium px-2 py-1 rounded bg-yellow-100 text-yellow-800 border border-yellow-200">Modo Preview (Offline)</div>
      </header>

      <main>
        {view === 'library' && (
          <ProjectLibrary 
            projetos={projs} 
            onSelectProject={(p) => { setSelectedProject(p); setView('study'); }} 
            onCreateProject={() => setView('create')} 
          />
        )}
        
        {view === 'create' && (
          <ProjectCreator 
            onBack={() => setView('library')} 
            onSave={(novo) => setProjs(prev => [novo, ...prev])}
          />
        )}
        
        {view === 'study' && (
          <StudyDashboard 
            initialData={selectedProject}
            onUpdate={handleUpdateProject}
            onBack={() => { setSelectedProject(null); setView('library'); }} 
          />
        )}
      </main>
    </div>
  );
}